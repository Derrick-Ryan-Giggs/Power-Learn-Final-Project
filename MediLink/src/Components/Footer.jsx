import React from 'react';

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* Left */}
        <div>
          <p 
            className='text-3xl font-bold text-[#005761] transition-all duration-500 ease-in-out hover:text-gray-700 hover:scale-105'
          >
            MediLink
          </p>
          <p className='w-full md:w-2/3 text-gray-600 leading-tight mt-2'>
            MediLink is a cutting-edge appointment booking platform designed to connect patients with top healthcare professionals. Our seamless interface allows users to book medical appointments with ease, ensuring timely and efficient healthcare access.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className='text-xl font-medium mb-5 text-[#005761]'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>Home</li>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>About Us</li>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>Contact Us</li>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>Privacy Policy</li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <p className='text-xl font-medium mb-5 text-[#005761]'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>+254757285175</li>
            <li className='hover:text-[#005761] transition-all duration-300 cursor-pointer'>gderrick768@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center text-gray-600'>
          Copyright 2024@ <span className='text-[#005761] font-semibold'>MediLink</span> - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
