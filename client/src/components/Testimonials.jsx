import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      quote: "This platform is a game-changer! Finding a doctor with real-time availability has saved me so much time and stress. Highly recommended!",
      author: "Priya Sharma",
      location: "Bengaluru, India",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      specialty: "Working Mother"
    },
    {
      quote: "I was able to book an appointment for my mother in minutes. The interface is intuitive, and the information is incredibly accurate. Thank you!",
      author: "Rajesh Kumar",
      location: "Mumbai, India",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      specialty: "Family Caregiver"
    },
    {
      quote: "Finally, a reliable way to check doctor availability! It's made managing my family's appointments so much easier. A must-have app!",
      author: "Anjali Singh",
      location: "Delhi, India",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      specialty: "Busy Professional"
    },
    {
      quote: "The best healthcare booking platform I've used. Quick, reliable, and the doctors are always available when shown. Excellent service!",
      author: "Dr. Vikram Patel",
      location: "Chennai, India",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      specialty: "Medical Professional"
    },
    {
      quote: "Booking appointments for my elderly parents has never been easier. The platform is user-friendly and the support is outstanding!",
      author: "Meera Gupta",
      location: "Pune, India",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      specialty: "Senior Care"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} fill-current transition-colors duration-300`}
          />
        ))}
      </div>
    );
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visible.push({ ...testimonials[index], slideIndex: i });
    }
    return visible;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-700 dark:from-white dark:to-green-400">
            What Our Users Say
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-4 rounded-full" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear directly from people who have experienced the convenience and ease of finding healthcare with us.
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-green-200 dark:border-gray-600"
          >
            <ChevronLeft className="h-6 w-6 text-green-600 dark:text-green-400" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-green-200 dark:border-gray-600"
          >
            <ChevronRight className="h-6 w-6 text-green-600 dark:text-green-400" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-16">
            {getVisibleTestimonials().map((testimonial, index) => {
              const isCenter = index === 1;
              const scaleClass = isCenter ? 'lg:scale-105' : 'lg:scale-95';
              const opacityClass = isCenter ? 'opacity-100' : 'lg:opacity-75';
              
              return (
                <div
                  key={`${testimonial.author}-${currentSlide}`}
                  className={`transform transition-all duration-700 ease-in-out ${scaleClass} ${opacityClass}`}
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-100 dark:border-gray-700 group">
                    {/* Quote Icon */}
                    <div className="absolute -top-4 left-8">
                      <div className="bg-green-500 p-3 rounded-full shadow-lg">
                        <Quote className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="mt-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 dark:text-gray-300 text-base italic mb-8 leading-relaxed min-h-[100px] flex items-center">
                      "{testimonial.quote}"
                    </p>

                    {/* User Info */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-16 h-16 rounded-full object-cover border-4 border-green-400 shadow-lg transition-transform duration-300 group-hover:scale-110"
                        />
                       
                      </div>
                      
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                        {testimonial.specialty}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-green-400/30 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-green-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-green-300 dark:hover:bg-green-600'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Control */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            </button>
          </div>
        </div>

     
       
      </div>
    </section>
  );
};

export default Testimonials;