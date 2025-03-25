import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loaduserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)

  const updateuserProfileData = async() => {
    try {
      const formData = new FormData()
      formData.append('userId', userData._id)
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      
      // Only append image if a new one is selected
      if (image && image instanceof File) {
        formData.append('image', image)
      }
  
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (data.success) {
        toast.success(data.message)
        await loaduserProfileData()
        setIsEdit(false)
        setImage(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {  
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  if (!userData) {
    return <div>Loading profile...</div>
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {isEdit ? (
        <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer w-36 h-36 rounded-full overflow-hidden'>
            <img 
              className='w-full h-full object-cover' 
              src={image ? URL.createObjectURL(image) : userData.image} 
              alt="Profile" 
            />
            <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
              <img 
                className='w-10 h-10' 
                src={assets.upload_icon} 
                alt="Upload"
                onError={(e) => {
                  console.log("Upload icon failed to load");
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<span class="text-white font-bold">Upload</span>';
                }}
              />
            </div>
          </div>
          <input 
            onChange={(e) => e.target.files[0] && setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
            accept="image/*"
          />
        </label>
      ) : (
        <img 
          className='w-36 h-36 rounded-full object-cover' 
          src={userData.image} 
          alt="Profile" 
        />
      )}

      {isEdit ? (
        <input 
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 px-2 py-1 rounded' 
          value={userData.name || ''} 
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
          type="text" 
        />
      ) : (
        <p className='font-medium text-3xl mt-4 text-neutral-800'>{userData.name}</p>
      )}
      
      <hr className='bg-zinc-200 h-[1px] border-none my-2' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id :</p>
          <p className='text-blue-500'>{userData.email}</p>
          
          <p className='font-medium'>Phone :</p>
          {isEdit ? (
            <input 
              className='bg-gray-100 max-w-52 px-2 py-1 rounded' 
              value={userData.phone || ''} 
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
              type="text" 
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}
          
          <p className='font-medium'>Address :</p>
          {isEdit ? (
            <div>
              <input 
                className='bg-gray-50 w-full px-2 py-1 rounded mb-1' 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line1: e.target.value } 
                }))} 
                value={userData.address?.line1 || ''} 
                type="text" 
                placeholder="Address Line 1"
              />
              <br />
              <input 
                className='bg-gray-50 w-full px-2 py-1 rounded' 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line2: e.target.value } 
                }))} 
                value={userData.address?.line2 || ''} 
                type="text" 
                placeholder="Address Line 2"
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1}
              <br />
              {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender :</p>
          {isEdit ? (
            <select 
              className='max-w-20 bg-gray-100 px-2 py-1 rounded' 
              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
              value={userData.gender || 'Male'}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}
          
          <p className='font-medium'>Birthday :</p>
          {isEdit ? (
            <input 
              className='max-w-40 bg-gray-100 px-2 py-1 rounded' 
              type='date'
              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
              value={userData.dob || ''} 
            />
          ) : (
            <p className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>
      
      <div className='mt-10'>
        {isEdit ? (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' 
            onClick={updateuserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' 
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile