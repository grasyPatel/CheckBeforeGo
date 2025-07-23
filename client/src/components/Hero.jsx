import React from 'react';
import { Search, MapPin, Clock, Stethoscope, ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative -mt-20 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-900 dark:via-green-900 dark:to-gray-900 transition-all">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      </div>

      <div className="relative flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32">
        {/* Medical icon with pulse animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-full p-4 shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Main heading with enhanced styling */}
   <div className="flex justify-center px-4">
  <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold max-w-5xl leading-snug mb-6 bg-gradient-to-r from-green-800 via-emerald-700 to-green-600 bg-clip-text text-transparent">
    Check Doctor Availability in{' '}
    <span className="inline-block font-semibold animate-pulse text-green-500">Real-Time</span>{' '}
    Before You Go
  </h1>
</div>
        {/* Enhanced subtitle */}
         <p className="text-center text-sm md:text-xl lg:text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl leading-relaxed">
    Search for doctors near you by name, location, hospital, or specialization.
    Get real-time updates on availability and directions via Google Maps.
  </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="flex items-center justify-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-800 hover:scale-105 transition-transform duration-300">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">Real-Time Status</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-800 hover:scale-105 transition-transform duration-300">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">Location & Directions</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-100 dark:border-green-800 hover:scale-105 transition-transform duration-300">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-2">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">Smart Search</span>
          </div>
        </div>

        {/* Enhanced CTA button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="/doctors"
            className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Find Doctors Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">100% Free to Use</span>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by thousands of patients</p>
          <div className="flex items-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">5K+</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Doctors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">50+</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Cities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">24/7</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white" 
            fillOpacity="0.3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;