import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
      <h1 className='text-3xl font-medium text-[#0005761]'>Find By Speciality</h1>
      <p className='w-1/3 text-center text-sm text-[#0005761]'>
        Simply Browse Through Our Extensive List Of Trusted Doctors. Schedule Your Appointment Hassle Free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[10px] transition-all duration-500'
            key={index}
            to={`/doctors/${item.speciality}`}
          >
         
            <p className='text-[#005761] font-medium'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
