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

// CORS Configuration with Flexible Origin
const corsOptions = {
    origin: function (origin, callback) {
        // List of specific allowed origins
        const specificOrigins = [
            'https://power-learn-final-project-8.vercel.app',
            'https://power-learn-final-project-3.vercel.app'
        ];

        // Allow requests with no origin 
        // or if the origin is in the specific list
        if (!origin || specificOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// Preflight request handler for all routes
app.options('*', cors(corsOptions));

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/doctors', doctorRouter); // Kept for consistency
app.use('/api/user', userRouter);

// Root Route
app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Comprehensive Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;