import React from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { useEffect, useContext } from 'react'
import { AppContext } from '../../Context/AppContext'
import { assets } from '../../../../admin/src/assets/assets'

const All_Appointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext) || {}
  const contextValue = useContext(AppContext) || {}
  const calculateAge = contextValue.calculateAge
  const currency = contextValue.currency || '$'

  useEffect(() => {
    // Only call if the function exists
    if (getAllAppointments && aToken) {
      getAllAppointments()
    }
  }, [aToken])

  // Safety check to prevent errors while context is loading
  if (!appointments) {
    return <div className='w-full max-w-6xl m-5'>Loading...</div>
  }

  const handleCancelClick = (id) => {
    console.log("Cancelling appointment:", id)
    if (cancelAppointment) {
      cancelAppointment(id)
    } else {
      console.error("cancelAppointment function is not available in context")
    }
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData?.image} alt="" />
              <p>{item.userData?.name}</p>
            </div>
            <p className="max-sm:hidden">
            {item.userData?.dob && calculateAge ? calculateAge(item.userData.dob) : '-'}
            </p>
            <p>{item.slotDate}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData?.image} alt="" />
              <p>{item.docData?.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <div>
              {item.cancelled ? 
                <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> :
                <img 
                  onClick={() => handleCancelClick(item._id)} 
                  className='w-10 cursor-pointer' 
                  src={assets.cancel_icon} 
                  alt="Cancel appointment" 
                />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default All_Appointments