import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('paginated'); // 'paginated' or 'viewMore'
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    specialty: "",
    clinic: ""
  });

  const { theme } = useTheme();
  const DOCTORS_PER_PAGE = 12;
  const VIEW_MORE_INCREMENT = 6;

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/doctors/search`, {
        params: filters
      });
      const doctorsData = res.data;
      setAllDoctors(doctorsData);
      
      if (doctorsData.length <= DOCTORS_PER_PAGE) {
        // If 12 or fewer doctors, show all without pagination
        setDoctors(doctorsData);
        setDisplayedDoctors(doctorsData);
        setViewMode('all');
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        // If more than 12 doctors, use pagination
        setViewMode('paginated');
        setTotalPages(Math.ceil(doctorsData.length / DOCTORS_PER_PAGE));
        setCurrentPage(1);
        const firstPageDoctors = doctorsData.slice(0, DOCTORS_PER_PAGE);
        setDoctors(firstPageDoctors);
        setDisplayedDoctors(firstPageDoctors);
      }
    } catch (err) {
      console.error("Error fetching doctors", err);
    } finally {
      setLoading(false);
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
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const startIndex = (newPage - 1) * DOCTORS_PER_PAGE;
      const endIndex = startIndex + DOCTORS_PER_PAGE;
      const pagesDoctors = allDoctors.slice(startIndex, endIndex);
      setDoctors(pagesDoctors);
      setDisplayedDoctors(pagesDoctors);
      
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewMore = () => {
    const currentCount = displayedDoctors.length;
    const newCount = Math.min(currentCount + VIEW_MORE_INCREMENT, allDoctors.length);
    const newDisplayedDoctors = allDoctors.slice(0, newCount);
    setDisplayedDoctors(newDisplayedDoctors);
    setDoctors(newDisplayedDoctors);
  };

  const toggleViewMode = () => {
    if (viewMode === 'paginated') {
      // Switch to view more mode
      setViewMode('viewMore');
      setDisplayedDoctors(allDoctors.slice(0, Math.min(DOCTORS_PER_PAGE, allDoctors.length)));
      setDoctors(allDoctors.slice(0, Math.min(DOCTORS_PER_PAGE, allDoctors.length)));
    } else {
      // Switch to paginated mode
      setViewMode('paginated');
      setCurrentPage(1);
      const firstPageDoctors = allDoctors.slice(0, DOCTORS_PER_PAGE);
      setDoctors(firstPageDoctors);
      setDisplayedDoctors(firstPageDoctors);
    }
  };

  const getDefaultImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2316a34a'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='36' font-family='Arial, sans-serif' font-weight='600'%3EDr%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className={`min-h-screen py-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Find Your Doctor
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Search and connect with healthcare professionals
          </p>
        </div>

        {/* Enhanced Filters */}
        <div className={`rounded-lg shadow-sm p-4 sm:p-6 mb-8 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                placeholder="Doctor Name"
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {loading ? 'Loading...' : `${allDoctors.length} ${allDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found`}
            </h3>
            
            {/* View Mode Toggle - Only show if more than 12 doctors */}
            {allDoctors.length > DOCTORS_PER_PAGE && (
              <button
                onClick={toggleViewMode}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'border-green-600 text-green-400 hover:bg-green-900/30'
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                {viewMode === 'paginated' ? 'View More Mode' : 'Pagination Mode'}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className={`flex items-center space-x-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Not Available</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Link key={doc._id} to={`/doctors/${doc._id}`} className="block group">
              <div className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border group-hover:border-green-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                {/* Card Header with Image */}
                <div className="relative bg-green-600 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doc.profileImage || getDefaultImage()}
                        alt={doc.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                        onError={(e) => {
                          e.target.src = getDefaultImage();
                        }}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        doc.availability ? 'bg-green-400' : 'bg-red-500'
                      }`}>
                        <svg className="w-2.5 h-2.5 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          {doc.availability ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">{doc.name}</h3>
                      <p className="text-green-100 text-sm truncate">{doc.specialty}</p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    {/* Hospital and Location */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-4 h-4 text-green-600 mt-0.5">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {doc.hospitalName}
                        </p>
                        <p className={`text-xs truncate ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {doc.location}
                        </p>
                      </div>
                    </div>

                    {/* Timings */}
                    {doc.timings && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-4 h-4 text-green-600 mt-0.5">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Timings
                          </p>
                          <p className={`text-xs truncate ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {doc.timings}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {doc.email && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-4 h-4 text-green-600 mt-0.5">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Contact
                          </p>
                          <a 
                            href={`mailto:${doc.email}`} 
                            className="text-green-600 text-xs hover:text-green-700 transition-colors truncate block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {doc.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Availability Status */}
                    <div className={`flex items-center justify-between pt-3 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${doc.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`font-medium text-xs ${
                          doc.availability ? 'text-green-600' : 'text-red-600'
                        }`}>
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
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                              theme === 'dark'
                                ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/70'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Map
                          </a>
                        )}
                        
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      

        {/* View More Button */}
        {!loading && viewMode === 'viewMore' && displayedDoctors.length < allDoctors.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleViewMore}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <span>View More Doctors</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && viewMode === 'paginated' && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {(() => {
                const pageNumbers = [];
                const showPages = 5; // Show 5 page numbers
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                let endPage = Math.min(totalPages, startPage + showPages - 1);
                
                // Adjust start page if we're near the end
                if (endPage - startPage < showPages - 1) {
                  startPage = Math.max(1, endPage - showPages + 1);
                }

                // First page + ellipsis
                if (startPage > 1) {
                  pageNumbers.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                      }`}
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pageNumbers.push(
                      <span key="ellipsis1" className={`px-2 text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ...
                      </span>
                    );
                  }
                }

                // Main page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                        currentPage === i
                          ? 'bg-green-600 text-white shadow-sm'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Last page + ellipsis
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push(
                      <span key="ellipsis2" className={`px-2 text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        ...
                      </span>
                    );
                  }
                  pageNumbers.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pageNumbers;
              })()}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {!loading && viewMode === 'paginated' && totalPages > 1 && (
          <div className={`text-center mt-4 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {((currentPage - 1) * DOCTORS_PER_PAGE) + 1} to {Math.min(currentPage * DOCTORS_PER_PAGE, allDoctors.length)} of {allDoctors.length} doctors
          </div>
        )}

        {/* View More Info */}
        {!loading && viewMode === 'viewMore' && allDoctors.length > DOCTORS_PER_PAGE && (
          <div className={`text-center mt-4 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {displayedDoctors.length} of {allDoctors.length} doctors
          </div>
        )}

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-20 h-20 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className={`text-base font-medium mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No doctors found
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Try adjusting your search criteria to find more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;