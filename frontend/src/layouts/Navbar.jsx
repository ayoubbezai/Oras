import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import useNavigate
import logo from "../assets/navbar/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navigate = useNavigate(); // 👈 initialize navigate

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r bg-white text-black shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto mr-2 inline-block"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-row md:block mr-25">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
              >
                Home
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
              >
                Features
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
              >
                Feedbacks
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
              >
                Plans
              </a>
            </div>
            {/* Docs link */}
            <button
              onClick={() => navigate("/documentation")} // navigate to docs page
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-indigo-700 transition-all duration-300 hover:scale-105 ml-20"
            >
              Docs
            </button>
          </div>

          {/* Right side */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Login/User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                  className="flex items-center text-sm font-medium text-dark-blue hover:text-blue-600 transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Login
                </button>

                {isLoginOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate("/signup")}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                      >
                        Create Account
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                      >
                        Help Center
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={!isMenuOpen ? "block" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={isMenuOpen ? "block" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-600"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-600"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
