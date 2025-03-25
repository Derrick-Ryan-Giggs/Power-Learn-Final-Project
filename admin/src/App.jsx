import React, { useContext } from 'react'
import Login from './Pages/Login'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './Context/AdminContext';
import NavBar from './Components/NavBar';
import Sidebar from './Components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Admin/Dashboard';
import All_Appointments from './Pages/Admin/All_Appointments';
import AddDoctor from './Pages/Admin/AddDoctor';
import DoctorsList from './Pages/Admin/DoctorsList';
import {DoctorContext} from './Context/DoctorContext.jsx'
import DoctorDashBoard from './Pages/Doctor/DoctorDashBoard.jsx';
import DoctorAppointment from './Pages/Doctor/DoctorAppointment.jsx'
import DoctorProfile from './Pages/Doctor/DoctorProfile.jsx';
const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  
  return aToken || dToken ? (
    <div className='bg-[#f8f9fd]'>  {/* Fixed missing closing bracket */}
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/*admin route*/}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<All_Appointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />


          {/*doctor routr*/ }
          <Route path='/doctor-dashboard' element={<DoctorDashBoard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointment />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
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