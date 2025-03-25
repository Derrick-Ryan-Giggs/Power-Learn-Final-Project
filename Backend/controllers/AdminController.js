import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from 'jsonwebtoken'
import { Readable } from 'stream';
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const addDoctor = async (req, res) => {
    try {
        console.log("Request body received:", req.body);

        const { 
            name, 
            email, 
            password, 
            speciality, 
            degree, 
            experience, // Match frontend spelling
            about, 
            fee,  
            address 
        } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ 
                success: false, 
                message: "Doctor with this email already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle image upload to Cloudinary
        let imageUrl = req.file ? req.file.originalname : "default.jpg";
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "doctors" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    
                    const bufferStream = Readable.from(req.file.buffer);
                    bufferStream.pipe(uploadStream);
                });
                
                imageUrl = result.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
            }
        }

        // Create new doctor
        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience: experience, // Match frontend spelling
            about,
            fees: Number(fee),
            date: Date.now(),
            address: JSON.parse(address),
            available: true,
            slots_booked: {}
        });

        // Save doctor
        await newDoctor.save();

        // Remove password from response
        const doctorResponse = newDoctor.toObject();
        delete doctorResponse.password;

        res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor: doctorResponse
        });

    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error"
        });
    }
};

// Admin login function
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if provided credentials match environment variables
        if (
            email === process.env.ADMIN_EMAIL && 
            password === process.env.ADMIN_PASSWORD
        ) {
            // Generate token
            const token = jwt.sign(
                email + password,
                process.env.JWT_SECRET
            );
            
            res.json({
                success: true, 
                token,
                message: "Admin login successful"
            });
        } else {
            res.status(401).json({
                success: false, 
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.error("Error in admin login:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error"
        });
    }
};


//api to get all doctprs list for admin panel 

const allDoctors = async (req, res) => {
    try {
        // Changed doctorModel to Doctor (the imported model)
        const doctors = await Doctor.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error"
        }); 
    }
}


//api to get all appointments list
const appointmentsAdmin = async(req, res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
      //  console.error("Error fetching all doctors:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message
        }); 
    }

}

//api for cancellation of appointment
const AppointmentCancell = async(req, res) => {
    try {
        const { appointmentId } = req.body
        console.log("Admin cancelling appointment:", appointmentId)
        
        const appointmentData = await appointmentModel.findById(appointmentId)
        
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" })
        }
        
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        
        // releasing doctor's slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await Doctor.findById(docId)
        let slotsBooked = doctorData.slotsBooked
        slotsBooked[slotDate] = slotsBooked[slotDate].filter(e => e !== slotTime)
        await Doctor.findByIdAndUpdate(docId, { slotsBooked })
        
        res.json({ success: true, message: "Appointment cancelled" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


//API TO GET DASHBOARD DATA FOR ADMIN PANEL
const adminDashboard = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData  = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0.5)
        }
        res.json({success:true, dashData})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })  
    }
}
export { upload, allDoctors, appointmentsAdmin , AppointmentCancell, adminDashboard};