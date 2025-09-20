import React from "react";
import {
  MdSecurity,
  MdSpeed,
  MdPayments,
  MdSupportAgent,
  MdDiscount,
  MdCarCrash,
} from "react-icons/md";
import { GiCarKey } from "react-icons/gi";

const FeaturesSection = () => {
  const features = [
    {
      icon: <MdSecurity className="text-4xl text-blue-600" />,
      title: "24/7 Claims Support",
      description:
        "Round-the-clock assistance for accidents and emergencies with instant claim processing",
    },
    {
      icon: <MdSpeed className="text-4xl text-blue-600" />,
      title: "Instant Quotes",
      description:
        "Get personalized insurance quotes in under 2 minutes with our AI-powered system",
    },
    {
      icon: <MdPayments className="text-4xl text-blue-600" />,
      title: "Flexible Payments",
      description:
        "Choose from monthly, quarterly, or annual payment plans with no hidden fees",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-100 rounded-full opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
            <GiCarKey className="mr-2" />
            <span className="text-sm font-semibold">
              Why Choose Our Coverage
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Drive with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Confidence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive protection designed for modern drivers with innovative
            features and unbeatable service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-white transition-colors duration-500">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className="text-center mt-6">
                  <button className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center mx-auto">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
