import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
   const { backendUrl, token, getDoctorsData } = useContext(AppContext)
   
   const [appointments, setAppointments] = useState([])
   const months = [
     "",
     "January ",
     "February ",
     "March ",
     "April ",
     "May ",
     "June ",
     "July ",
     "August ",
     "September ",
     "October ",
     "November ",
     "December "
   ];
   
   const slotDateFormat = (slotDate) => {
     const dateArray = slotDate.split("_")
     return dateArray[0] + "" + months[Number(dateArray[1])] + "" + dateArray[2]
   }
   
   const getUserAppointments = async () => {
     try {
       const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
       if (data.success) {
         // Add comprehensive logging
         console.log("Raw Appointments Data:", data.appointments)
         
         // Additional data validation and transformation
         const processedAppointments = data.appointments.map(appointment => {
           // Log each appointment for detailed inspection
           console.log("Individual Appointment:", appointment)
           
           // Ensure all required properties exist
           return {
             ...appointment,
             cancelled: appointment.cancelled || false,
             isCompleted: appointment.isCompleted || false
           }
         })
         
         // Sort appointments with a clear priority
         const sortedAppointments = processedAppointments.sort((a, b) => {
           // Priority: cancelled -> completed -> pending
           if (a.cancelled && !b.cancelled) return -1
           if (!a.cancelled && b.cancelled) return 1
           if (a.isCompleted && !b.isCompleted) return -1
           if (!a.isCompleted && b.isCompleted) return 1
           return 0
         })
         
         setAppointments(sortedAppointments)
       }
     } catch (error) {
       console.error("Appointments Fetch Error:", error)
       toast.error(error.response?.data?.message || error.message)
     }
   }
   
   const cancelAppointment = async (appointmentId) => {
     try {
       const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
       if (data.success) {
         toast.success(data.message)
         getUserAppointments()
         getDoctorsData()
       } else {
         toast.error(data.message)
       }
     } catch (error) {
       console.error("Cancel Appointment Error:", error)
       toast.error(error.response?.data?.message || error.message)
     }
   }
   
   useEffect(() => {
     if (token) {
       getUserAppointments()
     }
   }, [token])
   
   // Debugging: Log total appointments and their status
   useEffect(() => {
     console.log("Current Appointments State:", appointments)
     console.log("Total Appointments:", appointments.length)
     console.log("Cancelled Appointments:", appointments.filter(a => a.cancelled).length)
     console.log("Completed Appointments:", appointments.filter(a => a.isCompleted).length)
   }, [appointments])
   
   return (
     <div>
       <p className='b-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
       {appointments.length === 0 && (
         <div className='text-center text-gray-500 mt-8'>
           No appointments found
         </div>
       )}
       <div>
         {appointments.map((item, index) => (
           <div 
             className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' 
             key={item._id || index}
           >
             <div>
               <img 
                 className='w-32 bg-indigo-50' 
                 src={item.docData?.image || '/default-doctor-image.png'} 
                 alt={`Dr. ${item.docData?.name}`} 
               />
             </div>
             <div className='flex-1 text-sm text-zinc-600'>
               <p className='text-neutral-800 font-semibold'>{item.docData?.name}</p>
               <p>{item.docData?.speciality}</p>
               <p className='text-zinc-700 font-medium mt-1'>Address :</p>
               <p className='text-xs'>{item.docData?.address?.line1}</p>
               <p className='text-xs'>{item.docData?.address?.line2}</p>
               <p className='text-xs mt-1'>
                 <span className='text-sm font-medium text-neutral-700'>Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
               </p>
             </div>
             <div></div>
             <div className='flex flex-col gap-2 justify-end'>
               {!item.cancelled && !item.isCompleted && (
                 <>
                   <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                     Pay Online
                   </button>
                   <button
                     onClick={() => cancelAppointment(item._id)}
                     className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                   >
                     Cancel Appointment
                   </button>
                 </>
               )}
               {item.isCompleted && (
                 <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                   Completed
                 </button>
               )}
               {item.cancelled && (
                 <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                   Appointment Cancelled
                 </button>
               )}
             </div>
           </div>
         ))}
       </div>
     </div>
   )
}

export default MyAppointments