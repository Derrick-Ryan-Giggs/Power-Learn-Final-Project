import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'

const Navbar = () => {
    const navigate = useNavigate()
    const { token, setToken } = useContext(AppContext)
    const [showMenu, setShowmenu] = useState(false)

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            {/* Logo */}
            <p 
                className='text-2xl font-bold text-[#005761] hover:text-gray-700 transition-all duration-300 cursor-pointer'
                onClick={() => navigate('/')} // Navigate to Home when clicked
            >
                MediLink
            </p>

            {/* Desktop Menu */}
            <ul className='hidden md:flex items-start gap-5 font-medium text-gray-700'>
                <NavLink to='/' className='hover:text-[#005761] transition-all duration-300'>
                    <li className='py-1'>HOME</li>
                </NavLink>
                <NavLink to='/doctors' className='hover:text-[#005761] transition-all duration-300'>
                    <li className='py-1'>ALL DOCTORS</li>
                </NavLink>
                <NavLink to='/about' className='hover:text-[#005761] transition-all duration-300'>
                    <li className='py-1'>ABOUT</li>
                </NavLink>
                <NavLink to='/contact' className='hover:text-[#005761] transition-all duration-300'>
                    <li className='py-1'>CONTACT</li>
                </NavLink>
            </ul>

            {/* User Profile & Auth */}
            <div className='flex items-center gap-4'>
                {token ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className='w-8 rounded-full' src={assets.profile_pic} alt="Profile" />
                        <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />

                        {/* Dropdown Menu */}
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('my-profile')} className='hover:text-[#005761] cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('my-appointments')} className='hover:text-[#005761] cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-[#005761] cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className='bg-[#005761] text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-[#00434c] transition-all duration-300'>
                        Create Account
                    </button>
                )}

                {/* Mobile Menu Icon */}
                <img onClick={() => setShowmenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />
            </div>

            {/* Mobile Menu */}
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='justify-between flex items-center px-5 py-6'>
                    
                    <img className='w-7 cursor-pointer' onClick={() => setShowmenu(false)} src={assets.cross_icon} alt="Close" />
                </div>

                {/* Mobile Nav Links */}
                <ul className='flex flex-col items-center mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={() => setShowmenu(false)} to='/' className='px-4 py-2 rounded inline-block hover:text-[#005761] transition-all duration-300'>HOME</NavLink>
                    <NavLink onClick={() => setShowmenu(false)} to='/doctors' className='px-4 py-2 rounded inline-block hover:text-[#005761] transition-all duration-300'>ALL DOCTORS</NavLink>
                    <NavLink onClick={() => setShowmenu(false)} to='/about' className='px-4 py-2 rounded inline-block hover:text-[#005761] transition-all duration-300'>ABOUT</NavLink>
                    <NavLink onClick={() => setShowmenu(false)} to='/contact' className='px-4 py-2 rounded inline-block hover:text-[#005761] transition-all duration-300'>CONTACT</NavLink>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;


