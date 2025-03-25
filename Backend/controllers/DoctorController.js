import mongoose from 'mongoose';
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from 'jsonwebtoken'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js";


//Doctor availability
const changeAvilability = async (req,res)=>{
  try{
    const{docId} = req.body

    const docData = await Doctor.findById(docId)
    await Doctor.findByIdAndUpdate(docId, {available: !docData.available})
    res.json({success:true, message:'Availability Changed'})
  }catch(error){
    console.error("Error changing availability:", error);
    res.status(500).json({ 
        success: false, 
        message: "Internal server error"
    });
  }
}


// Multer setup to handle file uploads in memory
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
      experience, 
      about, 
      fees, 
      date,  // Make sure date is included
      address 
    } = req.body;

    // Check if a doctor with the same email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor with this email already exists" 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary
    let imageUrl = req.body.image || "default.jpg";  // Use provided image or default
    if (req.file) {
      console.log("Uploading image to Cloudinary...");
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "doctors" }, 
            (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
              } else {
                console.log("Cloudinary Upload Result:", result);
                resolve(result);
              }
            }
          );
          
          const bufferStream = require('stream').Readable.from(req.file.buffer);
          bufferStream.pipe(uploadStream);
        });
        
        imageUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Error uploading to Cloudinary:", cloudinaryError);
        // Continue with default or provided image if upload fails
      }
    }

    // Create new doctor entry
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      date: Number(date),  // Ensure date is included and converted to Number
      address,
      available: true,
      slotsBooked: {}
    });

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
    console.error("Error adding doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};


const doctorList = async(req, res)=>{
  try {
    const doctors = await Doctor.find({}).select(['-password', '-email'])
    res.json({success:true, doctors})
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
}

//api for doctor login 
const loginDoctor = async(req, res) => {
  try {
    const { email, password } = req.body
    console.log("Login attempt for:", email)
    
    const doctor = await doctorModel.findOne({ email })
    console.log("Doctor found:", doctor ? "Yes" : "No")
    
    if(!doctor) {
      return res.json({ success: false, message: "Invalid credentials" })
    }

    console.log("Stored password hash:", doctor.password)
    console.log("Attempting to compare with entered password")
    
    const isMatch = await bcrypt.compare(password, doctor.password)
    console.log("Password match:", isMatch ? "Yes" : "No")
    
    if(isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
}

{/*
const getDoctorProfile = async (req, res) => {
  try {
    const token = req.headers.dtoken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    res.json({ success: true, doctor });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

*/}


//api to get doctors appointment for doc model
const appointmentsDoctor = async(req, res) => {
  try {
    // Get token from headers
    const token = req.headers.dtoken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    // Decode the token to get the doctor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const docId = decoded.id;
    
    console.log('Doctor ID from token:', docId);
    
    // Convert string ID to MongoDB ObjectId before querying
    const objectId = new mongoose.Types.ObjectId(docId);
    
    // Find appointments for this doctor using the ObjectId
    const appointments = await appointmentModel.find({ docId: objectId });
    console.log('Found appointments:', appointments.length);
    
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching appointments", 
      error: error.message 
    });
  }
};

//api to mark appointment completed for doctor panel
const appointmentComplete = async(req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if(appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark failed" });
    }
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
};

//api to cancel appointment for doctor panel
const appointmentCancel = async(req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    
    if(appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
};


//api to get dashboard data foe doc panel
const doctorDashboard = async(req,res)=>{
  try {
    // Get doctor ID from token instead of body
    const token = req.headers.dtoken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    // Decode the token to get the doctor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const docId = decoded.id;
    
    const appointments = await appointmentModel.find({docId})
    let earnings = 0
    appointments.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings += item.amount
      }
    })

    let patients = []
    appointments.map((item)=>{
      if(patients.includes(item._userId)){
        patients.push(item.userId) 
      }
    })

    const dashData = {
      earnings,
      appointments:appointments.length,
      patients:patients.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });  
  }
}


//API TO GET DOCTOR PROFILE FROM DOC PANEL
const doctorProfile = async(req,res)=>{
  try {
    // Get doctor ID from token instead of body
    const token = req.headers.dtoken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    // Decode the token to get the doctor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const docId = decoded.id;
    
    // Use findById with the ID directly, not with an object
    const profileData = await doctorModel.findById(docId).select('-password');
    
    if (!profileData) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor profile not found" 
      });
    }
    
    res.json({success: true, profileData});
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
}

//api to updateDoctorprofile data from doctor panel
const updateDoctorProfile = async(req,res)=>{
  try {
    // Get doctor ID from token instead of body
    const token = req.headers.dtoken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    // Decode the token to get the doctor ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const docId = decoded.id;
    
    const { fees, address, available } = req.body;
    
    // Use findByIdAndUpdate with the ID directly, not with an object
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    res.json({success: true, message: 'Profile Updated' });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
}




// Export multer upload middleware
export { upload,
   changeAvilability, 
   doctorList, loginDoctor,
   doctorProfile,
   updateDoctorProfile,
  appointmentsDoctor, appointmentComplete, appointmentCancel , doctorDashboard,
};
