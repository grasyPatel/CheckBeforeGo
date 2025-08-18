import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, CalendarDays, CheckCircle2, Clock, MapPin, Bell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const intervalRef = useRef(null); 

 
  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width, 
        y: (e.clientY - rect.top - rect.height / 2) / rect.height, 
      });
    }
  }, []);

  const handleNavigateToDoctorSearch = () => {
    navigate('/login/user');
    
  }

  // Intersection Observer for section visibility and auto-play logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Start auto-cycling when visible
            intervalRef.current = setInterval(() => {
              setActiveStep(prev => (prev + 1) % 3);
            }, 5000); // Cycle every 5 seconds
          } else {
            setIsVisible(false); // Section is out of view
            if (intervalRef.current) {
              clearInterval(intervalRef.current); // Stop auto-play
            }
          }
        });
      },
      { 
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Start slightly before entering viewport fully
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup: Clear observer and interval when component unmounts
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const steps = [
    {
      icon: Search,
      title: '1. Search & Check Availability',
      description: 'Use our smart search to find doctors by specialization, location, or name. Check real-time availability and reviews.',
      color: 'bg-green-500',
      lightColor: 'bg-green-50 dark:bg-green-900/30',
      features: ['Real-time availability', 'Doctor reviews', 'Location-based search'],
      decorativeIcon: MapPin,
      stats: '10,000+ Doctors',
      gradient: 'from-green-400 to-green-600'
    },
    {
      icon: CalendarDays,
      title: '2. Book Your Appointment',
      description: 'Select a convenient time slot and book your appointment in just a few clicks. Get instant confirmation and reminders.',
      color: 'bg-green-600',
      lightColor: 'bg-green-50 dark:bg-green-900/30',
      features: ['Instant booking', 'Time slot selection', 'Confirmation alerts'],
      decorativeIcon: Clock,
      stats: '< 30 Seconds',
      gradient: 'from-green-500 to-green-700'
    },
    {
      icon: CheckCircle2,
      title: '3. Get Timely Care',
      description: 'Receive automated reminders, directions, and preparation guidelines. Arrive confident and get the care you need.',
      color: 'bg-green-700',
      lightColor: 'bg-green-50 dark:bg-green-900/30',
      features: ['Smart reminders', 'Navigation help', 'Prep guidelines'],
      decorativeIcon: Bell,
      stats: '98% Success Rate',
      gradient: 'from-green-600 to-green-800'
    },
  ];

  // Manual step interaction (hover/click) will temporarily stop auto-play
  const handleStepInteraction = (index) => {
    setActiveStep(index);
    // Stop auto-play temporarily. It will restart when the step changes or on hover out.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      // You could add a timeout here to restart auto-play after a few seconds
      // if no further user interaction occurs, but for simplicity, we'll leave it stopped.
    }
  };

  // Re-start auto-play when mouse leaves a step card (if it was stopped)
  const handleMouseLeaveStep = () => {
    if (!intervalRef.current) { // Only restart if it was previously stopped manually
        intervalRef.current = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 3);
        }, 5000);
    }
  };


  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/30 text-gray-900 dark:text-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced Background Elements with Dynamic Parallax & Smooth Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-60 -right-60 w-[700px] h-[700px] bg-green-400/8 rounded-full blur-3xl animate-blob-flow"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px) scale(${1 + Math.abs(mousePosition.x) * 0.05})`
          }}
        />
        <div
          className="absolute -bottom-60 -left-60 w-[800px] h-[800px] bg-green-500/8 rounded-full blur-3xl animate-blob-flow-reverse delay-[2000ms]"
          style={{
            transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px) scale(${1 + Math.abs(mousePosition.y) * 0.05})`
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-3xl animate-blob-flow delay-[4000ms]"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 15}px), calc(-50% + ${mousePosition.y * 15}px))`
          }}
        />

        {/* Floating particles - subtle and numerous */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/15 rounded-full animate-float-gentle"
            style={{
              left: `${10 + (i * 9.7) % 80}%`, // Distribute horizontally
              top: `${20 + (i * 13.5) % 60}%`, // Distribute vertically
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + i * 0.3}s`,
              transform: `translate(${mousePosition.x * (i % 2 === 0 ? 5 : -5)}px, ${mousePosition.y * (i % 2 === 0 ? -5 : 5)}px)`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Enhanced Header with Smooth Entrance & Micro-animations */}
        <div className={`transform transition-all duration-1200 ease-out-expo ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 bg-green-100/80 dark:bg-green-900/30 backdrop-blur-sm rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6 animate-pulse-breathing">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping" />
            Simple Healthcare Process
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-700 dark:from-white dark:to-green-400 animate-gradient-text-subtle">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-6 rounded-full animate-line-expand" />
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Getting the right medical care is now easier than ever. Follow these simple steps to connect with the perfect healthcare provider.
          </p>
        </div>

        {/* Enhanced Steps Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          {/* Animated Progress Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-px pointer-events-none">
            <div className="relative w-full h-full">
              <div className="absolute left-1/6 right-1/6 h-full">
                <div className="w-full h-full border-t-2 border-dashed border-gray-300/50 dark:border-gray-600/50 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 opacity-60 transition-all duration-1000 ease-in-out-sine"
                    style={{
                      width: `${((activeStep + 1) / steps.length) * 100}%`,
                      marginTop: '-1px',
                      boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;
            const initialDelay = isVisible ? index * 200 + 400 : 0; // Staggered entrance after header

            return (
              <div
                key={index}
                className={`group relative z-10 transform transition-all duration-800 ease-out-quint ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
                } ${isActive ? 'scale-105' : 'scale-100'}`}
                style={{ transitionDelay: `${initialDelay}ms` }}
                onMouseEnter={() => handleStepInteraction(index)}
                onMouseLeave={handleMouseLeaveStep} // Add onMouseLeave to restart auto-play
              >
                <div className={`relative p-8 rounded-3xl transition-all duration-600 ease-out-expo transform group-hover:-translate-y-4
                               bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border shadow-xl group-hover:shadow-2xl
                               ${isActive ? 'border-green-400/60 ring-4 ring-green-400/20 shadow-green-300/60 dark:shadow-green-800/60' : 'border-gray-200/50 dark:border-gray-700/50'}
                               ${isCompleted ? 'ring-2 ring-green-300/30' : ''}`}>

                  {/* Status Indicator (top right) */}
                  <div className="absolute -top-3 -right-3">
                    {isCompleted && (
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center animate-pop-in">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {isActive && (
                      <div className="w-7 h-7 bg-green-400 rounded-full animate-ping-strong opacity-75" />
                    )}
                  </div>

                  {/* Decorative Background Pattern - Parallax with Mouse */}
                  <div
                    className="absolute top-4 right-4 opacity-5 dark:opacity-3 overflow-hidden transition-transform duration-300"
                    style={{
                      transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px) rotate(${mousePosition.x * 10}deg)`
                    }}
                  >
                    <step.decorativeIcon className="h-24 w-24 text-gray-400 animate-float-slow" />
                  </div>

                  {/* Enhanced Icon Container with Hover Effects */}
                  <div className="relative mb-8">
                    <div className={`inline-flex p-6 rounded-2xl ${step.lightColor} transition-all duration-700 ease-out-quint relative overflow-hidden group-hover:scale-105`}>
                      {/* Glowing background effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-700 ${isActive ? 'opacity-30' : ''}`} />
                      <div className={`absolute inset-0 rounded-2xl ${step.color} opacity-10 blur-2xl transition-all duration-700 ease-out-expo ${isActive ? 'scale-150 opacity-40' : 'scale-100'}`} />

                      {/* Animated rings for active state */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-2xl border-2 border-green-400/40 animate-pulse-soft" />
                          <div className="absolute inset-0 rounded-2xl border border-green-400/60 animate-pulse-stronger" />
                        </>
                      )}

                      <step.icon className={`h-12 w-12 text-white relative z-10 transition-all duration-700 ease-out-quint ${
                        isActive ? 'scale-125 rotate-8 drop-shadow-lg' : 'scale-100'
                      } group-hover:scale-110 group-hover:rotate-3`} />
                    </div>

                    {/* Step number indicator */}
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg animate-pop-in-delay">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-700 dark:from-white dark:to-green-300">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Stats Badge with a subtle animation */}
                  <div className="inline-flex items-center px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6 animate-fade-in-up-stagger" style={{ transitionDelay: isActive ? '300ms' : '0ms' }}>
                    {step.stats}
                  </div>

                  {/* Enhanced Feature List with Staggered Fade-in/Slide-in */}
                  <div className="space-y-3 mb-6">
                    {step.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className={`flex items-center text-sm text-gray-500 dark:text-gray-400 transition-all duration-500 ease-out-quad ${
                          isActive ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                        }`}
                        style={{ transitionDelay: isActive ? `${featureIndex * 120 + 200}ms` : '0ms' }} // Staggered and slightly delayed from card entrance
                      >
                        <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-300 ${
                          isActive ? 'bg-green-500 animate-dot-pulse' : 'bg-gray-400'
                        }`} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Button - Visible only on active/hover */}
                  <div className={`transition-all duration-400 ease-out-quad ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <button className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-base hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 group">
                      Explore this Step
                      <ArrowRight className="h-4 w-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Enhanced Progress Bar - Gradient fill */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700/50 rounded-b-3xl overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-1000 ease-in-out-sine ${
                        isActive ? 'w-full shadow-lg' : isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Step Indicators with Hover State */}
        <div className="flex justify-center mb-12 space-x-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepInteraction(index)} // Use unified click handler
              className={`relative transition-all duration-400 ease-out group ${
                activeStep === index
                  ? 'scale-150'
                  : 'scale-100 hover:scale-120'
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ease-out-quad ${
                activeStep === index
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-green-300 dark:group-hover:bg-green-600'
              }`} />
              {activeStep === index && (
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-75" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Call to Action with Entrance Animation */}
        <div className={`transform transition-all duration-1200 ease-out-expo delay-[800ms] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-8 rounded-3xl shadow-2xl overflow-hidden animate-pulse-cta">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 animate-bg-gradient-shift" /> {/* Animated gradient shift */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-green-50 mb-6 text-base max-w-lg mx-auto leading-relaxed">
                Join thousands of patients who've simplified their healthcare journey and found the right care, right when they need it.
              </p>
              <button onClick={handleNavigateToDoctorSearch} className="bg-white text-green-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out-quint group">
                Find Your Doctor Now
                <ArrowRight className="inline h-5 w-5 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NEW & Enhanced CSS Animations */}
      <style jsx="true">{`
        /* Custom Easing Functions */
        .ease-out-quad { transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .ease-out-expo { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        .ease-out-quint { transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1); } /* Smoother, more pronounced deceleration */
        .ease-in-out-sine { transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95); } /* Gentle start and end */
        .ease-out-back { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); } /* For a slight overshoot */

        /* Background Blob Animations - Continuous flow, less repetitive */
        @keyframes blob-flow {
          0% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(20px, -15px) scale(1.02); }
          50% { transform: translate(-10px, 10px) scale(0.98); }
          75% { transform: translate(15px, -5px) scale(1.01); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-flow { animation: blob-flow 25s ease-in-out infinite alternate; } /* Longer duration, alternate */

        @keyframes blob-flow-reverse {
          0% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(-15px, 20px) scale(0.98); }
          50% { transform: translate(10px, -10px) scale(1.02); }
          75% { transform: translate(-5px, 15px) scale(0.99); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-flow-reverse { animation: blob-flow-reverse 28s ease-in-out infinite alternate; }

        /* Floating particles - softer movement */
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          33% { transform: translateY(-8px) rotate(5deg); opacity: 0.6; }
          66% { transform: translateY(-4px) rotate(-5deg); opacity: 0.9; }
        }
        .animate-float-gentle { animation: float-gentle 5s ease-in-out infinite; }

        /* Header Line Expansion */
        @keyframes line-expand {
          0%, 100% { width: 5rem; }
          50% { width: 6.5rem; }
        }
        .animate-line-expand { animation: line-expand 2.5s ease-in-out infinite; }

        /* Badge Pulse (Gentle breathing) */
        @keyframes pulse-breathing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-breathing { animation: pulse-breathing 3s ease-in-out infinite; }

        /* Pop-in for checkmark/step number */
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.5s ease-out-back; } /* Using ease-out-back for a slight bounce */
        .animate-pop-in-delay { animation: pop-in 0.5s ease-out-back 0.2s forwards; opacity: 0; } /* Added delay to step number */

        /* Stronger ping for active step status dot */
        @keyframes ping-strong {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping-strong { animation: ping-strong 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }

        /* Icon active state glowing ring pulse */
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-soft { animation: pulse-soft 1.8s ease-in-out infinite; }

        @keyframes pulse-stronger {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .animate-pulse-stronger { animation: pulse-stronger 2.2s ease-in-out infinite; }

        /* Feature dot pulse */
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .animate-dot-pulse { animation: dot-pulse 1s ease-in-out infinite alternate; }

        /* CTA background gradient shift */
        @keyframes bg-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-bg-gradient-shift {
          background-size: 200% auto;
          animation: bg-gradient-shift 8s ease-in-out infinite alternate;
        }

        /* Text gradient for header - subtle shift */
        @keyframes gradient-text-subtle {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-text-subtle {
          background-size: 200% auto;
          animation: gradient-text-subtle 6s ease-in-out infinite alternate;
        }

        /* Specific entrance for stats badge */
        @keyframes fade-in-up-stagger {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-stagger { animation: fade-in-up-stagger 0.6s ease-out-quad forwards; opacity: 0; }
      `}</style>
    </section>
  );
};

export default HowItWorks;