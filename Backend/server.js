import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connnectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/AdminRoute.js';
import doctorRouter from './routes/DoctorRoute.js';
import userRouter from './routes/UserRoute.js';

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database & cloudinary
connectDB();
connnectCloudinary();

// CORS Configuration
const corsOptions = {
   origin: [
     'http://localhost:5173',  // Frontend dev server
     'http://localhost:5174',  // Admin dev server
     'https://power-learn-final-project-3.vercel.app',  // Specific Vercel frontend URL
     'http://localhost:3000'   // Additional local development server
   ],
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: [
     'Content-Type', 
     'Authorization',
     'Access-Control-Allow-Credentials',
     'X-Requested-With'
   ],
   credentials: true,
   optionsSuccessStatus: 200
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/doctors', doctorRouter); // Kept for consistency
app.use('/api/user', userRouter);

// Root Route
app.get('/', (req, res) => {
   res.send('API WORKING');
});

// Error Handling Middleware (optional but recommended)
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => console.log('Server started on port', port));

export default app;