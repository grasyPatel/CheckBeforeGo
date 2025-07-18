import  {Doctor} from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Post /api/doctors/register
export const registerDoctor = async (req, res) => {
    const {name, email, password, specialty, hospitalName, location, timings, profileImage}=req.body;
    console.log(req.body);
    try{
        const existingDoctor = await Doctor.findOne({email});
        if(existingDoctor){
            return res.status(400).json({message:"Doctor already exists"});
        
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor =new Doctor({
            name,
            email,
            password:hashedPassword,
            specialty,
            hospitalName,
            location,
            timings,
            profileImage
        

        })
        await newDoctor.save();
        console.log(newDoctor);
        res.status(201).json(newDoctor);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error during registration"});
    

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
      const token = jwt.sign({id:doctor._id, role:"doctor"}, process.env.JWT_SECRET,{expiresIn:"1d"});
      res.status(200).json({token, doctor});

    }catch(error){
      console.log(error);
      res.status(500).json({message:"Server error during login"});
    
    }

}