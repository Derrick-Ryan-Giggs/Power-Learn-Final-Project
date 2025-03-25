import express from 'express';
import { addDoctor, allDoctors, appointmentsAdmin, loginAdmin, AppointmentCancell ,adminDashboard} from '../controllers/AdminController.js';
import { upload } from '../controllers/AdminController.js'; // Import upload from AdminController
import authAdmin from '../middleware/AuthAdmin.js';
import { changeAvilability } from '../controllers/DoctorController.js';

const adminRouter = express.Router();

// Add doctor route
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);

// Login route
adminRouter.post('/login', loginAdmin);

// Get all doctors route - removed loginAdmin, it doesn't belong here
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvilability);
adminRouter.get('/appointments', authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, AppointmentCancell)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

// Add this to a route file temporarily
adminRouter.get('/reset-doctor-password', async (req, res) => {
    try {
      const newPassword = "testpassword123";
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const result = await Doctor.updateOne(
        { email: "christopher.davis@example.com" },
        { $set: { password: hashedPassword } }
      );
      
      res.json({ success: true, message: 'Password reset', result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
export default adminRouter;