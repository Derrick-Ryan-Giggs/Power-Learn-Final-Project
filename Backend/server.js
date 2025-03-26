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
const allowedOrigins = [
    'https://power-learn-final-project-8.vercel.app',
    'https://power-learn-final-project-5.vercel.app',
    'https://power-learn-final-project-3.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With',
        'Access-Control-Allow-Credentials',
        'token'
    ],
    credentials: true
}));

// Middleware to manually set headers for OPTIONS preflight
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Credentials, token');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middlewares
app.use(express.json());

// API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/user', userRouter);

// Root Route
app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
