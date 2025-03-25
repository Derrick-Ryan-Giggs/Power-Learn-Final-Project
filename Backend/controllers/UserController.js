// Fixed UserController.js
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import Doctor from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js' // Added import

//api to register user   
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing details' })
        }

        //validating email format         
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid email' })
        }

        //validating strong password         
        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter a strong password' })
        }

        //hashing user password         
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        // Generate JWT token         
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d' // Token expires in 30 days         
        })

        // Return success with token and user info         
        res.json({
            success: true,
            message: "User registered successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

//api for user login  
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if email and password are provided
        if (!email || !password) {
            return res.json({ success: false, message: 'Please provide email and password' });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            })

            return res.json({
                success: true,
                message: "Login successful",
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        } else {
            return res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

//api to get profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        console.log("Looking for user with ID:", userId)
        const userData = await userModel.findById(userId).select('-password')
        console.log("User data found:", userData)
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

//api to update userprofile
// In your UserController.js
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!userId || !name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'Data missing' })
        }
        
        await userModel.findByIdAndUpdate(userId, { 
            name, 
            phone, 
            address: JSON.parse(address), 
            dob, 
            gender 
        })

        // Only process image if a file was actually uploaded
        if (imageFile && imageFile.path) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
                const imageURL = imageUpload.secure_url
                await userModel.findByIdAndUpdate(userId, {image: imageURL})
            } catch (cloudinaryError) {
                console.log("Cloudinary error:", cloudinaryError)
                // Continue anyway, just log the error
            }
        }
        
        res.json({success: true, message: 'Profile Updated'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

//api to book appointment
const bookAppointment = async(req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await Doctor.findById(docId).select('-password') // Fixed typo in 'password'

        if(!docData.available){
            return res.json({success: false, message: "Doctor not available"}) // Fixed typo in 'false'
        }

        let slotsBooked = docData.slotsBooked || {} // Use the correct property name from your model
        //checking for slot availabilty
        if(slotsBooked[slotDate]){
            if(slotsBooked[slotDate].includes(slotTime)){
                return res.json({success: false, message: "Slot not available"}) // Fixed typo in 'false'
            } else {
                slotsBooked[slotDate].push(slotTime)
            }
        } else {
            slotsBooked[slotDate] = []
            slotsBooked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        // Create a new copy of docData to avoid modifying the reference
        const docDataCopy = JSON.parse(JSON.stringify(docData))
        delete docDataCopy.slotsBooked

        const appointmentData = {
            userId, 
            docId, 
            userData, 
            docData: docDataCopy,
            amount: docData.fees,
            slotTime, 
            slotDate, 
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in doctors data
        await Doctor.findByIdAndUpdate(docId, {slotsBooked}) // Fixed model name

        res.json({success: true, message: "Appointment Booked"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })   
    }
}


//api to get userAppointments for frontend my appointment
const listAppointment = async(req, res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message }) 
    }
}

//api ti cancel appointment
//api to cancel appointment
const cancelAppointment = async(req, res) => {
    try {
        const { userId, appointmentId } = req.body
        console.log("Cancelling appointment:", appointmentId, "for user:", userId)
        
        const appointmentData = await appointmentModel.findById(appointmentId)
        
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" })
        }
        
        // verify user appointment (convert to string for proper comparison)
        if(appointmentData.userId.toString() !== userId.toString()){
            return res.status(403).json({ success: false, message: "Unauthorized access" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //releasing doctor's slot
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


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment , cancelAppointment}