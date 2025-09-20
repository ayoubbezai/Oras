// src/pages/Signup.jsx
import React, { useState } from "react";
import loginBG from "../assets/login/loginBackground.png";
import { signup } from "../services/auth"; // 👈 directly import API fn
import logo from "../assets/navbar/logo.png";
const Signup = () => {
  const [step, setStep] = useState(1);
  // Step 1 inputs
  const [fullName, setFullName] = useState("");
  // Then split into first/last
  const [firstName, lastName] = fullName.split(" ");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  // Step 2 inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States for API call
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Split fullName safely
    const names = fullName.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    // Prepare payload
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      name_of_company: insuranceCompany,
      password,
      password_confirmation: confirmPassword,
    };

    // ✅ Print payload before sending
    console.log("Signup payload:", payload);

    const result = await signup(payload);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
    console.log("Signup result:", result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-400 h-[800px] rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Right side with signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-700">Register</h1>
              <p className="text-gray-500 mt-2">
                Join NovelHome: Start Your Journey to Finding Your Perfect Home
              </p>

              {/* Step indicator */}
              <div className="flex justify-center mt-4 mb-2">
                <div
                  className={`h-2 w-8 rounded-full mx-1 ${
                    step === 1 ? "bg-blue-600" : "bg-blue-300"
                  }`}
                ></div>
                <div
                  className={`h-2 w-8 rounded-full mx-1 ${
                    step === 2 ? "bg-blue-600" : "bg-blue-300"
                  }`}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Step {step} of 2</p>
            </div>

            {/* Step 1: Company Admin Info */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +213 555 123 456"
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                    placeholder="ABC Insurance"
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg"
                >
                  Next
                </button>
              </form>
            )}

            {/* Step 2: Password Setup */}
            {step === 2 && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Create Your Password
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Please create a secure password for your account.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Create Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use at least 8 characters with a mix of letters, numbers &
                      symbols
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-600 text-sm text-center mt-2">
                    Signup successful!
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Left side with background */}
        <div
          className="hidden lg:flex lg:w-1/2 relative"
          style={{
            backgroundImage: `url(${loginBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#153A8A]/80 to-[#2565F0]/80"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
            <img
              src={logo}
              alt="NovelHome Logo"
              className="h-16 w-auto mb-6 drop-shadow-md"
            />
            <p className="text-lg text-center drop-shadow-md">
              Start Your Journey to Finding Your Perfect Home. Register now and
              access exclusive modern real estate solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
