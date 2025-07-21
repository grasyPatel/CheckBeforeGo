import jwt from "jsonwebtoken";
import  Doctor from "../models/Doctor.js";

export const protectDoctor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach doctor data to request object
    const doctor = await Doctor.findById(decoded.id).select("-password");

    if (!doctor) {
      return res.status(401).json({ message: "Unauthorized: Doctor not found" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("JWT Middleware Error:", error.message);
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

