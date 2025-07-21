import express from "express";
import { protectDoctor } from "../middleware/authMiddleware.js";
import { registerDoctor, loginDoctor, getDoctorProfile, updateDoctorProfile , searchDoctors, toggleAvailability} from "../controllers/doctorAuthController.js";
import upload from "../middleware/uploads.js"; 

const router = express.Router();


router.post("/register", upload.single("profileImage"), registerDoctor);
router.post("/login", loginDoctor);
router.get("/profile", protectDoctor, getDoctorProfile);
router.put("/profile", protectDoctor,  upload.single("profileImage"), updateDoctorProfile);
router.put('/availability', protectDoctor, toggleAvailability); // ✅ Availability route

router.get('/search', searchDoctors);

export default router;

