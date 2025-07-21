import React, { useEffect, useState } from 'react';
import { User, Calendar, Clock, MapPin, Hospital, Mail, Stethoscope, Edit3, Power, LogOut, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser();
  const navigate = useNavigate();
 

  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const fetchProfile = async () => {
    try {
      // Simulated axios call - replace with actual API call
      const res = await axios.get(`${API_BASE_URL}/api/doctors/profile`, tokenHeader);
      setDoctor(res.data);
      setFormData(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      // Simulated axios call - replace with actual API call
      const res = await axios.get(`${API_BASE_URL}/api/appointments/my`, tokenHeader);
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Simulated axios call - replace with actual API call
      const res = await axios.put(`${API_BASE_URL}/api/doctors/profile`, formData, tokenHeader);
      setDoctor(res.data.doctor);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const toggleAvailability = async () => {
    try {
      // Simulated axios call - replace with actual API call
      const res = await axios.put(`${API_BASE_URL}/api/doctors/availability`, { availability: !doctor.availability }, tokenHeader);
      setDoctor((prev) => ({ ...prev, availability: res.data.available }));
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('user'); // Also remove user object
    setUser(null); // <-- This updates the Navbar!
    navigate('/');
   
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="text-green-700 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-full p-2">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">
                Welcome, {doctor?.name || 'Doctor'}
              </h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Profile Overview</h2>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={doctor?.profileImage || '/default-doctor.jpg'} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                      doctor?.availability ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">Dr. {doctor?.name}</h3>
                  <p className="text-green-600 font-medium">{doctor?.specialty}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{doctor?.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Hospital className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{doctor?.hospitalName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{doctor?.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-sm">{doctor?.timings}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Availability Status</span>
                    <div className={`flex items-center space-x-2 ${
                      doctor?.availability ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {doctor?.availability ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">
                        {doctor?.availability ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={toggleAvailability}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        doctor?.availability 
                          ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      <Power className="h-4 w-4" />
                      <span>Set {doctor?.availability ? 'Not Available' : 'Available'}</span>
                    </button>

                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile Form */}
            {editMode && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                      <input
                        type="text"
                        placeholder="Medical Specialty"
                        value={formData.specialty || ''}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                      <input
                        type="text"
                        placeholder="Hospital/Clinic Name"
                        value={formData.hospitalName || ''}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="City, State"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timings</label>
                      <input
                        type="text"
                        placeholder="Working Hours"
                        value={formData.timings || ''}
                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/your-photo.jpg"
                      value={formData.profileImage || ''}
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Section */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Appointments</h2>
                </div>
              </div>
              
              <div className="p-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-green-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No appointments scheduled</p>
                    <p className="text-gray-400 text-sm mt-2">Your upcoming appointments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div key={appt._id} className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <User className="h-5 w-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">{appt.patientName}</h3>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(appt.date).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                        </div>
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

export default DoctorDashboard;