import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Hospital,
  Mail,
  Stethoscope,
  Edit3,
  Power,
  LogOut,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Phone,
  MessageSquare,
  AlertCircle,
  FileText,
 
  X,
} from "lucide-react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const { setUser } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/doctors/profile`,
        tokenHeader
      );
      setDoctor(res.data);
      setFormData(res.data);

      // Store doctor ID if not already stored
      if (!localStorage.getItem("userId") && res.data._id) {
        localStorage.setItem("userId", res.data._id);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      // Get doctor ID from multiple possible sources
      const doctorId =
        doctor?._id ||
        localStorage.getItem("userId") ||
        localStorage.getItem("doctorId") ||
        JSON.parse(localStorage.getItem("user") || "{}")._id ||
        JSON.parse(localStorage.getItem("user") || "{}").id;

      console.log("Doctor ID:", doctorId); // Debug log

      if (!doctorId) {
        console.error("No doctor ID found");
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/doctor/${doctorId}`,
        tokenHeader
      );
      console.log("Appointments response:", res.data); // Debug log
      console.log("Number of appointments:", res.data.length); // Debug log
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      console.error("Error details:", err.response?.data);
      console.error("Status code:", err.response?.status);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProfile();
      // Fetch appointments after profile is loaded
      if (doctor?._id) {
        fetchAppointments();
      }
    };
    loadData();
  }, []);

  // Add a separate useEffect to fetch appointments when doctor data is available
  useEffect(() => {
    if (doctor?._id) {
      fetchAppointments();
    }
  }, [doctor]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/doctors/profile`,
        formData,
        tokenHeader
      );
      setDoctor(res.data.doctor);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/doctors/availability`,
        { availability: !doctor.availability },
        tokenHeader
      );
      setDoctor((prev) => ({ ...prev, availability: res.data.available }));
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId,
    newStatus,
    cancelReason = ""
  ) => {
    try {
      // Fixed: Use correct endpoint for updating appointment status
      const res = await axios.put(
        `${API_BASE_URL}/api/appointments/doctor/${appointmentId}/status`,
        { status: newStatus, cancelReason },
        tokenHeader
      );

      // Update the appointments list
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId
            ? { ...apt, status: newStatus, cancelReason }
            : apt
        )
      );

      // Close details modal if open
      setShowAppointmentDetails(false);
      setSelectedAppointment(null);

      alert(`Appointment ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Failed to update appointment status");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter =
      appointmentFilter === "all" ||
      apt.status.toLowerCase() === appointmentFilter.toLowerCase();
    const matchesSearch =
      apt.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Debug logging
  console.log("Total appointments:", appointments.length);
  console.log("Filtered appointments:", filteredAppointments.length);
  console.log("Appointments data:", appointments);

  // Get appointment counts for different statuses
  const appointmentCounts = {
    total: appointments.length,
    pending: appointments.filter((apt) => apt.status === "Pending").length,
    confirmed: appointments.filter((apt) => apt.status === "Confirmed").length,
    cancelled: appointments.filter((apt) => apt.status === "Cancelled").length,
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-emerald-100/50 text-emerald-600 border-emerald-300/50";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-green-100'
      }`}>
        <div className={`rounded-2xl shadow-xl p-8 flex items-center space-x-4 border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-emerald-100'
        }`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="text-emerald-700 font-medium">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-green-100'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-sm shadow-lg border-b transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-emerald-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-3 shadow-lg">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-emerald-900'
                }`}>
                  Welcome, {doctor?.name || "Doctor"}
                </h1>
                <p className="text-sm text-emerald-600">
                  {doctor?.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-5 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-emerald-100'
            }`}>
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-6">
                <h2 className="text-xl font-semibold text-white">
                  Profile Overview
                </h2>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={doctor?.profileImage || "/api/placeholder/100/100"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-lg"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                        doctor?.availability ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <h3 className={`mt-4 text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                     {doctor?.name}
                  </h3>
                  <p className="text-emerald-600 font-medium">
                    {doctor?.specialty}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className={`flex items-center space-x-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{doctor?.email}</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Hospital className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{doctor?.hospitalName}</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{doctor?.location}</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{doctor?.timings}</span>
                  </div>
                </div>

                <div className={`mt-6 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Availability Status
                    </span>
                    <div
                      className={`flex items-center space-x-2 ${
                        doctor?.availability ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {doctor?.availability ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">
                        {doctor?.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={toggleAvailability}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                        doctor?.availability
                          ? "bg-red-100 hover:bg-red-200 text-red-700"
                          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                      }`}
                    >
                      <Power className="h-4 w-4" />
                      <span>
                        Set{" "}
                        {doctor?.availability ? "Not Available" : "Available"}
                      </span>
                    </button>

                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* Appointment Statistics */}
                <div className={`mt-6 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <h4 className={`text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Appointment Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-xl p-4 text-center shadow-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'
                    }`}>
                      <div className="text-lg font-bold text-emerald-600">
                        {appointmentCounts.total}
                      </div>
                      <div className="text-xs text-emerald-600">Total</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'
                    }`}>
                      <div className="text-lg font-bold text-emerald-600">
                        {appointmentCounts.pending}
                      </div>
                      <div className="text-xs text-emerald-600">Pending</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                    }`}>
                      <div className="text-lg font-bold text-green-600">
                        {appointmentCounts.confirmed}
                      </div>
                      <div className="text-xs text-green-600">Confirmed</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'
                    }`}>
                      <div className="text-lg font-bold text-emerald-600">
                        {appointmentCounts.cancelled}
                      </div>
                      <div className="text-xs text-emerald-600">Cancelled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile Form */}
            {editMode && (
              <div className={`rounded-2xl shadow-xl border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-emerald-100'
              }`}>
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-6">
                  <h2 className="text-xl font-semibold text-white">
                    Edit Profile
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Specialty
                      </label>
                      <input
                        type="text"
                        placeholder="Medical Specialty"
                        value={formData.specialty || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialty: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        placeholder="Hospital/Clinic Name"
                        value={formData.hospitalName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hospitalName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={formData.location || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Timings
                      </label>
                      <input
                        type="text"
                        placeholder="Working Hours"
                        value={formData.timings || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, timings: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/your-photo.jpg"
                      value={formData.profileImage || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileImage: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Appointments Section */}
            <div className={`rounded-2xl shadow-xl border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-emerald-100'
            }`}>
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">
                      Appointments Management
                    </h2>
                  </div>
                  <div className="text-white text-sm">
                    {filteredAppointments.length} of {appointments.length}{" "}
                    appointments
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by patient name, email, or issue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={appointmentFilter}
                      onChange={(e) => setAppointmentFilter(e.target.value)}
                      className={`px-3 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                    <p className={`text-lg mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {searchTerm || appointmentFilter !== "all"
                        ? "No appointments match your search criteria"
                        : "No appointments scheduled"}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {searchTerm || appointmentFilter !== "all"
                        ? "Try adjusting your search or filter settings"
                        : "Your upcoming appointments will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredAppointments.map((appt) => {
                      const { date, time } = formatDateTime(
                        appt.appointmentDate
                      );
                      return (
                        <div
                          key={appt._id}
                          className={`border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                              : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-2 shadow-lg">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className={`font-semibold text-lg ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {appt.user?.name || "Patient Name"}
                                  </h3>
                                  <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {appt.user?.email || "patient@email.com"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  appt.status
                                )}`}
                              >
                                {appt.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className={`flex items-center space-x-2 text-sm mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                <Calendar className="h-4 w-4 text-emerald-600" />
                                <span className="font-medium">Date:</span>
                                <span>{date}</span>
                              </div>
                              <div className={`flex items-center space-x-2 text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                <Clock className="h-4 w-4 text-emerald-600" />
                                <span className="font-medium">Time:</span>
                                <span>{time}</span>
                              </div>
                            </div>

                            <div>
                              <div className={`flex items-start space-x-2 text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                <FileText className="h-4 w-4 text-emerald-600 mt-0.5" />
                                <div>
                                  <span className="font-medium">Issue:</span>
                                  <p className={`mt-1 ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                  }`}>
                                    {appt.issue}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {appt.status === "Cancelled" && appt.cancelReason && (
                            <div className={`mb-4 p-4 border rounded-xl ${
                              theme === 'dark'
                                ? 'bg-red-900/20 border-red-700'
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                <div>
                                  <span className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-red-300' : 'text-red-800'
                                  }`}>
                                    Cancellation Reason:
                                  </span>
                                  <p className={`text-sm mt-1 ${
                                    theme === 'dark' ? 'text-red-400' : 'text-red-700'
                                  }`}>
                                    {appt.cancelReason}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className={`flex flex-wrap gap-2 pt-4 border-t ${
                            theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                          }`}>
                            <button
                              onClick={() => {
                                setSelectedAppointment(appt);
                                setShowAppointmentDetails(true);
                              }}
                              className="flex items-center space-x-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>

                            {appt.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appt._id,
                                      "Confirmed"
                                    )
                                  }
                                  className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Confirm</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt(
                                      "Please provide a reason for cancellation:"
                                    );
                                    if (reason) {
                                      updateAppointmentStatus(
                                        appt._id,
                                        "Cancelled",
                                        reason
                                      );
                                    }
                                  }}
                                  className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            )}

                            {appt.user?.phone && (
                              <button className="flex items-center space-x-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                                <Phone className="h-4 w-4" />
                                <span>Call</span>
                              </button>
                            )}

                            <button className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                              theme === 'dark'
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}>
                              <MessageSquare className="h-4 w-4" />
                              <span>Message</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showAppointmentDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Appointment Details
                </h3>
                <button
                  onClick={() => {
                    setShowAppointmentDetails(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Patient Information */}
                <div className={`rounded-xl p-4 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-emerald-50/50'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <User className="h-5 w-5 text-emerald-600 mr-2" />
                    Patient Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Name:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {selectedAppointment.user?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Email:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {selectedAppointment.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Phone:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {selectedAppointment.user?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Age:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {selectedAppointment.user?.age || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className={`rounded-xl p-4 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-green-50/50'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    Appointment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Date:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {
                          formatDateTime(selectedAppointment.appointmentDate)
                            .date
                        }
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Time:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {
                          formatDateTime(selectedAppointment.appointmentDate)
                            .time
                        }
                      </p>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedAppointment.status
                        )}`}
                      >
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Booking Date:
                      </span>
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                        {new Date(
                          selectedAppointment.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className={`rounded-xl p-4 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-emerald-50/50'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <FileText className="h-5 w-5 text-emerald-600 mr-2" />
                    Medical Information
                  </h4>
                  <div>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Patient's Issue/Concern:
                    </span>
                    <p className={`mt-2 rounded-xl p-3 border ${
                      theme === 'dark'
                        ? 'text-gray-200 bg-gray-600 border-gray-600'
                        : 'text-gray-900 bg-white border-gray-200'
                    }`}>
                      {selectedAppointment.issue}
                    </p>
                  </div>
                </div>

                {selectedAppointment.status === "Cancelled" &&
                  selectedAppointment.cancelReason && (
                    <div className={`border rounded-xl p-4 ${
                      theme === 'dark'
                        ? 'bg-red-900/20 border-red-700'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <h4 className={`font-semibold mb-3 flex items-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        Cancellation Information
                      </h4>
                      <div>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Cancellation Reason:
                        </span>
                        <p className={`mt-2 rounded-xl p-3 border ${
                          theme === 'dark'
                            ? 'text-gray-200 bg-gray-600 border-gray-600'
                            : 'text-gray-900 bg-white border-gray-200'
                        }`}>
                          {selectedAppointment.cancelReason}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className={`flex flex-wrap gap-3 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  {selectedAppointment.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(
                            selectedAppointment._id,
                            "Confirmed"
                          )
                        }
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm Appointment</span>
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt(
                            "Please provide a reason for cancellation:"
                          );
                          if (reason) {
                            updateAppointmentStatus(
                              selectedAppointment._id,
                              "Cancelled",
                              reason
                            );
                          }
                        }}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel Appointment</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      window.open(`mailto:${selectedAppointment.user?.email}`)
                    }
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>

                  {selectedAppointment.user?.phone && (
                    <button
                      onClick={() =>
                        window.open(`tel:${selectedAppointment.user.phone}`)
                      }
                      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Patient</span>
                    </button>
                  )}

                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                    theme === 'dark'
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}>
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;