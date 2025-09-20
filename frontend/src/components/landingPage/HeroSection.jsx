import React, { useState, useEffect, useRef } from 'react';
import { MdArrowForward, MdSecurity, MdSpeed, MdPayments } from 'react-icons/md';

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Insurance', 'Protection', 'Security', 'Coverage'];
  const carRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateCar = () => {
      const car = carRef.current;
      if (!car) return;

      // Reset car position
      car.style.transform = 'translateX(-100px)';
      
      // Animate car across screen
      setTimeout(() => {
        car.style.transition = 'transform 15s linear';
        car.style.transform = 'translateX(calc(100vw + 100px))';
      }, 100);

      // Loop animation
      setTimeout(() => {
        animateCar();
      }, 15100);
    };

    animateCar();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* 2D Animated Car */}
      <div 
        ref={carRef}
        className="absolute bottom-20 z-0 opacity-60"
        style={{ 
          transform: 'translateX(-600px), scale(5)',
          willChange: 'transform'
        }}
      >
        <svg width="120" height="60" viewBox="0 0 200 100" className="filter drop-shadow-lg">
          {/* Car Body */}
          <path d="M30,50 Q40,30 70,30 L130,30 Q160,30 170,50 L180,70 Q185,75 180,80 L150,80 Q145,85 140,80 L60,80 Q55,85 50,80 L20,80 Q15,75 20,70 Z" fill="#ffffff" />
          
          {/* Windows */}
          <path d="M70,35 L125,35 Q135,35 140,45 L140,55 Q135,65 125,65 L70,65 Q60,65 55,55 L55,45 Q60,35 70,35 Z" fill="#1e40af" opacity="0.3" />
          <line x1="100" y1="35" x2="100" y2="65" stroke="#ffffff" strokeWidth="2" />
          
          {/* Wheels */}
          <circle cx="50" cy="80" r="12" fill="#333" />
          <circle cx="50" cy="80" r="6" fill="#666" />
          <circle cx="150" cy="80" r="12" fill="#333" />
          <circle cx="150" cy="80" r="6" fill="#666" />
          
          {/* Headlights */}
          <circle cx="180" cy="55" r="5" fill="#ffd700" />
          <circle cx="180" cy="55" r="2" fill="#fff" />
          
          {/* Details */}
          <line x1="40" y1="45" x2="45" y2="45" stroke="#fff" strokeWidth="1" />
          <line x1="40" y1="55" x2="45" y2="55" stroke="#fff" strokeWidth="1" />
        </svg>
      </div>

      {/* Second smaller car going opposite direction */}
      <div className="absolute top-1/3 z-0 opacity-40" style={{ animation: 'carDriveReverse 20s linear infinite' }}>
        <svg width="80" height="40" viewBox="0 0 200 100" className="filter drop-shadow-lg">
          <path d="M170,50 Q160,30 130,30 L70,30 Q40,30 30,50 L20,70 Q15,75 20,80 L50,80 Q55,85 60,80 L140,80 Q145,85 150,80 L180,80 Q185,75 180,70 Z" fill="#e0f2fe" />
          <circle cx="50" cy="80" r="12" fill="#333" />
          <circle cx="150" cy="80" r="12" fill="#333" />
          <circle cx="20" cy="55" r="5" fill="#ffd700" />
        </svg>
      </div>

      {/* Floating car icons */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <MdSpeed className="text-6xl text-blue-300" />
      </div>
      <div className="absolute top-40 right-20 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <MdSecurity className="text-7xl text-indigo-300" />
      </div>
      <div className="absolute bottom-32 left-24 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <MdPayments className="text-5xl text-blue-200" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px]"></div>

      {/* Pulsing circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full opacity-10 animate-pulse-slow"></div>

      <div className="relative z-10 text-center px-4 max-w-6xl">
        {/* Badge */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm font-semibold">Trusted by 500K+ drivers</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Premium Car
          <span className="block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              {words[currentWord]}
            </span>
            <span className="inline-block w-1 h-16 bg-cyan-400 ml-4 animate-blink"></span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Get instant quotes, save up to 30% on your premium, and enjoy 24/7 claims support. 
          Your peace of mind is just a click away.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 flex items-center justify-center overflow-hidden">
            <span className="relative z-10 flex items-center">
              Get Free Quote <MdArrowForward className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button className="group relative bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <span className="relative z-10">Watch Demo</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">24/7</div>
            <div className="text-sm text-blue-200">Claims Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">30%</div>
            <div className="text-sm text-blue-200">Average Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">2min</div>
            <div className="text-sm text-blue-200">Quick Quote</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">4.9★</div>
            <div className="text-sm text-blue-200">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm text-blue-200 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Add custom animations to tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.15; }
        }
        @keyframes carDriveReverse {
          0% { transform: translateX(calc(100vw + 100px)) translateY(0); }
          100% { transform: translateX(-100px) translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  );
};

export default HeroSection;