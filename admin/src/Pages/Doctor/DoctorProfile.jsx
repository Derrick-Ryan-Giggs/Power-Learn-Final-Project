import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
    const { profileData, setProfileData, getProfileData, dToken, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            // Fixed API endpoint syntax
            const endpoint = `${backendUrl}/api/doctor/profile`

            const updateData = {
                address: {
                    line1: profileData.address.line1,
                    line2: profileData.address.line2
                },
                fees: profileData.fees,
                available: profileData.available
            }

            const config = {
                headers: {
                    'dToken': dToken,
                    'Content-Type': 'application/json'
                }
            }

            const response = await axios.post(endpoint, updateData, config)

            if (response.data.success) {
                toast.success(response.data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(response.data.message || 'Profile update failed')
            }
        } catch (error) {
            console.error('Full Error:', error)

            if (error.response) {
                toast.error(error.response.data.message || 'Server error occurred')
            } else if (error.request) {
                toast.error('No response from server')
            } else {
                toast.error('Error preparing request')
            }
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData ? (
        <div className='flex flex-col gap-4 m-5'>
            <div>
                {/* Doctor Profile Image */}
                <div>
                    <img 
                        className='bg-primary/80 w-full sm:max-w-64 rounded-lg' 
                        src={profileData.image} 
                        alt={`Profile of ${profileData.name}`} 
                    />
                </div>

                {/* Doctor Information */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {profileData.name}
                    </p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {profileData.experience}
                        </button>
                    </div>

                    {/* About Section */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
                            About:
                        </p>
                        {isEdit ? (
                            <textarea 
                                className='w-full text-sm text-gray-600 max-w-[700px] mt-1 border p-2'
                                onChange={(e) => setProfileData(prev => ({...prev, about: e.target.value}))}
                                value={profileData.about}
                            />
                        ) : (
                            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                                {profileData.about}
                            </p>
                        )}
                    </div>

                    {/* Appointment Fee */}
                    <p className='text-gray-700 font-medium mt-4'>
                        Appointment Fee: 
                        <span className='text-gray-800'>
                            {currency} {isEdit ? (
                                <input 
                                    type='number' 
                                    className='border px-2 py-1 ml-2'
                                    onChange={(e) => setProfileData(prev => ({...prev, fees: e.target.value}))} 
                                    value={profileData.fees} 
                                />
                            ) : (
                                profileData.fees
                            )}
                        </span>
                    </p>

                    {/* Address Section */}
                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit ? (
                                <input 
                                    type='text' 
                                    className='border px-2 py-1 mb-2 w-full'
                                    onChange={(e) => setProfileData(prev => ({
                                        ...prev, 
                                        address: {...prev.address, line1: e.target.value}
                                    }))} 
                                    value={profileData.address.line1} 
                                />
                            ) : (
                                profileData.address.line1
                            )}
                            <br />
                            {isEdit ? (
                                <input 
                                    type='text' 
                                    className='border px-2 py-1 w-full'
                                    onChange={(e) => setProfileData(prev => ({
                                        ...prev, 
                                        address: {...prev.address, line2: e.target.value}
                                    }))} 
                                    value={profileData.address.line2} 
                                />
                            ) : (
                                profileData.address.line2
                            )}
                        </p>
                    </div>

                    {/* Availability Section - Styled with Theme Color */}
                    <div className='flex gap-1 pt-2 items-center'>
                        <input 
                            checked={profileData.available} 
                            type='checkbox' 
                            name='availability' 
                            id='availability' 
                            className='accent-primary w-4 h-4'
                            onChange={() => setProfileData(prev => ({
                                ...prev, 
                                available: !prev.available
                            }))}
                            disabled={!isEdit}
                        />
                        <label htmlFor='availability' className='text-primary font-medium'>
                            Available
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 mt-5'>
                        {!isEdit ? (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className='px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={updateProfile}
                                    className='px-4 py-1 bg-primary text-white text-sm rounded-full hover:opacity-90 transition-all'
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setIsEdit(false)}
                                    className='px-4 py-1 border border-gray-300 text-sm rounded-full hover:bg-gray-100 transition-all'
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default DoctorProfile
