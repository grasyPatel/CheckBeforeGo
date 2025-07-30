import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Edit3, 
  LogOut, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock4,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  MapPin,
  FileText
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const UserDashboard = () => {
  const [user, setUsers] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const APPOINTMENTS_PER_PAGE = 4;

  const navigate = useNavigate();
  const { setUser } = useUser();
  const { theme } = useTheme();

  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/profile`, tokenHeader);
      setUsers(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (pageNumber = 1) => {
    try {
      const userId = user?._id || localStorage.getItem("userId") || 
        JSON.parse(localStorage.getItem("user") || "{}")._id ||
        JSON.parse(localStorage.getItem("user") || "{}").id;

      if (!userId) {
        console.error("No user ID found for fetching appointments.");
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/user/${userId}?page=${pageNumber}&limit=${APPOINTMENTS_PER_PAGE}`,
        tokenHeader
      );
      setAppointments(res.data.appointments);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch user appointments:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchAppointments(1);
  }, []);

  useEffect(() => {
    if (user && !appointments.length && !loading) {
      fetchAppointments(1);
    }
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, tokenHeader);
      setUsers(res.data.user || res.data);
      setEditMode(false);
      setErrors({});
    } catch (err) {
      console.error("Profile update failed:", err);
      setErrors({ general: err.response?.data?.message || "Update failed" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/appointments/${appointmentId}`, tokenHeader);
      fetchAppointments(currentPage);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchAppointments(newPage);
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case "pending":
        return <Clock4 className="w-3 h-3 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-3 h-3 text-red-600" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-700" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      completed: "bg-green-50 text-green-700 border-green-200",
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
        statusStyles[status?.toLowerCase()] || statusStyles.pending
      }`}>
        {getStatusIcon(status)}
        <span className="ml-1">
          {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
        </span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-green-600 animate-pulse" />
            </div>
          </div>
          <p className={`mt-4 text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-lg border-b sticky top-0 z-40 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Welcome, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your appointments and profile
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
             
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=16a34a&color=fff&size=80`}
                      alt="Profile"
                      className="w-16 h-16 rounded-lg mx-auto object-cover shadow-sm border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className={`mt-3 text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name}
                  </h3>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.phone || "No phone added"}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.address || "No address added"}
                  </span>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{appointments.length}</div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-lg shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {appointments.filter(a => a.status?.toLowerCase() === 'confirmed').length}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Confirmed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-lg shadow-sm border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        My Appointments
                      </h2>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your scheduled appointments
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/doctors"
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New</span>
                  </Link>
                </div>

                {appointments.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <Calendar className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-base font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      No appointments yet
                    </h3>
                    <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Start by booking your first appointment with one of our qualified doctors.
                    </p>
                    <Link
                      to="/doctors"
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Browse Doctors</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          theme === 'dark' 
                            ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                            : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-green-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Stethoscope className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  Dr. {appt.doctorName || appt.doctor?.name || "Unknown Doctor"}
                                </h4>
                                <p className="text-green-600 text-xs font-medium mb-1">
                                  {appt.specialty || appt.doctor?.specialty || "General Medicine"}
                                </p>
                                {appt.issue && (
                                  <div className="flex items-start space-x-2 mt-2">
                                    <FileText className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                                      {appt.issue}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {appt.appointmentDate
                                    ? new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                      })
                                    : "Invalid Date"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {appt.appointmentDate
                                    ? new Date(appt.appointmentDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Invalid Time"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0">
                            {getStatusBadge(appt.status)}
                            {(appt.status?.toLowerCase() === "pending" ||
                              appt.status?.toLowerCase() === "confirmed") && (
                              <button
                                onClick={() => handleCancelAppointment(appt._id)}
                                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors duration-200 border border-red-200 hover:border-red-300"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Cancel Reason */}
                        {appt.status?.toLowerCase() === "cancelled" && appt.cancelReason && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                                  Cancellation Reason:
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                  {appt.cancelReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {appt.notes && appt.notes.trim() !== "" && (
                          <div className={`mt-3 p-3 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-600/50' : 'bg-green-50'
                          }`}>
                            <div className="flex items-start space-x-2">
                              <FileText className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className={`text-xs font-medium mb-1 ${
                                  theme === 'dark' ? 'text-green-300' : 'text-green-700'
                                }`}>
                                  Notes:
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {appt.notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                            currentPage === index + 1
                              ? 'bg-green-600 text-white shadow-sm'
                              : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Edit Profile
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setErrors({});
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                        errors.name 
                          ? "border-red-500 focus:ring-red-500" 
                          : theme === 'dark'
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                      value={formData.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                        errors.email 
                          ? "border-red-500 focus:ring-red-500" 
                          : theme === 'dark'
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                        errors.phone 
                          ? "border-red-500 focus:ring-red-500" 
                          : theme === 'dark'
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                        theme === 'dark'
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                      }`}
                      value={formData.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profile Image URL (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      name="profileImage"
                      placeholder="https://example.com/image.jpg"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                        theme === 'dark'
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                      }`}
                      value={formData.profileImage || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {updateLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setErrors({});
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                      theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;