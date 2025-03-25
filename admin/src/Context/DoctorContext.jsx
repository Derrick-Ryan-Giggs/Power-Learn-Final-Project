import { createContext } from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import axios from 'axios'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [appointments, setAppointments] = useState([])
    
    // Log backendUrl to verify it's correct
    console.log("Backend URL being used:", backendUrl)

    const getAppointments = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers: {dToken}})
            if(data.success) {
                setAppointments(data.appointments.reverse())
                console.log("Appointments loaded:", data.appointments)
            } else { 
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Error fetching appointments:", error)
            toast.error(error.message)
        }
    }

    const completeAppoitment = async(appoitmentId) => { 
        try {
            const {data} = await axios.post(
                backendUrl + '/api/doctor/complete-appoitment', 
                {appoitmentId}, 
                {headers: {dToken}}
            )
            
            if(data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Error completing appointment:", error)
            toast.error(error.message)
        }
    }

    const cancelAppoitment = async(appoitmentId) => {
        try {
            const {data} = await axios.post(
                backendUrl + '/api/doctor/cancel-appoitment', 
                {appoitmentId}, 
                {headers: {dToken}}
            )
            
            if(data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Error canceling appointment:", error)
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers: {dToken}})
            if(data.success) {
                setDashData(data.dashData)
                console.log("Dashboard data loaded:", data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Error fetching dashboard data:", error)
            toast.error(error.message)
        }
    }

    const getProfileData = async() => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/profile', {headers: {dToken}})
            if(data.success) {
                setProfileData(data.profileData) // Fixed: added the missing argument
                console.log("Profile data loaded:", data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Error fetching profile data:", error)
            toast.error(error.message)
        }
    }
    
    // Test function to check API connectivity
    const testConnection = async () => {
        try {
            console.log("Testing API connection with token:", dToken)
            const response = await axios.get(backendUrl + '/api/test', {headers: {dToken}})
            console.log("Connection test response:", response)
            return true
        } catch (error) {
            console.log("Connection test error:", error)
            return false
        }
    }

    const value = { 
        dToken, 
        setDToken, 
        backendUrl, 
        appointments, 
        setAppointments, 
        getAppointments,
        completeAppoitment, 
        cancelAppoitment,
        dashData, 
        setDashData, 
        getDashData, 
        profileData, 
        setProfileData, 
        getProfileData,
        testConnection
    }
    
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider