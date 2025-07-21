import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  specialty: { type: String, required: true },
  hospitalName: { type: String, required: true },
  location: { type: String, required: true },
  timings: { type: String, required: true },

  mapLocation: String, // optional: Google Maps link or coordinates
  availability: { type: Boolean, default: false },

  profileImage: { type: String, default: "" }, // store image URL or base64 string
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;