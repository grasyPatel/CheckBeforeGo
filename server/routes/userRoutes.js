import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/userAuthController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "User routes are working!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyUser, getUserProfile);
router.put("/profile", verifyUser, updateUserProfile);

export default router;
