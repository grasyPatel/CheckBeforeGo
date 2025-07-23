import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Stethoscope, Building, MapPin, Clock, ExternalLink, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    hospitalName: "",
    location: "",
    timings: "",
    mapLocation: "",
    profileImage: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const specialties = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Neurology",
    "Psychiatry",
    "Oncology",
    "Ophthalmology",
    "ENT",
    "Dentistry",
    "Other"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.specialty) newErrors.specialty = "Specialty is required";
    if (!formData.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.timings.trim()) newErrors.timings = "Timings are required";

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      // Prepare data for API (excluding confirmPassword)
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        specialty: formData.specialty,
        hospitalName: formData.hospitalName.trim(),
        location: formData.location.trim(),
        timings: formData.timings.trim(),
        mapLocation: formData.mapLocation.trim() || undefined,
        profileImage: formData.profileImage.trim() || undefined,
        availability: false // Default to false
      };

      // Remove undefined fields
      Object.keys(registrationData).forEach(key => {
        if (registrationData[key] === undefined) {
          delete registrationData[key];
        }
      });

      // Make API call to register doctor
      const response = await axios.post(
        `${API_BASE_URL}/api/doctors/register`, 
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Handle successful registration
      if (response.data) {
        // Show success message
        alert("Registration successful! Please login to continue.");
        
        // Redirect to login page after successful registration
        navigate("/login/doctor");
      }

    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        switch (status) {
          case 400:
            setApiError(message || "Invalid registration data. Please check your information.");
            break;
          case 409:
            setApiError("An account with this email already exists. Please use a different email or login.");
            setErrors({ email: "Email already exists" });
            break;
          case 422:
            setApiError("Please check your information and try again.");
            // Handle field-specific errors if provided by API
            if (err.response.data?.errors) {
              setErrors(err.response.data.errors);
            }
            break;
          case 500:
            setApiError("Server error. Please try again later.");
            break;
          default:
            setApiError(message || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        // Network error
        setApiError("Network error. Please check your internet connection and try again.");
      } else {
        // Other error
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Join Our Medical Network</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Create your professional profile and start connecting with patients who need your expertise</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleRegister} className="bg-white rounded-3xl shadow-2xl border border-green-100 p-8 lg:p-12 backdrop-blur-sm">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">{apiError}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            
            {/* Personal Information Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Dr. John Smith"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name}
                  </p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@hospital.com"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                </div>
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Specialty Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Medical Specialty *</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="specialty"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer ${
                        errors.specialty ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.specialty}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="">Choose your specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.specialty && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.specialty}
                  </p>}
                </div>

                {/* Hospital Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hospital/Clinic Name *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="hospitalName"
                      placeholder="City General Hospital"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.hospitalName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.hospitalName && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.hospitalName}
                  </p>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="New York, NY"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.location}
                  </p>}
                </div>

                {/* Timings */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Available Hours *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="timings"
                      placeholder="Mon-Fri 9:00 AM - 5:00 PM"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                        errors.timings ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                      }`}
                      value={formData.timings}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  {errors.timings && <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.timings}
                  </p>}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-green-600" />
                </div>
                Additional Information
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Maps Location</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="mapLocation"
                      placeholder="Google Maps link or coordinates"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-200"
                      value={formData.mapLocation}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Help patients find your exact location</p>
                </div>

                {/* Profile Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Profile Image</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="profileImage"
                      placeholder="Profile photo URL"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-200"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Add a professional photo to build trust with patients</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-100 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Stethoscope className="h-5 w-5" />
                    Create Doctor Account
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login/doctor"
              className="text-green-600 hover:text-green-500 font-medium transition-colors duration-200"
            >
              Login here
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <button className="text-green-600 hover:underline transition-colors">Terms of Service</button> and{" "}
            <button className="text-green-600 hover:underline transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;