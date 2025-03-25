import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'

const DoctorDashBoard = () => {
   const { dashData, setDashData, getDashData, dToken, completeAppoitment, cancelAppoitment } = useContext(DoctorContext)
   const { currency, slotDateFormat } = useContext(AppContext)

   useEffect(() => {
     if (dToken) {
       getDashData()
     }
   }, [dToken])

   // Helper function to sort and prioritize appointments
   const sortAppointments = (appointments) => {
     return appointments.sort((a, b) => {
       // Priority: 
       // 1. Not cancelled and not completed (pending)
       // 2. Cancelled
       // 3. Completed
       if (!a.cancelled && !a.isCompleted && (b.cancelled || b.isCompleted)) return -1
       if ((a.cancelled || a.isCompleted) && !b.cancelled && !b.isCompleted) return 1
       
       // If same status, sort by most recent first
       return new Date(b.slotDate) - new Date(a.slotDate)
     })
   }

   return dashData && (
     <div className='m-5'>
       <div className='flex flex-wrap gap-3'>
         <div className='flex items-center gap-2 min-w-52 p-4 bg-white rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
           <img className='w-14' src={assets.earning_icon} alt="" />
           <div>
             <p className='text-xl font-semibold text-gray-600'>{dashData.earnings}</p>
             <p className='text-gray-400'>Earnings</p>
           </div>
         </div>
         
         <div className='flex items-center gap-2 min-w-52 p-4 bg-white rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
           <img className='w-14' src={assets.appointments_icon} alt="" />
           <div>
             <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
             <p className='text-gray-400'>Appointments</p>
           </div>
         </div>
         
         <div className='flex items-center gap-2 min-w-52 p-4 bg-white rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
           <img className='w-14' src={assets.patients_icon} alt="" />
           <div>
             <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
             <p className='text-gray-400'>Patients</p>
           </div>
         </div>
       </div>
       
       <div className='bg-white'>
         <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
           <img src={assets.list_icon} alt="" />
           <p className='font-semibold'>Latest Bookings</p>
         </div>
         
         <div className='p-4 border border-t-0'>
           {dashData.latestAppointments.length === 0 ? (
             <div className='text-center text-gray-500'>No recent bookings</div>
           ) : (
             sortAppointments(dashData.latestAppointments).map((item, index) => (
               <div 
                 className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' 
                 key={item._id || index}
               >
                 <img 
                   className='rounded-full w-10 h-10 object-cover' 
                   src={item.userData.image} 
                   alt={item.userData.name} 
                 />
                 <div className='flex-1 text-sm'>
                   <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                   <p className='text-gray-600'>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                 </div>
                 
                 {item.cancelled ? (
                   <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                 ) : item.isCompleted ? (
                   <p className='text-green-500 text-xs font-medium'>Completed</p>
                 ) : (
                   <div className='flex items-center gap-2'>
                     <img 
                       onClick={() => cancelAppoitment(item._id)} 
                       className='w-8 h-8 cursor-pointer hover:scale-110 transition-transform' 
                       src={assets.cancel_icon} 
                       alt="Cancel" 
                     />
                     <img 
                       onClick={() => completeAppoitment(item._id)} 
                       className='w-8 h-8 cursor-pointer hover:scale-110 transition-transform' 
                       src={assets.tick_icon} 
                       alt="Complete" 
                     />
                   </div>
                 )}
               </div>
             ))
           )}
         </div>
       </div>
     </div>
   )
}

export default DoctorDashBoard