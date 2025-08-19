## 🚀 Deployment# 🩺 Real-Time Doctor Availability & Finder Platform

A comprehensive web application built with the MERN stack that connects patients with available doctors in real-time, featuring location-based search, availability tracking, and seamless appointment discovery.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![MERN Stack](https://img.shields.io/badge/stack-MERN-blue)
[![Live Demo](https://img.shields.io/badge/Demo-Live-blue)](https://checkbeforegohelp.onrender.com/)


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contact](#contact)

## 🎯 Overview

The Real-Time Doctor Availability & Finder Platform addresses the critical problem of finding available healthcare professionals in real-time. This platform enables doctors to manage their availability status while allowing patients to search and locate nearby available doctors based on specialization, location, and real-time availability.

### 🚀 Problem Statement

Patients often struggle to find available doctors in their area, leading to unnecessary delays in healthcare access. This platform bridges the gap by providing real-time availability information and location-based search capabilities.

## ✨ Features

### For Doctors
- 👨‍⚕️ **Profile Management**: Complete doctor profiles with specialization, clinic details, and contact information
- 📍 **Location Integration**: Set clinic/hospital location using Google Maps
- 🔄 **Availability Toggle**: Real-time availability status updates
- 📧 **Daily Reminders**: Automated reminders to update availability status
- 🏥 **Hospital Management**: Hospital name and location management
- 📅 **Appointment Management**: View, confirm, or cancel patient appointments
- ⏰ **Schedule Management**: Set and update consultation timings
- 📊 **Appointment Dashboard**: Track appointment history and statistics

### For Patients
- 🔍 **Advanced Search**: Search by doctor name, specialization, location, or hospital
- 🗺️ **Map Integration**: Visual location display with Google Maps
- ⚡ **Real-time Status**: Live availability indicators
- 📱 **Responsive Design**: Mobile-first responsive interface
- 👤 **User Accounts**: Personal accounts for saved searches and preferences
- 📅 **Appointment Booking**: Schedule appointments with available doctors
- 📋 **Appointment Management**: View, cancel, and track appointment status
- 🔔 **Appointment Notifications**: Get updates on appointment confirmations

### Core Functionality
- 🔐 **Secure Authentication**: JWT-based authentication system
- 🌐 **RESTful APIs**: Well-structured API endpoints
- 📊 **Real-time Updates**: Live status updates using modern web technologies
- 🔔 **Notification System**: Automated reminder system for doctors

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js | User interface and interactions |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **State Management** | Redux Toolkit | Application state management |
| **Backend** | Node.js + Express.js | Server-side logic and APIs |
| **Database** | MongoDB + Mongoose | Data storage and modeling |
| **Authentication** | JWT | Secure user authentication |
| **Maps** | Google Maps API | Location services and mapping |
| **Task Scheduling** | node-cron | Automated reminder system |
| **HTTP Client** | Axios | API communication |
| **Image Storage**  | Cloudinary | Cloud Storage | 

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary API key

### Clone the Repository
```bash
git clone https://github.com/grasyPatel/CheckBeforeGo.git
cd CheckBeforeGo
```

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=8080
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080

```

### Start the Application
```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

## 💻 Usage

### For Doctors
1. **Registration**: Create a doctor account with professional details
2. **Profile Setup**: Add specialization, hospital information, and set location on map
3. **Availability Management**: Toggle availability status as needed
4. **Appointment Management**: View, confirm, or cancel patient appointments
5. **Schedule Updates**: Update consultation timings and availability
6. **Daily Updates**: Respond to daily reminder notifications

### For Patients
1. **Search Doctors**: Use the search functionality to find doctors by various criteria
2. **View Profiles**: Access detailed doctor profiles and availability status
3. **Location Services**: View doctor locations on interactive maps
4. **Book Appointments**: Schedule appointments with available doctors
5. **Manage Appointments**: View, reschedule, or cancel existing appointments
6. **Account Management**: Create accounts for personalized experience

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User/Doctor registration
POST /api/auth/login       # User/Doctor login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
```

### Doctor Endpoints
```
GET    /api/doctors           # Get all doctors
GET    /api/doctors/:id       # Get specific doctor
POST   /api/doctors           # Create doctor profile
PUT    /api/doctors/:id       # Update doctor profile
PATCH  /api/doctors/:id/availability  # Toggle availability
```

### Search Endpoints
```
GET /api/search/doctors?specialty=cardiology    # Search by specialty
GET /api/search/doctors?location=mumbai         # Search by location
GET /api/search/doctors?name=john               # Search by name
```

### Appointment Endpoints
```
GET    /api/appointments         # Get user's appointments
GET    /api/appointments/doctor/:id  # Get doctor's appointments
POST   /api/appointments         # Book new appointment
PUT    /api/appointments/:id     # Update appointment status
DELETE /api/appointments/:id     # Cancel appointment
```

## 📁 Project Structure

```
doctor-finder-platform/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable components
│       ├── pages/             # Page components
│       ├── services/          # API services
│       ├── store/             # Redux store
│       ├── styles/            # CSS files
│       └── utils/             # Utility functions
├── server/                    # Node.js backend
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── app.js                # Express app setup
├── docs/                     # Documentation
├── .gitignore
├── README.md
└── package.json
```

## 🗄️ Database Schema

### Doctor Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  hospitalName: { type: String, required: true },
  location: { type: String, required: true },
  timings: { type: String, required: true },
  mapLocation: String, // Google Maps link or coordinates
  availability: { type: Boolean, default: false },
  profileImage: { type: String, default: "" }, // Cloudinary URL
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  phone: { type: String },
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  doctor: { type: ObjectId, ref: "Doctor", required: true },
  user: { type: ObjectId, ref: "User", required: true },
  issue: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Cancelled"], 
    default: "Pending" 
  },
  cancelReason: { type: String, default: "" },
  createdAt: Date,
  updatedAt: Date
}
```


## 🚧 Development Progress & Roadmap

### ✅ Completed Features
- [x] User and Doctor Authentication System
- [x] Doctor Profile Management
- [x] Real-time Availability Toggle
- [x] Location-based Doctor Search
- [x] Responsive Frontend Design
- [x] Image Upload with Cloudinary Integration
- [x] Basic Doctor Listing and Filtering

### 🚀 In Progress
- [ ] **Appointment Booking System** (Currently Developing)
  - [x] Database Schema Design (Appointment Model)
  - [x] Frontend Appointment Booking Interface
  - [x] Backend API Endpoints for Appointments
  - [x] Appointment Status Management
  - [ ] Email Notifications for Appointments
  - [x] Calendar Integration

### 📋 Upcoming Features
- [ ] Real-time Chat between Patients and Doctors
- [ ] Payment Gateway Integration
- [ ] Advanced Search Filters
- [ ] Doctor Reviews and Ratings
- [ ] Appointment Reminder System
- [ ] Mobile App Development
- [ ] Multi-language Support

### Frontend (Vercel)
1. Connect your GitHub repository to Render (Static)
2. Set environment variables in Render dashboard
3. Deploy with automatic builds on push

### Backend (Render)
1. Connect your GitHub repository to Render (Web)
2. Set environment variables in Render dashboard
3. Deploy with automatic builds on push

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access and database users
3. Update connection string in environment variables



**Grace** - *Final Year Computer Science Student*

- GitHub: [@grasyPatel](https://github.com/grasyPatel)
- LinkedIn: [@grace_patel](https://www.linkedin.com/in/grace-patel-977216253/)
- Email: gracepatel91@gmail.com



⭐ **Star this repository if you found it helpful!**

*Built with ❤️ for better healthcare accessibility*
