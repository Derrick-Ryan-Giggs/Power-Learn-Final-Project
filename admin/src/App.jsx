import React, { useContext } from 'react'
import Login from './Pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './Context/AdminContext'
import NavBar from './Components/NavBar'
import Sidebar from './Components/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './Pages/Admin/Dashboard'
import All_Appointments from './Pages/Admin/All_Appointments'
import AddDoctor from './Pages/Admin/AddDoctor'
import DoctorsList from './Pages/Admin/DoctorsList'
import { DoctorContext } from './Context/DoctorContext.jsx'
import DoctorDashBoard from './Pages/Doctor/DoctorDashBoard.jsx'
import DoctorAppointment from './Pages/Doctor/DoctorAppointment.jsx'
import DoctorProfile from './Pages/Doctor/DoctorProfile.jsx'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#f8f9fd]'>
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path='/admin/*' element={
            <div className='w-full'>
              <Routes>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='all-appointments' element={<All_Appointments />} />
                <Route path='add-doctor' element={<AddDoctor />} />
                <Route path='doctor-list' element={<DoctorsList />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Routes>
            </div>
          } />

          {/* Doctor routes */}
          <Route path='/doctor/*' element={
            <div className='w-full'>
              <Routes>
                <Route path='dashboard' element={<DoctorDashBoard />} />
                <Route path='appointments' element={<DoctorAppointment />} />
                <Route path='profile' element={<DoctorProfile />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Routes>
            </div>
          } />

          {/* Default redirect */}
          <Route path='/' element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App