
// import Appointment from "../models/Appointment.js";

// export const createAppointment = async (req, res) => {
//   console.log("Incoming appointment request:", {
//   body: req.body,
//   user: req.user,
// });

//   try {
//     const { doctorId, issue, appointmentDate } = req.body;

//     const appointment = await Appointment.create({
//       doctor: doctorId,
//       user: req.user.id,
//       issue,
//       appointmentDate,
//     });

//     res.status(201).json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create appointment", error });
//   }
// };

// export const getUserAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user.id }).populate("doctor", "name specialty");
//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch appointments", error });
//   }
// };

// export const cancelAppointment = async (req, res) => {
//   try {
//     const { id } = req.params; // Get the appointment ID from the URL parameters
//     const userId = req.user.id; // Get the authenticated user's ID from the request object

//     // Find the appointment and ensure it belongs to the authenticated user
//     const appointment = await Appointment.findOne({ _id: id, user: userId });

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found or you do not have permission to cancel this appointment." });
//     }

//     // Check if the appointment is already cancelled or completed
//     if (appointment.status === "Cancelled" || appointment.status === "Completed") {
//       return res.status(400).json({ message: `Appointment is already ${appointment.status.toLowerCase()}. Cannot cancel.` });
//     }

//     // Update the appointment status to "Cancelled"
//     appointment.status = "Cancelled";
//     // Optionally, you could allow the user to provide a cancelReason in req.body
//     // appointment.cancelReason = req.body.cancelReason || ""; 
    
//     await appointment.save();
//     res.status(200).json({ message: "Appointment cancelled successfully", appointment });
//   } catch (error) {
//     console.error("Error cancelling appointment:", error);
//     res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
//   }
// };


// // Get all appointments for a logged-in doctor
// export const getDoctorAppointments = async (req, res) => {
//   try {
//     const doctorId = req.user.id; // assuming doctor is logged in and verified

//     const appointments = await Appointment.find({ doctor: doctorId })
//       .populate("user", "name email phone age") // show user details
//       .sort({ appointmentDate: 1 });

//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching doctor appointments:", error);
//     res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
//   }
// };

// // Update appointment status (doctor can approve/complete/cancel)
// export const updateAppointmentStatusByDoctor = async (req, res) => {
//   try {
//     const doctorId = req.user.id;
//     const { id } = req.params; // appointment id
//     const { status } = req.body;

//     // Validate status
//     const validStatuses = ["Pending", "Approved", "Completed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found or unauthorized" });
//     }

//     appointment.status = status;
//     await appointment.save();

//     res.status(200).json({ message: "Status updated", appointment });
//   } catch (error) {
//     console.error("Error updating appointment status:", error);
//     res.status(500).json({ message: "Failed to update status", error: error.message });
//   }
// };

import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  console.log("Incoming appointment request:", {
    body: req.body,
    user: req.user,
  });

  try {
    const { doctorId, issue, appointmentDate } = req.body;

    const appointment = await Appointment.create({
      doctor: doctorId,
      user: req.user.id,
      issue,
      appointmentDate,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming verifyUser middleware populates req.user.id

    // Pagination parameters from query (default to page 1, limit 4)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // Display 4 appointments per page
    const skip = (page - 1) * limit;

    // Count total appointments for the user (for frontend pagination logic)
    const totalAppointments = await Appointment.countDocuments({ user: userId });

    const appointments = await Appointment.find({ user: userId })
      .populate("doctor", "name specialty") // Populate doctor's name and specialty
      .sort({ appointmentDate: -1 }) // Sort by latest appointment date first (descending)
      .skip(skip) // Skip documents based on page number
      .limit(limit); // Limit number of documents per page

    res.status(200).json({
      appointments,
      currentPage: page,
      totalPages: Math.ceil(totalAppointments / limit),
      totalAppointments,
    });
  } catch (error) {
    console.error("Error fetching user appointments with pagination:", error);
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({ _id: id, user: userId });

    if (!appointment) {
      return res.status(404).json({ 
        message: "Appointment not found or you do not have permission to cancel this appointment." 
      });
    }

    if (appointment.status === "Cancelled" || appointment.status === "Completed") {
      return res.status(400).json({ 
        message: `Appointment is already ${appointment.status.toLowerCase()}. Cannot cancel.` 
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();
    
    res.status(200).json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
};

// Get all appointments for a logged-in doctor
// export const getDoctorAppointments = async (req, res) => {
//   try {
//     const doctorId = req.params.id; // Get doctor ID from URL params
    
//     // Verify that the authenticated user is the same as the requested doctor
//     if (req.user.id !== doctorId) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const appointments = await Appointment.find({ doctor: doctorId })
//       .populate("user", "name email phone age")
//       .sort({ appointmentDate: 1 });

//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("Error fetching doctor appointments:", error);
//     res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
//   }
// };

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorIdFromParams = req.params.id; // Get doctor ID from URL params

    // Verify that the authenticated doctor's ID matches the requested doctor ID
    // Use req.doctor._id because protectDoctor middleware populates req.doctor
    if (!req.doctor || req.doctor._id.toString() !== doctorIdFromParams) {
      return res.status(403).json({ message: "Access denied: Mismatched doctor ID" });
    }

    const appointments = await Appointment.find({ doctor: doctorIdFromParams })
      .populate("user", "name email phone age")
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};

// Update appointment status (doctor can confirm/cancel)
// export const updateAppointmentStatusByDoctor = async (req, res) => {
//   try {
//     const doctorId = req.user.id;
//     const { id } = req.params; // appointment id
//     const { status, cancelReason } = req.body;

//     // Validate status
//     const validStatuses = ["Pending", "Confirmed", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found or unauthorized" });
//     }

//     appointment.status = status;
//     if (status === "Cancelled" && cancelReason) {
//       appointment.cancelReason = cancelReason;
//     }
    
//     await appointment.save();

//     res.status(200).json({ message: "Status updated", appointment });
//   } catch (error) {
//     console.error("Error updating appointment status:", error);
//     res.status(500).json({ message: "Failed to update status", error: error.message });
//   }
// };

export const updateAppointmentStatusByDoctor = async (req, res) => {
  try {
    // Assuming protectDoctor middleware is used and populates req.doctor
    console.log("Request came through protectDoctor. req.doctor:", req.doctor);
    const doctorId = req.doctor?._id; // Use optional chaining for safety

    if (!doctorId) {
        console.error("Doctor ID not found on request after middleware.");
        return res.status(401).json({ message: "Unauthorized: Doctor ID missing." });
    }

    const { id } = req.params; // appointment id
    const { status, cancelReason } = req.body;

    console.log(`Attempting to update appointment ID: ${id} for Doctor ID: ${doctorId}`);
    console.log(`New Status: ${status}, Cancel Reason: ${cancelReason}`);

    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      console.error("Invalid status value provided:", status);
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });

    if (!appointment) {
      console.warn(`Appointment not found or unauthorized for ID: ${id}, Doctor: ${doctorId}`);
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    console.log("Found appointment:", appointment);

    appointment.status = status;
    if (status === "Cancelled" && cancelReason) {
      appointment.cancelReason = cancelReason;
    } else if (status !== "Cancelled") {
      // Optionally clear cancelReason if status is not Cancelled
      appointment.cancelReason = "";
    }

    await appointment.save();
    console.log("Appointment saved successfully.");

    res.status(200).json({ message: "Status updated", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};