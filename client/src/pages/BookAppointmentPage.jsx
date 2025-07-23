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
  const [loading, setLoading] = useState(false);

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

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !appointmentDate) {
      alert("Please fill all fields");
      return;
    }
    console.log({
  doctorId,
  issue,
  appointmentDate,
  token: localStorage.getItem("token"),
});


    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/appointments`,
        {
          doctorId,
          issue,
          appointmentDate,
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
        className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4">Book Appointment with {doctor.name}</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Describe your issue</label>
          <textarea
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Fever, headache, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Appointment Date</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
