import  Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Post /api/doctors/register
export const registerDoctor = async (req, res) => {
  const { name, email, password, specialty, hospitalName, location, timings } = req.body;
  const profileImage = req.file?.path || null;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialty,
      hospitalName,
      location,
      timings,
      profileImage
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during registration" });
  }
}

// Post /api/doctors/login
export const loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
      const doctor = await Doctor.findOne({ email }); 
      if(!doctor){
        return res.status(400).json({message:"Doctor not found"});
      
      }
      const isMatch =await bcrypt.compare(password, doctor.password);
      if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
      
      }
const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
  expiresIn: "7d", // you can change this
});
      res.status(200).json({token, doctor});

    }catch(error){
      console.log(error);
      res.status(500).json({message:"Server error during login"});
    
    }

}


//get /api/doctors/profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id).select("-password"); // exclude password
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};


// PUT /api/doctors/profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (req.file?.path) {
  doctor.profileImage = req.file.path; 
}

    // Update only fields provided
    const fieldsToUpdate = [
      "name",
      "email",
      "specialty",
      "hospitalName",
      "location",
      "timings",
      "profileImage",
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field]) {
        doctor[field] = req.body[field];
      }
    });

    // Optional: Update password if provided
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      doctor.password = hashed;
    }

    const updatedDoctor = await doctor.save();
    res.status(200).json({
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};


//Search 
export const searchDoctors = async (req, res) => {
  try {
    const { name, location, specialty, clinic } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
    if (clinic) query.clinic = { $regex: clinic, $options: 'i' };

    const doctors = await Doctor.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};



// PUT /api/doctors/availability
export const toggleAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Expecting { availability: true/false } in request body
    doctor.availability = req.body.availability;
    await doctor.save();

    res.status(200).json({
      message: "Availability status updated",
      available: doctor.availability,
    });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ message: "Server error while updating availability" });
  }
};

