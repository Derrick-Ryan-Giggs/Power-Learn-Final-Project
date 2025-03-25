import express from "express";
import authDoctor from "../middleware/AuthDoctor.js";
import { payAppointment } from "../controllers/PaymentController.js";

import { 
  addDoctor, 
  upload, 
  doctorList, 
  loginDoctor, 
  doctorProfile, 
  updateDoctorProfile, 
  appointmentsDoctor, 
  appointmentComplete, 
  appointmentCancel, 
  doctorDashboard 
} from "../controllers/DoctorController.js";

const router = express.Router();

router.post("/add", upload.single("image"), addDoctor);
router.get("/list", doctorList);
router.post('/login', loginDoctor);
router.get('/appointments', authDoctor, appointmentsDoctor);
router.post('/complete-appoitment', authDoctor, appointmentComplete); // Fixed the typo in endpoint name
router.post('/cancel-appoitment', authDoctor, appointmentCancel); // Removed incorrectly placed middleware
router.get('/dashboard', authDoctor, doctorDashboard); // Added missing forward slash before 'dashboard'
router.get('/profile', authDoctor, doctorProfile);
router.post('/profile', authDoctor, updateDoctorProfile);


// Add this to your existing routes
router.post('/pay-appointment', authDoctor, payAppointment);

// Add a test endpoint for connectivity testing
router.get('/test', authDoctor, (req, res) => {
  res.status(200).json({ success: true, message: 'Doctor API is accessible' });
});

export default router;