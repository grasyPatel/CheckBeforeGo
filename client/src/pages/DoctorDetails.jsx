import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {useUser} from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/doctors/${id}`);
        setDoctor(res.data);
        setError(null);
      } catch (err) {
        setError("Doctor not found or server error");
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-200 border-t-green-600 dark:border-green-700 dark:border-t-green-400 shadow-2xl"></div>
          <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-400 opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-3xl shadow-2xl p-8 max-w-md mx-auto border">
          <div className="w-18 h-18 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-9 h-9 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Doctor Not Found</h3>
          <p className="text-gray-600 dark:text-gray-300">{error || "The requested doctor could not be found."}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Create map location - use mapLocation if available, otherwise fallback to location or hospital
  const getMapLocation = () => {
    if (doctor.mapLocation) {
      return doctor.mapLocation;
    }
    
    // Try to construct from available location data
    if (doctor.location && doctor.hospitalName) {
      return `${doctor.hospitalName}, ${doctor.location}`;
    } else if (doctor.location) {
      return doctor.location;
    } else if (doctor.hospitalName) {
      return doctor.hospitalName;
    }
    
    // Default fallback location
    return "Indore, Madhya Pradesh, India";
  };

  const mapLocation = getMapLocation();

  const handleBookAppointment = () => {
    console.log(user)
    if (!user) {
      navigate(`/login/user?redirect=/book-appointment/${doctor._id}`);
    } else {
      navigate(`/book-appointment/${doctor._id}`);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 py-8 px-4 transition-all duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-3xl shadow-2xl overflow-hidden mb-8 border backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full animate-pulse delay-700"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0 relative z-10">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-70"></div>
                <img
                  src={doctor.profileImage || "/default-doctor.png"}
                  alt={doctor.name}
                  className="relative w-28 h-28 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transform transition-all duration-500"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSIzNiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI0IDc2QzI0IDY0IDM0IDU2IDQ4IDU2UzcyIDY0IDcyIDc2SDI0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                  }}
                />
                <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-4 border-white shadow-lg ${
                  doctor.availability ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}>
                  <div className={`absolute inset-0 rounded-full ${doctor.availability ? 'bg-green-400' : 'bg-red-400'} animate-ping opacity-75`}></div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">{doctor.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-green-100">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-sm">{doctor.specialty}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                    doctor.availability 
                      ? 'bg-green-500/30 text-green-100 border border-green-400/30' 
                      : 'bg-red-500/30 text-red-100 border border-red-400/30'
                  }`}>
                    {doctor.availability ? '✓ Available' : '✗ Not Available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact & Schedule */}
            <div className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-2xl shadow-xl p-6 border backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 group hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Email</p>
                      <a href={`mailto:${doctor.email}`} className="text-green-600 hover:text-green-700 font-medium hover:underline transition-all duration-300">
                        {doctor.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0H9m0 0H7m2 0v5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hospital</p>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.hospitalName}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 group hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Available Hours</p>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.timings}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section - Now always shows */}
            <div className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-2xl shadow-xl p-6 border backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                Location & Directions
              </h3>
              
              {!doctor.mapLocation && (
                <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-600 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Showing approximate location based on available address information.
                  </p>
                </div>
              )}
              
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <iframe
                  title="Google Map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="w-full"
                ></iframe>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </a>
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View in Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-xl shadow-sm p-6 border backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={handleBookAppointment} className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </button>
                <a
                  href={`mailto:${doctor.email}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 border-green-100 dark:border-green-700 rounded-xl shadow-sm p-6 border backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h3>
              <div className={`p-4 rounded-lg ${
                doctor.availability 
                  ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/50' 
                  : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50'
              } transition-all duration-300`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    doctor.availability ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  } shadow-lg`}>
                    {doctor.availability && (
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                  <span className={`font-medium ${
                    doctor.availability 
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {doctor.availability ? 'Currently Available' : 'Currently Unavailable'}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${
                  doctor.availability 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {doctor.availability 
                    ? 'You can contact or visit during working hours'
                    : 'Please check back later or contact via email'
                  }
                </p>
              </div>
            </div>

            {/* Profile Info */}
            {(doctor.createdAt || doctor.updatedAt) && (
              <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border-green-100 dark:border-green-700 rounded-xl p-6 border backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {doctor.createdAt && (
                    <div>
                      <span className="font-medium">Joined:</span> {formatDate(doctor.createdAt)}
                    </div>
                  )}
                  {doctor.updatedAt && (
                    <div>
                      <span className="font-medium">Last Updated:</span> {formatDate(doctor.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;