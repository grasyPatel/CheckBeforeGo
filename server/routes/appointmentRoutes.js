// routes/appointmentRoutes.js
import express from "express";
import { 
  cancelAppointment, 
  createAppointment, 
  getUserAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatusByDoctor 
} from "../controllers/appointmentController.js";
import { verifyUser, protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

// Book an appointment (user must be logged in)
router.post("/", verifyUser, createAppointment);

// Get appointments for a logged-in user
router.get("/user/:id", verifyUser, getUserAppointments);

// Cancel appointment by user
router.delete("/:id", verifyUser, cancelAppointment);

// Doctor-specific routes
router.get('/doctor/:id', protectDoctor, getDoctorAppointments);
router.put('/doctor/:id/status', protectDoctor, updateAppointmentStatusByDoctor);

export default router;