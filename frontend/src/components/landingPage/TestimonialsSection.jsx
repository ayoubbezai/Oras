import React, { useState, useEffect } from 'react';
import { 
  MdChevronLeft, 
  MdChevronRight, 
  MdFormatQuote, 
  MdStar,
  MdStarBorder,
  MdPlayCircle,
  MdPauseCircle
} from 'react-icons/md';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Owner",
      content: "NoveHome made finding our dream house so effortless. The virtual tours saved us countless hours of visiting properties. The team was incredibly responsive and professional throughout the entire process.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      video: false
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      content: "The market insights and analytics provided by NoveHome helped me make informed investment decisions that yielded a 23% return in just six months. Their platform is revolutionary for serious investors.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      video: true
    },
    {
      name: "Emily Rodriguez",
      role: "First-time Buyer",
      content: "As a first-time home buyer, I was nervous about the process. The NoveHome team guided me through every step with patience and expertise. I couldn't have asked for a better experience!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      rating: 4,
      video: false
    },
    {
      name: "James Wilson",
      role: "Commercial Investor",
      content: "NoveHome's commercial property tools are unmatched. I've streamlined my portfolio management and identified opportunities I would have otherwise missed.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      video: true
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [animation, setAnimation] = useState('enter');

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setAnimation('exit');
        setTimeout(() => {
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
          setAnimation('enter');
        }, 300);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setAnimation('exit');
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setAnimation('enter');
    }, 300);
  };

  const prevTestimonial = () => {
    setAnimation('exit');
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setAnimation('enter');
    }, 300);
  };

  const goToTestimonial = (index) => {
    setAnimation('exit');
    setTimeout(() => {
      setCurrentTestimonial(index);
      setAnimation('enter');
    }, 300);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating 
          ? <MdStar key={i} className="text-yellow-400 text-xl" />
          : <MdStarBorder key={i} className="text-yellow-400 text-xl" />
      );
    }
    return stars;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <MdFormatQuote className="text-3xl text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-blue-200">Discover why thousands trust NoveHome for their real estate journey</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left arrow */}
            <div className="hidden lg:flex justify-end">
              <button 
                onClick={prevTestimonial}
                className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 group"
              >
                <MdChevronLeft className="text-3xl text-white group-hover:text-blue-300" />
              </button>
            </div>

            {/* Testimonial card */}
            <div className="col-span-1 lg:col-span-1">
              <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform transition-all duration-500 ${
                animation === 'enter' 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={testimonials[currentTestimonial].avatar} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    />
                    {testimonials[currentTestimonial].video && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1">
                        <MdPlayCircle className="text-white text-lg" />
                      </div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-white">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-blue-200">{testimonials[currentTestimonial].role}</p>
                    <div className="flex mt-2">
                      {renderStars(testimonials[currentTestimonial].rating)}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <MdFormatQuote className="text-4xl text-blue-300 absolute -top-6 -left-2 opacity-50" />
                  <p className="text-white text-lg leading-relaxed relative z-10">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-white w-8' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Auto-play toggle */}
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center text-blue-200 hover:text-white transition-colors"
                  >
                    {isAutoPlaying ? (
                      <MdPauseCircle className="text-xl mr-2" />
                    ) : (
                      <MdPlayCircle className="text-xl mr-2" />
                    )}
                    {isAutoPlaying ? 'Pause' : 'Play'} auto-scroll
                  </button>
                </div>
              </div>
            </div>

            {/* Right arrow */}
            <div className="hidden lg:flex justify-start">
              <button 
                onClick={nextTestimonial}
                className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 group"
              >
                <MdChevronRight className="text-3xl text-white group-hover:text-blue-300" />
              </button>
            </div>
          </div>

          {/* Mobile arrows */}
          <div className="flex justify-center mt-8 lg:hidden space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <MdChevronLeft className="text-2xl text-white" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <MdChevronRight className="text-2xl text-white" />
            </button>
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default TestimonialsSection;