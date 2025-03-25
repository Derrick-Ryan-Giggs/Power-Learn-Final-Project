import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { AppContext } from '../../Context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
    const { dToken, appointments, getAppointments, completeAppoitment, cancelAppoitment } = useContext(DoctorContext)
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        // Only fetch appointments on initial load or if dToken changes
        if (isInitialLoad && dToken) {
            getAppointments()
            setIsInitialLoad(false)
        }
    }, [dToken, isInitialLoad, getAppointments])

    // Helper function to safely format age
    const formatAge = (dob) => {
        try {
            if (!dob) return '-'
            const age = calculateAge(dob)
            return (age === null || isNaN(age)) ? '-' : String(age)
        } catch (error) {
            console.error('Error calculating age:', error)
            return '-'
        }
    }

    // If no appointments, show a message
    if (!appointments || appointments.length === 0) {
        return (
            <div className="w-full max-w-6xl m-5">
                <p className='mb-3 text-lg font-medium'>Doctor Appointments</p>
                <div className='bg-white border rounded text-sm p-6 text-center text-gray-500'>
                    No appointments available
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl m-5">
            <p className='mb-3 text-lg font-medium'>
                Doctor Appointments
            </p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {appointments.map((item, index) => (
                    <div 
                        className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' 
                        key={item._id || index}
                    >
                        <p className='max-sm:hidden'>{index + 1}</p>
                        <div className='flex items-center gap-2'>
                            <img 
                                className='w-8 h-8 rounded-full object-cover' 
                                src={item.userData?.image || assets.default_avatar} 
                                alt={item.userData?.name || 'Patient'} 
                            />
                            <p>{item.userData?.name || 'Unknown Patient'}</p>
                        </div>
                        <div>
                            <p className='text-xs inline border border-primary px-2 rounded-full'>
                                {item.payment ? 'Online' : 'Cash'}
                            </p>
                        </div>
                        <p className='max-sm:hidden'>
                            {formatAge(item.userData?.dob)}
                        </p>
                        <p>
                            {slotDateFormat(item.slotDate)}, {item.slotTime || '-'}
                        </p>
                        <p>{currency}{item.amount || '-'}</p>
                        {item.cancelled ? (
                            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                        ) : item.isCompleted ? (
                            <p className='text-green-500 text-xs font-medium'>Completed</p>
                        ) : (
                            <div className='flex'>
                                <img 
                                    onClick={() => cancelAppoitment(item._id)} 
                                    className='w-10 cursor-pointer' 
                                    src={assets.cancel_icon} 
                                    alt="Cancel" 
                                />
                                <img 
                                    onClick={() => completeAppoitment(item._id)} 
                                    className='w-10 cursor-pointer' 
                                    src={assets.tick_icon} 
                                    alt="Complete" 
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorAppointment