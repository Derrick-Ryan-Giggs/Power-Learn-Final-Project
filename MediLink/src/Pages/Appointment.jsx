import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../Components/RelatedDoctors'
import {toast} from 'react-toastify'
import axios from 'axios'


const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfweek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [doctorsSlot, setDoctorsSlots] = useState([])
  const [slotindex, setSlotindex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocinfo = async () => {
    if (doctors && doctors.length > 0) {
      const doctor = doctors.find(doc => doc._id === docId)
      if (doctor) {
        // Ensure slotsBooked exists
        doctor.slotsBooked = doctor.slotsBooked || {}
        setDocInfo(doctor)
        console.log("Doctor info loaded:", doctor)
      } else {
        console.log("Doctor not found with ID:", docId)
      }
    } else {
      console.log("Doctors data not available yet")
    }
  }

  const getAvailableslots = async() => {
    // Don't proceed if docInfo is null
    if (!docInfo) {
      console.log("docInfo is null, can't get available slots")
      return
    }
    
    console.log("Getting available slots for doctor:", docInfo.name)
    setDoctorsSlots([])

    //getting todays date
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //settings and time of date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(24, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1 
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime
        
        // Safe access pattern for nested properties
        const isBooked = docInfo.slotsBooked && 
                         docInfo.slotsBooked[slotDate] && 
                         docInfo.slotsBooked[slotDate].includes(slotTime);
        
        const isSlotAvailable = !isBooked;
        
        if (isSlotAvailable) {
          // add slots to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        //increment current time by 30mins
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      if (timeSlots.length > 0) {
        setDoctorsSlots(prev => ([...prev, timeSlots]))
      } else {
        // Add empty array to maintain index correspondence with dates
        setDoctorsSlots(prev => ([...prev, []]))
      }
    }
  }

  const bookAppointment = async() => {
    console.log("Book appointment clicked")
    
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    
    if (!slotTime) {
      toast.warn('Please select a time slot')
      return
    }
  
    try {
      // Make sure doctorsSlot exists and has data
      if (doctorsSlot.length > 0 && doctorsSlot[slotindex] && doctorsSlot[slotindex][0]) {
        const date = doctorsSlot[slotindex][0].datetime
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
  
        const slotDate = day + "_" + month + "_" + year
        console.log("Appointment date:", slotDate)
        console.log("Selected time:", slotTime)

        const { data } = await axios.post(
          backendUrl + '/api/user/book-appointment', 
          { docId, slotDate, slotTime }, 
          { headers: { token } }
        )
        
        if (data.success) {
          toast.success(data.message)
          getDoctorsData()
          navigate('/my-appointments')
        } else {
          toast.error(data.message)
        }
      } else {
        toast.error("Please select a valid time slot")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to book appointment")
    }
  }

  useEffect(() => {
    console.log("Component mounted or doctors/docId changed")
    fetchDocinfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      console.log("docInfo updated, getting available slots")
      getAvailableslots()
    }
  }, [docInfo])

  useEffect(() => {
    console.log("Available slots updated:", doctorsSlot)
  }, [doctorsSlot])

  // Early return if docInfo is not loaded yet
  if (!docInfo) {
    return <div className="flex justify-center items-center min-h-screen">Loading doctor information...</div>
  }

  // Empty slots check
  const hasAvailableSlots = doctorsSlot.some(daySlots => daySlots.length > 0);
  
  return (
    <div>
      {/*doctor details*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*docinfo*/}
          <p className='flex items-center text-2xl gap-2 font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex gap-2 items-center text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* doctors about*/}
          <div>
            <p className='flex items-center font-medium mt-3 gap-1 text-gray-900'> About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>
    
      {/*BOOKING SLOTS*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        
        {!hasAvailableSlots && (
          <p className="text-red-500 mt-2">No slots available for booking at this time.</p>
        )}
        
        {hasAvailableSlots && (
          <>
            <div className='flex items-center w-full gap-3 overflow-x-auto mt-4'>
              {doctorsSlot.map((item, index) => (
                item.length > 0 && (
                  <div 
                    onClick={() => setSlotindex(index)} 
                    className={`text-center py-6 min-w-16 cursor-pointer rounded-full ${slotindex === index ? 'bg-primary text-white': 'border border-gray-200'}`} 
                    key={index}
                  >
                    <p>{item[0] && daysOfweek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                )
              ))}
            </div>
            
            <div className='flex items-center gap-3 w-full overflow-x-auto mt-4'>
              {doctorsSlot.length > 0 && 
               doctorsSlot[slotindex] && 
               doctorsSlot[slotindex].map((item, index) => (
                <p 
                  onClick={() => setSlotTime(item.time)} 
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} 
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
            </div>
            
            <button 
              onClick={bookAppointment} 
              disabled={!slotTime}
              className={`text-white text-sm font-light px-14 py-3 rounded-full my-6 ${slotTime ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Book an Appointment
            </button>
          </>
        )}
      </div>

      {/**listing related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment