import express from "express";
import cors from "cors";;
import {connectDB} from "./lib/db.js"
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin:"https://checkbeforegohelp.onrender.com",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
connectDB();






app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

