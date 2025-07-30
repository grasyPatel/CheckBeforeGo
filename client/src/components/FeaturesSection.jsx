
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Search, CalendarCheck, MessageSquare, Shield, Check, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  
  const features = [
    {
      icon: Clock,
      title: 'Real-Time Availability',
      description: 'See doctors\' current availability instantly. No more calling around or guessing. Book confidently with live updates.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      benefits: ['Live availability updates', 'No waiting calls', 'Instant booking confirmation'],
      delay: '0ms'
    },
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find top doctors and clinics nearest to you with integrated map directions and proximity filters.',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      benefits: ['Nearby doctor search', 'Integrated maps', 'Distance filtering'],
      delay: '150ms'
    },
    {
      icon: Search,
      title: 'Smart Search Filters',
      description: 'Filter by specialization, name, hospital, ratings, and experience to find your ideal healthcare provider.',
      color: 'text-green-700',
      bgColor: 'bg-green-200 dark:bg-green-900/40',
      benefits: ['Advanced filtering', 'Multiple search criteria', 'Personalized results'],
      delay: '300ms'
    },
    {
      icon: CalendarCheck,
      title: 'Effortless Booking',
      description: 'Schedule appointments directly through the platform. Receive instant confirmations and automated reminders.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      benefits: ['One-click booking', 'Instant confirmation', 'Smart reminders'],
      delay: '450ms'
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'Communicate securely with clinics and doctors for pre-appointment queries or follow-ups.',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      benefits: ['End-to-end encryption', 'Direct doctor communication', 'Query resolution'],
      delay: '600ms'
    },
    {
      icon: Shield,
      title: 'Data Privacy & Security',
      description: 'Your personal and medical data are protected with industry-leading encryption and privacy standards.',
      color: 'text-green-700',
      bgColor: 'bg-green-200 dark:bg-green-900/40',
      benefits: ['256-bit encryption', 'HIPAA compliant', 'Zero data sharing'],
      delay: '750ms'
    },
  ];

  useEffect(() => { 
    const timer = setTimeout(() => {
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleFeatures(prev => [...prev, index]);
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [features]); 

  return (
    <section className=" py-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/30 text-gray-900 dark:text-white relative overflow-hidden -mb-44">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-green-600/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Enhanced Header */}
        <div className="mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Trusted Healthcare Platform
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-700 dark:from-white dark:to-green-400">
            Why Choose Our Platform?
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We simplify your healthcare journey with innovative features designed for your convenience, security, and peace of mind.
          </p>
        </div>

        {/* Features Grid with Enhanced Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const isVisible = visibleFeatures.includes(index);
            const isHovered = hoveredFeature === index;

            return (
              <div
                key={index}
                className={`group relative transform transition-all duration-700 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${isHovered ? 'scale-105 z-10' : 'scale-100'}`}
                style={{ transitionDelay: feature.delay }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="relative h-full p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-100 dark:border-gray-700/50 overflow-hidden">

                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16">
                      <div className="w-full h-full bg-green-500 rounded-lg" />
                    </div>
                  </div>

                  {/* Icon with Enhanced Animation */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-5 rounded-2xl ${feature.bgColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <feature.icon className={`h-8 w-8 ${feature.color} relative z-10 transition-transform duration-300`} />
                    </div>

                    {/* Floating indicator */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-300 ${
                      isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-700 dark:from-white dark:to-green-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Benefits List with Animation */}
                  <div className={`space-y-2 transition-all duration-300 ${
                    isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                        style={{ transitionDelay: `${benefitIndex * 50}ms` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Hover Action Button */}
                  <div className={`mt-6 transition-all duration-300 ${
                    isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <button className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-sm hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700/50">
                    <div className={`h-full bg-green-500 transition-all duration-1000 ease-out ${
                      isVisible ? 'w-full' : 'w-0'
                    }`} style={{ transitionDelay: feature.delay }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;