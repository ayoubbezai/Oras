import React from "react";
import { MdSecurity, MdSpeed, MdStar, MdCheckCircle } from "react-icons/md";

const CoveragePlans = () => {
  const plans = [
    {
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80",
      title: "Basic Coverage",
      description: "Essential protection for peace of mind",
      price: "$89",
      period: "/month",
      features: [
        "Liability Coverage",
        "Collision Protection",
        "24/7 Roadside Assistance",
        "Basic Medical Payments",
      ],
      popular: false,
    },
    {
      image:
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80",
      title: "Comprehensive Plan",
      description: "Complete protection for your vehicle",
      price: "$149",
      period: "/month",
      features: [
        "Full Coverage",
        "Theft Protection",
        "Rental Car Coverage",
        "Accident Forgiveness",
        "Glass Repair",
      ],
      popular: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80",
      title: "Premium Package",
      description: "Ultimate protection with premium benefits",
      price: "$229",
      period: "/month",
      features: [
        "All Comprehensive Features",
        "Zero Deductible",
        "Premium Rental Car",
        "Trip Interruption",
        "Personal Item Coverage",
        "Concierge Service",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Flexible{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Coverage
            </span>{" "}
            Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the protection that fits your needs and budget. All plans
            include 24/7 support and instant claims processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 max-w-350 mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative ${
                plan.popular ? "ring-4 ring-blue-500 ring-opacity-50" : ""
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
                  MOST POPULAR
                </div>
              )}

              <div className="h-48 overflow-hidden relative">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold text-white">
                    {plan.title}
                  </h3>
                  <p className="text-blue-200">{plan.description}</p>
                </div>
              </div>

              <div className="p-6 bg-white">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-800">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <MdCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {plan.popular ? "Get Started" : "Learn More"}
                </button>

              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-shadow duration-300">
            Compare All Plans
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoveragePlans;
