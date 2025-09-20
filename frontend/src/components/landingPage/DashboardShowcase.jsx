import React, { useState, useEffect } from "react";
import {
  MdDesktopMac,
  MdPhoneIphone,
  MdArrowForward,
  MdArrowBackIos,
  MdArrowForwardIos,
  MdCheckCircle,
  MdTrendingUp,
  MdSecurity,
  MdSpeed,
  MdTouchApp,
  MdPause,
  MdPlayArrow
} from "react-icons/md";
import deskImg1 from "../../assets/landingPage/desk1.png";
import deskImg2 from "../../assets/landingPage/desk2.png";
import deskImg3 from "../../assets/landingPage/desk3.png";
import mobile1 from "../../assets/landingPage/mobile1.jpg";
import mobile2 from "../../assets/landingPage/mobile2.jpg";
import mobile3 from "../../assets/landingPage/mobile3.jpg";
import mobile4 from "../../assets/landingPage/mobile4.jpg";
import mobile5 from "../../assets/landingPage/mobile5.jpg";

const DashboardShowcase = () => {
  const [activeTab, setActiveTab] = useState("desktop");
  const [desktopImageIndex, setDesktopImageIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Replace these with your actual image paths
  const desktopImages = [deskImg1, deskImg2, deskImg3];
  const mobileImages = [mobile1, mobile2, mobile3, mobile4, mobile5];

  // Auto-advance images effect
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        if (activeTab === "desktop") {
          setDesktopImageIndex((prevIndex) => (prevIndex + 1) % desktopImages.length);
        } else {
          setMobileImageIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
        }
      }, 3000); // Change image every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeTab, desktopImages.length, mobileImages.length]);

  const features = [
    {
      icon: <MdTrendingUp className="text-blue-500 text-xl" />,
      title: "Real-time Analytics",
      description: "Track your insurance performance with live data updates",
    },
    {
      icon: <MdSecurity className="text-green-500 text-xl" />,
      title: "Secure Data",
      description: "Bank-level encryption keeps all your information safe",
    },
    {
      icon: <MdSpeed className="text-purple-500 text-xl" />,
      title: "Fast Processing",
      description: "Quick claims processing with AI-powered automation",
    },
    {
      icon: <MdTouchApp className="text-orange-500 text-xl" />,
      title: "Easy to Use",
      description: "Intuitive interface designed for all user levels",
    },
  ];

  const nextDesktopImage = () => {
    setDesktopImageIndex((prevIndex) => (prevIndex + 1) % desktopImages.length);
  };

  const prevDesktopImage = () => {
    setDesktopImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + desktopImages.length) % desktopImages.length
    );
  };

  const nextMobileImage = () => {
    setMobileImageIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
  };

  const prevMobileImage = () => {
    setMobileImageIndex(
      (prevIndex) => (prevIndex - 1 + mobileImages.length) % mobileImages.length
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience Our Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful insurance management tools on desktop and mobile, designed
            to streamline your workflow
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Features */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              <div className="mb-10">
                <div className="flex space-x-4 bg-gray-100 p-1 rounded-xl w-max mx-auto lg:mx-0">
                  <button
                    onClick={() => setActiveTab("desktop")}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                      activeTab === "desktop"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MdDesktopMac className="mr-2" />
                    Desktop Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                      activeTab === "mobile"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MdPhoneIphone className="mr-2" />
                    Mobile App
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === "desktop" ? "Desktop Dashboard" : "Mobile App"}{" "}
                Features
              </h3>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto-play toggle */}
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={toggleAutoPlay}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {isAutoPlaying ? (
                    <>
                      <MdPause className="mr-2" />
                      Pause Auto-Play
                    </>
                  ) : (
                    <>
                      <MdPlayArrow className="mr-2" />
                      Play Auto-Play
                    </>
                  )}
                </button>
              </div>

              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center">
                Get Started Now
                <MdArrowForward className="ml-2" />
              </button>
            </div>
          </div>

          {/* Right Column - Showcase */}
          <div className="lg:w-3/5">
            {activeTab === "desktop" ? (
              <div className="relative">
                {/* Browser Frame */}
                <div className="bg-gray-800 rounded-t-xl p-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-gray-400 text-sm">
                    app.insuranceportal.com
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <div className={`w-2 h-2 rounded-full mr-1 ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    Auto
                  </div>
                </div>

                {/* Image Carousel */}
                <div className="bg-gray-900 rounded-b-xl overflow-hidden shadow-2xl relative">
                  <img
                    src={desktopImages[desktopImageIndex]}
                    alt={`Desktop view ${desktopImageIndex + 1}`}
                    className="w-full h-auto object-cover transition-opacity duration-500"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevDesktopImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <MdArrowBackIos />
                  </button>
                  <button
                    onClick={nextDesktopImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <MdArrowForwardIos />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {desktopImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setDesktopImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === desktopImageIndex
                            ? "bg-white w-6"
                            : "bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-blue-500 rounded-xl opacity-10"></div>
                <div className="absolute -z-20 top-8 -right-8 w-full h-full bg-purple-500 rounded-xl opacity-5"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-80 h-[600px]">
                    <div className="absolute inset-0 bg-gray-800 rounded-[40px] shadow-2xl border-8 border-gray-900"></div>

                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-lg z-10"></div>

                    {/* Screen Content */}
                    <div className="absolute inset-2 bg-gray-900 rounded-[32px] overflow-hidden">
                      <img
                        src={mobileImages[mobileImageIndex]}
                        alt={`Mobile view ${mobileImageIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevMobileImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <MdArrowBackIos size={16} />
                      </button>
                      <button
                        onClick={nextMobileImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <MdArrowForwardIos size={16} />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {mobileImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setMobileImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === mobileImageIndex
                                ? "bg-white w-4"
                                : "bg-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Auto-play indicator for mobile */}
                  <div className="absolute -top-6 right-4 bg-white px-2 py-1 rounded-full text-xs flex items-center shadow-sm">
                    <div className={`w-2 h-2 rounded-full mr-1 ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    Auto
                  </div>

                  {/* Floating App Icons */}
                  <div className="absolute -right-6 top-1/3 bg-white p-3 rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MdCheckCircle className="text-blue-500 text-2xl" />
                    </div>
                  </div>

                  <div className="absolute -left-6 bottom-1/4 bg-white p-3 rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MdSecurity className="text-green-500 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShowcase;