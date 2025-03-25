import express from 'express'
import { registerUser, loginUser , getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment} from '../controllers/UserController.js'
import authUser from '../middleware/AuthUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
// In your userRouter.js
userRouter.post('/update-profile', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err && err.message === 'Unexpected field') {
            // Continue without file upload
            return next()
        }
        if (err) {
            return res.status(400).json({ success: false, message: err.message })
        }
        next()
    })
}, authUser, updateProfile)

userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointment)
userRouter.post('/cancel-appointment',authUser, cancelAppointment)

export default userRouter;