# MediLink - Medical Doctor Booking Appointment System

## 🏥 Project Overview

MediLink is a medical appointment booking system designed to simplify the process of scheduling medical consultations. The platform provides intuitive interfaces for patients, doctors, and administrators to manage healthcare appointments efficiently.

## 🌟 Features

### Patient Features
- User registration and profile management
- Doctor search and discovery
- Easy appointment booking
- View upcoming appointments
- Cancel or reschedule appointments

### Doctor Features
- Professional profile creation
- Availability management
- Appointment scheduling
- View and manage appointments

### Admin Features
- User and doctor management
- Appointment oversight
- System configuration

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- State Management

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary (Image Storage)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📦 Project Structure

```
MediLink/
│
├── MediLink/           # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│
├── admin/              # Admin Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│
└── backend/            # Backend Services
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── middlewares/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/MediLink.git
cd MediLink
```

2. Install Dependencies
```bash
# Frontend
cd MediLink
npm install

# Admin
cd ../admin
npm install

# Backend
cd ../backend
npm install
```

3. Environment Variables

#### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:4000/api
```

#### Backend `.env`
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running Locally

1. Start Backend
```bash
cd backend
npm run dev
```

2. Start Frontend
```bash
cd MediLink
npm run dev
```

3. Start Admin Dashboard
```bash
cd admin
npm run dev
```

## 🌐 Deployment

### Frontend & Admin (Vercel)
- Connect GitHub repository
- Set root directory
- Configure build settings
- Set environment variables

### Backend (Render)
- Web Service deployment
- Set environment variables
- Configure build and start commands

## 🔒 Security Features
- JWT Authentication
- Password Encryption
- CORS Configuration
- Environment-based Configuration
- Input Validation

## 📊 Key Technologies

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - gderrick768@gmail.com

Project Link: [https://github.com/yourusername/MediLink](https://github.com/yourusername/MediLink)

## 🙏 Acknowledgements
- React
- Tailwind CSS
- Node.js
- Express
- MongoDB
- Cloudinary
```
