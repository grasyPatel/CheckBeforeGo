import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/userAuthController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploads.js";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "User routes are working!" });
});

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyUser, getUserProfile);
router.put("/profile", verifyUser, upload.single("profileImage"), updateUserProfile);

export default router;
