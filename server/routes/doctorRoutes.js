import express from "express";
import dotenv from "dotenv";
import { registerDoctor, loginDoctor } from "../controllers/doctorAuthController.js";

dotenv.config();

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

export default router;

