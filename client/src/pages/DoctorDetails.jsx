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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor Not Found</h3>
          <p className="text-gray-600">{error || "The requested doctor could not be found."}</p>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={doctor.profileImage || "/default-doctor.png"}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSIzNiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI0IDc2QzI0IDY0IDM0IDU2IDQ4IDU2UzcyIDY0IDcyIDc2SDI0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                  }}
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                  doctor.availability ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Dr. {doctor.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-green-100">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{doctor.specialty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{doctor.location}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.availability 
                      ? 'bg-green-500/20 text-green-100' 
                      : 'bg-red-500/20 text-red-100'
                  }`}>
                    {doctor.availability ? 'Available' : 'Not Available'}
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${doctor.email}`} className="text-green-600 hover:text-green-700 font-medium">
                        {doctor.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0H9m0 0H7m2 0v5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hospital</p>
                      <p className="font-medium text-gray-900">{doctor.hospitalName}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available Hours</p>
                      <p className="font-medium text-gray-900">{doctor.timings}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{doctor.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section - Now always shows */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Location & Directions
              </h3>
              
              {!doctor.mapLocation && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Showing approximate location based on available address information.
                  </p>
                </div>
              )}
              
              <div className="relative rounded-lg overflow-hidden">
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
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
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
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button  onClick={handleBookAppointment} className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </button>
                <a
                  href={`mailto:${doctor.email}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className={`p-4 rounded-lg ${
                doctor.availability 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    doctor.availability ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    doctor.availability ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {doctor.availability ? 'Currently Available' : 'Currently Unavailable'}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${
                  doctor.availability ? 'text-green-600' : 'text-red-600'
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
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
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