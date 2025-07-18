import express from "express";
import cors from "cors";;
import {connectDB} from "./lib/db.js"
import dotenv from "dotenv";
import doctorRoutes from "./routes/doctorRoutes.js";
dotenv.config();

const app = express();;
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
connectDB();


app.use("/api/doctors", doctorRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

