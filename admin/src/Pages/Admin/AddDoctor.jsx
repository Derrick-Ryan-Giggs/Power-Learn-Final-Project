import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useState, useContext } from 'react'
import { AdminContext } from '../../Context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocimg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fee, setFee] = useState('')
    const [about, setAbout] = useState('')
    const [Speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
   
    const { backendUrl, aToken } = useContext(AdminContext)
    
    useEffect(() => {
        console.log("AddDoctor mounted with token:", aToken);
        console.log("Backend URL:", backendUrl);
    }, []);

    const onsubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error('Image not selected')
            }
            
            const formData = new FormData()
            
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fee', Number(fee))
            formData.append('about', about)
            formData.append('speciality', Speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            
            console.log("Sending request with token:", aToken);

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-doctor', 
                formData, 
                {
                    headers: {
                        'atoken': aToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            
            if(data.success){
                toast.success(data.message)
                setDocimg(false)
                setName('')
                setEmail('')
                setPassword('')
                setExperience('1 Year')
                setFee('')
                setAbout('')
                setSpeciality('General physician')
                setDegree('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error('Failed to add doctor: ' + (error.response?.data?.message || error.message))
        }
    }

    return (
        <form onSubmit={onsubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocimg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload Doctor <br />Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2 w-full' type="text" name="name" placeholder='Name' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 w-full' type="email" name="email" placeholder='Email' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={Speciality} className='border rounded px-3 py-2 w-full text-theme' name="speciality">
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Paedetricians">Paedetricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <p className='mb-2'>About Doctor</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' name="about" placeholder='Write about doctor' rows={5} required />
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-6 text-white rounded-full hover:bg-opacity-90 transition-colors'>Add Doctor</button>
            </div>
        </form>
    )
}

export default AddDoctor
