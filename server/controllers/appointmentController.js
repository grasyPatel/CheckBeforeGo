
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
    const appointments = await Appointment.find({ user: req.user.id }).populate("doctor", "name specialty");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params; // Get the appointment ID from the URL parameters
    const userId = req.user.id; // Get the authenticated user's ID from the request object

    // Find the appointment and ensure it belongs to the authenticated user
    const appointment = await Appointment.findOne({ _id: id, user: userId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or you do not have permission to cancel this appointment." });
    }

    // Check if the appointment is already cancelled or completed
    if (appointment.status === "Cancelled" || appointment.status === "Completed") {
      return res.status(400).json({ message: `Appointment is already ${appointment.status.toLowerCase()}. Cannot cancel.` });
    }

    // Update the appointment status to "Cancelled"
    appointment.status = "Cancelled";
    // Optionally, you could allow the user to provide a cancelReason in req.body
    // appointment.cancelReason = req.body.cancelReason || ""; 
    
    await appointment.save();
    res.status(200).json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
};


