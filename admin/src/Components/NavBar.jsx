import React from 'react'
import { AdminContext } from '../Context/AdminContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../Context/DoctorContext'

const NavBar = () => {
    const { aToken, setaToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)  

    const navigate = useNavigate()

    const logout = () => {
        if (aToken) {
            setaToken('')
            localStorage.removeItem('aToken')
        }

        if (dToken) {
            setDToken('')  
            localStorage.removeItem('dToken')
        }

        navigate('/')
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-xs'>
                {/* Apply theme color to MediLink */}
                <p className='text-primary font-bold text-lg'>MediLink</p>  
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
                    {aToken ? 'Admin' : 'Doctor'}
                </p>
            </div>
            <button 
                onClick={logout} 
                className='bg-primary text-white text-sm px-10 py-2 rounded-full'
            >
                Logout
            </button>
        </div>
    )
}

export default NavBar
