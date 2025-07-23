// routes/appointmentRoutes.js
import express from "express";
import { cancelAppointment, createAppointment, getUserAppointments } from "../controllers/appointmentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Book an appointment (user must be logged in)
router.post("/", verifyUser, createAppointment);

// Get appointments for a logged-in user
router.get("/:id", verifyUser, getUserAppointments);

router.delete("/:id", verifyUser, cancelAppointment )

export default router;
