import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    specialty: "",
    clinic: ""
  });

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctors/search`, {
        params: filters
      });
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getDefaultImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2316a085'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3EDr%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Find Your Doctor</h2>
          <p className="text-gray-600">Search and connect with healthcare professionals</p>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                placeholder="Doctor Name"
                className="w-full px-4 py-3 border-2 border-green-100 rounded-lg focus:border-green-400 focus:outline-none transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                name="location"
                onChange={handleInputChange}
                placeholder="Location"
                className="w-full px-4 py-3 border-2 border-green-100 rounded-lg focus:border-green-400 focus:outline-none transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                name="specialty"
                onChange={handleInputChange}
                placeholder="Specialty"
                className="w-full px-4 py-3 border-2 border-green-100 rounded-lg focus:border-green-400 focus:outline-none transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                name="clinic"
                onChange={handleInputChange}
                placeholder="Clinic/Hospital"
                className="w-full px-4 py-3 border-2 border-green-100 rounded-lg focus:border-green-400 focus:outline-none transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
            <span>Not Available</span>
          </div>
        </div>

        {/* Enhanced Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-green-100">
              {/* Card Header with Image */}
              <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={doc.profileImage || getDefaultImage()}
                      alt={doc.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.src = getDefaultImage();
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                      doc.availability ? 'bg-green-400' : 'bg-red-500'
                    }`}>
                      <svg className="w-4 h-4 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        {doc.availability ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{doc.name}</h3>
                    <p className="text-green-100 text-sm">{doc.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Hospital and Location */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{doc.hospitalName}</p>
                      <p className="text-gray-600 text-sm">{doc.location}</p>
                    </div>
                  </div>

                  {/* Timings */}
                  {doc.timings && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Timings</p>
                        <p className="text-gray-600 text-sm">{doc.timings}</p>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {doc.email && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Contact</p>
                        <a href={`mailto:${doc.email}`} className="text-green-600 text-sm hover:text-green-700 transition-colors">
                          {doc.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Availability Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${doc.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`font-medium text-sm ${doc.availability ? 'text-green-600' : 'text-red-600'}`}>
                        {doc.availability ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {doc.mapLocation && (
                        <a
                          href={doc.mapLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Map
                        </a>
                      )}
                      
                      {doc.availability && (
                        <button className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h4a1 1 0 001-1V11M9 7h6" />
                          </svg>
                          Book
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria to find more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;