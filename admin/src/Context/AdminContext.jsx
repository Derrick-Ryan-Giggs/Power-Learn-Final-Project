import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"
export const AdminContext = createContext()
const AdminContextProvider = (props) => {
    const [aToken, setaToken] = useState(localStorage.getItem('aToken') || '')
    const [dToken, setdToken] = useState(localStorage.getItem('dToken') || '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const[dashData, setDashData] = useState(false)
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    
    // Add debugging
    console.log("Context initialized with admin token:", aToken)
    console.log("Context initialized with doctor token:", dToken)
    
    const getAllDoctors = async () => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers: {aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const changeAvailability = async (docId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers: {aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers: {aToken}})
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(
                backendUrl + '/api/admin/cancel-appointment', 
                {appointmentId}, 
                {headers: {aToken}}
            )
            
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getDashData = async() => {
        try {
            console.log("Fetching dashboard data...");
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard', {headers:{aToken}});
            console.log("API response:", data);
            if(data.success){
                setDashData(data.dashData);
                console.log("Dashboard data:", data.dashData);
            } else {
                toast.error(data.message);
                console.log("API error:", data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Exception:", error);
        }
    }
    
    // Add doctor profile function
    const getDoctorProfile = async () => {
        try {
            console.log("Fetching doctor profile...");
            const {data} = await axios.get(backendUrl + '/api/doctors/profile', {headers: {dToken}});
            console.log("Doctor profile response:", data);
            if(data.success){
                return data.doctor;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Doctor profile error:", error);
            return null;
        }
    }
    
    const value = {
        aToken,
        setaToken,
        dToken,
        setdToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, 
        getDashData,
        getDoctorProfile
    }
    
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider