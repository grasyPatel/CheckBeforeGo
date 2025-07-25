import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [issue, setIssue] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 3 months from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor");
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Check if selected date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !appointmentDate || !appointmentTime) {
      alert("Please fill all fields including time slot");
      return;
    }

    if (isWeekend(appointmentDate)) {
      alert("Please select a weekday for your appointment");
      return;
    }

    // Combine date and time
    const fullAppointmentDateTime = `${appointmentDate}T${appointmentTime}:00.000Z`;

    console.log({
      doctorId,
      issue,
      appointmentDate: fullAppointmentDateTime,
      token: localStorage.getItem("token"),
    });

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/appointments`,
        {
          doctorId,
          issue,
          appointmentDate: fullAppointmentDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // You should store token inside user context
          },
        }
      );
      alert("Appointment booked!");
      navigate("/user/dashboard"); // or any success page
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <div className="p-6 text-center">Loading doctor info...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          Book Appointment with {doctor.name}
        </h2>

        {/* Doctor Info Card */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800">{doctor.name}</h3>
          {doctor.specialization && (
            <p className="text-red-600">{doctor.specialization}</p>
          )}
          {doctor.experience && (
            <p className="text-sm text-red-500">{doctor.experience} years experience</p>
          )}
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your issue *
          </label>
          <textarea
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="e.g., Fever, headache, routine checkup, etc."
          />
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Appointment Date *
          </label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={today}
            max={maxDateString}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          {appointmentDate && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Selected: {formatDate(appointmentDate)}
              </p>
              {isWeekend(appointmentDate) && (
                <p className="text-sm text-red-600 mt-1">
                  ⚠️ Weekend selected. Please choose a weekday for appointments.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot *
          </label>
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="">Choose a time slot</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Available slots: Monday - Friday, 9:00 AM - 5:30 PM
          </p>
        </div>

        {/* Appointment Summary */}
        {appointmentDate && appointmentTime && !isWeekend(appointmentDate) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Appointment Summary</h4>
            <p className="text-sm text-red-700">
              <strong>Doctor:</strong> {doctor.name}
            </p>
            <p className="text-sm text-red-700">
              <strong>Date:</strong> {formatDate(appointmentDate)}
            </p>
            <p className="text-sm text-red-700">
              <strong>Time:</strong> {appointmentTime}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isWeekend(appointmentDate)}
          className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• Appointments can be booked up to 3 months in advance</p>
          <p>• Only weekday appointments are available</p>
          <p>• You will receive a confirmation email once booked</p>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;