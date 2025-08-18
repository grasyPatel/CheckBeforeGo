import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, Stethoscope, ArrowRight, CheckCircle, Hospital, UserPlus, FileText } from 'lucide-react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative -mt-20 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-950 dark:via-green-950 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-700">
      {/* Enhanced Background with Green Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main gradient orbs */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-green-400/30 to-emerald-300/30 dark:from-green-600/20 dark:to-emerald-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob-pulse"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 15}px)` }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-emerald-400/25 to-green-300/25 dark:from-emerald-600/15 dark:to-green-500/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob-pulse-reverse"
          style={{ transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -10}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-green-200/20 to-emerald-200/20 dark:from-green-700/10 dark:to-emerald-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl animate-pulse"
        />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
        
        {/* Floating medical elements */}
        <div className="absolute top-20 left-20 opacity-20 dark:opacity-30">
          <div 
            className="w-16 h-16 border-4 border-green-400 dark:border-green-500 rounded-full animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 20}px)` }}
          />
        </div>
        <div className="absolute bottom-32 right-32 opacity-15 dark:opacity-25">
          <div 
            className="w-12 h-12 bg-green-300 dark:bg-green-600 rounded-lg rotate-45 animate-bounce"
            style={{ transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 25}px) rotate(45deg)` }}
          />
        </div>
      </div>

      <div ref={heroRef} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* Left Section: Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl animate-fade-in-left">
          
       
         

          {/* Main Heading - Responsive typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
              Your Instant Gateway to
            </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 animate-pulse-strong drop-shadow-lg">
              Healthcare
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
              {' '}Availability.
            </span>
          </h1>

          {/* Subtitle - Enhanced readability */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 lg:mb-10 max-w-xl lg:mx-0 mx-auto leading-relaxed animate-fade-in-up delay-100">
            Find and connect with <strong className="text-green-600 dark:text-green-400">verified doctors</strong> in <strong className="text-green-600 dark:text-green-400">real-time</strong>. Get accurate availability, directions, and book appointments, hassle-free.
          </p>

          {/* CTA Buttons - Responsive design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-200">
            <a
              href="/doctors"
              className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              <span>Find My Doctor</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <a
              href="#features"
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-green-700 dark:text-green-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border-2 border-green-100 dark:border-green-800 hover:border-green-200 dark:hover:border-green-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 lg:mt-16 flex flex-wrap justify-center lg:justify-start gap-6 animate-fade-in-up delay-300">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">100% Free</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">5K+ Doctors</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">24/7 Available</span>
            </div>
          </div>
        </div>

        {/* Right Section: Enhanced Mockup */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mt-12 lg:mt-0 animate-fade-in-right">
          
          {/* Main mockup container with enhanced styling */}
          <div
            className="relative p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-green-100/50 dark:border-green-800/50 transform hover:rotate-0 transition-all duration-700 ease-out hover:shadow-3xl"
            style={{
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 8}px) rotate(2deg)`,
            }}
          >
            {/* App screenshot area */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden relative flex items-center justify-center border-2 border-green-100 dark:border-green-800">
              
              {/* Mock app interface */}
              <div className="w-full h-full p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">CheckBeforeGo</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div>
                
                {/* Search bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <div className="pl-10 pr-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-green-200 dark:border-green-700 text-gray-400 text-sm">
                    Search doctors near you...
                  </div>
                </div>
                
                {/* Doctor cards */}
                <div className="space-y-3 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-xl border border-green-100 dark:border-green-800">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">Dr</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-1" />
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-16" />
                      </div>
                      <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute bottom-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg animate-pulse-fade">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                LIVE
              </div>
            </div>

            {/* Feature callouts */}
            <div className="absolute -bottom-8 sm:-bottom-12 -left-4 sm:-left-8 grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in-up delay-300">
              {[
                { icon: Clock, text: "Real-time", color: "text-green-500" },
                { icon: MapPin, text: "Local Search", color: "text-green-600" },
                { icon: Hospital, text: "By Hospital", color: "text-emerald-500" },
                { icon: UserPlus, text: "Bookings", color: "text-emerald-600" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center p-2 sm:p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-green-800 transform hover:scale-105 transition-all duration-300 hover:border-green-200 dark:hover:border-green-700">
                  <feature.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${feature.color} mr-2`} />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

     

      {/* Enhanced CSS Animations */}
      <style jsx="true">{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(34, 197, 94, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(34, 197, 94, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .dark .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }

        @keyframes pulse-strong {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8)); }
        }
        .animate-pulse-strong { animation: pulse-strong 3s ease-in-out infinite; }

        @keyframes sway-icon {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        .animate-sway-icon { animation: sway-icon 4s ease-in-out infinite; }

        @keyframes blob-pulse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.05); }
        }
        .animate-blob-pulse { animation: blob-pulse 8s ease-in-out infinite; }

        @keyframes blob-pulse-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 20px) scale(0.95); }
        }
        .animate-blob-pulse-reverse { animation: blob-pulse-reverse 9s ease-in-out infinite; }

        @keyframes pulse-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-fade { animation: pulse-fade 2s ease-in-out infinite; }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 640px) {
          .container { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default Hero;