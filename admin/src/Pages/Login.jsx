import React from 'react'
import { assets } from '../assets/assets'
import { useState, useContext } from 'react'
import { AdminContext } from '../Context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../Context/DoctorContext.jsx'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setaToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onsubmitHandler = async(event) => {
    event.preventDefault()
    
    try {
      if(state === 'Admin') {
        console.log("Attempting admin login with:", email);
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        console.log("Admin login response:", data);
        if(data.success) {
          localStorage.setItem('aToken', data.token)
          setaToken(data.token)
          toast.success('Admin login successful!')
          // Fixed redirect path to match route definition
          window.location.href = '/admin-dashboard';
        } else {
          toast.error(data.message || 'Login failed. Please check your credentials.')
        }
      } else {
        console.log("Attempting doctor login with:", email);
        const { data } = await axios.post(backendUrl + '/api/doctors/login', { email, password }) // Changed to match backend route
        console.log("Doctor login response:", data);
        if(data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          console.log(data.token)
          toast.success('Doctor login successful!')
          // Fixed redirect path to match route definition
          window.location.href = '/doctor-dashboard'
        } else {
          toast.error(data.message || 'Login failed. Please check your credentials.')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      )
    }
  }

  return (
    <form onSubmit={onsubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'> <span className='text-primary'>{state}</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=> setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e)=> setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary w-full text-white py-2 rounded-md text-base'>Login</button>
        {
          state==='Admin'
            ? <p>Doctor Login ? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click Here</span></p>
            : <p>Admin Login ? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click Here</span></p>
        }
      </div>
    </form>
  )
}

export default Login