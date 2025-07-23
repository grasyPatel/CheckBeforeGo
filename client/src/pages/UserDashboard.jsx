import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Add this import

import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const UserDashboard = () => {
  const [user, setUsers] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/profile`,
        tokenHeader
      );
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

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/my`,
        tokenHeader
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
    if (
      formData.phone &&
      !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
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
      const res = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        formData,
        tokenHeader
      );
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
    // IMPORTANT: Use a custom modal instead of window.confirm for better UI/UX
    // For now, keeping window.confirm as per your existing code.
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/appointments/${appointmentId}`,
        tokenHeader
      );
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== appointmentId)
      );
      // Optionally, show a success message
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // Assuming you might store userId separately
    localStorage.removeItem("user"); // Also remove the complete user object
    setUser(null); // This updates the user context, which can trigger Navbar updates
    navigate("/"); // Redirect to home or login page
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      completed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status?.toLowerCase()] || statusStyles.pending // Use toLowerCase here too for consistency
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your health appointments and profile
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={
                      user?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=16a34a&color=fff&size=120`
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-green-500"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{user?.phone || "No phone added"}</span>
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile Modal */}
            {editMode && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Edit Profile
                      </h3>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setErrors({});
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {errors.general && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {errors.general}
                      </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.name || ""}
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.email || ""}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="url"
                          name="profileImage"
                          placeholder="Profile Image URL (Optional)"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={formData.profileImage || ""}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={updateLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                          {updateLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setErrors({});
                          }}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 4H8m8 0v-4m0 4h-8m8-4V8a2 2 0 00-2-2H10a2 2 0 00-2 2v8"
                      />
                    </svg>
                    My Appointments
                  </h2>
                  <Link
                    to="/doctors"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Book New Appointment
                  </Link>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 4H8m8 0v-4m0 4h-8m8-4V8a2 2 0 00-2-2H10a2 2 0 00-2 2v8"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No appointments yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start by booking your first appointment with one of our
                      qualified doctors.
                    </p>
                    <Link
                      to="/doctors"
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                    >
                      Browse Doctors
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                                <svg
                                  className="w-5 h-5 text-green-600 dark:text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Dr. {appt.doctorName ||
                                    appt.doctor?.name ||
                                    "Unknown Doctor"}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {appt.specialty ||
                                    appt.doctor?.specialty ||
                                    "General Medicine"}
                                </p>
                                {/* --- ADDED ISSUE HERE --- */}
                                {appt.issue && (
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    <span className="font-medium">Issue:</span> {appt.issue}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg
                                  className="w-4 h-4 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 4H8m8 0v-4m0 4h-8m8-4V8a2 2 0 00-2-2H10a2 2 0 00-2 2v8"
                                  />
                                </svg>
                                <span>
                                  {appt.appointmentDate
                                    ? new Date(
                                        appt.appointmentDate
                                      ).toLocaleDateString()
                                    : "Invalid Date"}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <svg
                                  className="w-4 h-4 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>
                                  {appt.appointmentDate
                                    ? new Date(
                                        appt.appointmentDate
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Invalid Time"}
                                </span>{" "}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(appt.status)}
                            {/* Console log for debugging status (can be removed later) */}
                            {console.log("Appointment ID:", appt._id, "Status:", appt.status, "Lowercase Status:", appt.status?.toLowerCase())}
                            {(appt.status?.toLowerCase() === "pending" ||
                              appt.status?.toLowerCase() === "confirmed") && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appt._id)
                                }
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition duration-200"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                        {/* --- NOTES VISIBILITY CHECK --- */}
                        {/* The notes section will only be visible if appt.notes is a non-empty string. */}
                        {appt.notes && appt.notes.trim() !== '' && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Notes:</span>{" "}
                              {appt.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
