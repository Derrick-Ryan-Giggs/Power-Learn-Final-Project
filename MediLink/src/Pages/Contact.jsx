import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='px-6 md:px-16'>
      {/* Header Section */}
      <div className='text-center text-2xl pt-10 text-primary font-bold'>
        <p>CONTACT <span className='text-gray-700'>US</span></p>
      </div>

      {/* Contact Details Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full max-w-[360px]' src={assets.contact_image} alt="Contact" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-primary'>Our OFFICE</p>
          <p className='text-gray-600'>Matunda <br /> Kenya</p>
          <p className='text-gray-600'>Tel : +254757285175 <br />Email: gderrick768@gmail.com</p>

          <p className='font-semibold text-lg text-primary'>Careers at MEDILINK</p>
          <p className='text-gray-600'>Learn more about our job openings</p>

          <button className='border border-primary text-primary px-8 py-3 text-sm rounded-full hover:bg-primary hover:text-white transition-all duration-300'>
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
