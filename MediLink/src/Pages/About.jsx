import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      {/* About Us Heading */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span 
            className='text-gray-700 font-medium transition-all duration-500 hover:text-[#005761] hover:scale-105'
          >
            US
          </span>
        </p>
      </div>

      {/* About Us Content */}
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full max-w-[360px]' src={assets.about_image} alt="About MediLink" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>
            At <span 
              className='font-semibold text-[#005761] transition-transform duration-500 hover:scale-110'
            >
              MediLink
            </span>, we are dedicated to revolutionizing the way people access healthcare. 
            Our platform seamlessly connects patients with trusted medical professionals, 
            ensuring easy appointment booking, reduced waiting times, and improved healthcare experiences.
          </p>
          <p>
            We strive to remove barriers to healthcare accessibility by offering a user-friendly 
            digital platform that allows users to find doctors, schedule visits, and receive 
            medical care without unnecessary delays. Whether for routine checkups or specialized 
            consultations, we bring quality healthcare within reach.
          </p>

          <b className='text-gray-800'>Our Vision</b>
          <p>
            Our vision is to create a world where high-quality healthcare is accessible to everyone, 
            anytime, anywhere. We aim to bridge the gap between patients and medical professionals 
            using innovative technology to deliver fast, reliable, and personalized healthcare services.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl my-4'>
        <p>
          WHY <span 
            className='text-gray-700 font-semibold transition-all duration-500 hover:text-[#005761] hover:scale-105'
          >
            CHOOSE US
          </span>
        </p>
      </div>

      {/* Features Section */}
      <div className='flex md:flex-row flex-col mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#005761] hover:text-white transition-all duration-300'>
          <b>Efficiency :</b>
          <p>
            Our streamlined booking system reduces waiting times and ensures that you 
            get medical attention exactly when you need it, without unnecessary delays.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#005761] hover:text-white transition-all duration-300'>
          <b>Convenience :</b>
          <p>
            Available 24/7, our platform allows you to book and manage appointments at any time, 
            from any device, making healthcare more accessible than ever.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#005761] hover:text-white transition-all duration-300'>
          <b>Personalization :</b>
          <p>
            We offer tailored healthcare solutions by allowing patients to choose doctors based on 
            their specialization, availability, and patient reviews.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
