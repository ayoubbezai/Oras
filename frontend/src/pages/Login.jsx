import React, { useState } from "react";
import loginBG from "../assets/login/loginBackground.png";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/auth"; // ✅ Rename to avoid conflict
import { useAuth } from "../utils/AuthContext"; // ✅ Import useAuth
import logo from "../assets/navbar/logo.png";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Get the login function from AuthProvider
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Login payload:", { email, password });

    try {
      // ✅ Call your API service (renamed to avoid conflict)
      const result = await loginApi(email, password);
      console.log("Login result:", result);

      if (result.error) {
        setError(result.error);
      } else if (result.success && result.user) {
        // ✅ CRITICAL: Call AuthProvider's login method to save cookies and set state
        console.log("Calling AuthProvider login with:", result.user);
        login(result.user);

        // Navigate to appropriate page
        if (result.user.role === "company_admin") {
          navigate("/company/overview");
        } else if (result.user.role === "admin") {
          navigate("/admin/overview");
        } else {
          navigate("/dashboard"); // fallback
        }
      } else {
        setError("Login failed - invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="flex w-full max-w-400 rounded-2xl overflow-hidden shadow-2xl bg-white">
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#153A8A] to-[#2565F0]"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
            <img
              src={logo}
              alt="NovelHome Logo"
              className="h-16 w-auto mb-6 drop-shadow-md"
            />
            <p className="text-lg text-white drop-shadow-md text-center">
              Your Gateway to Modern Real Estate Solutions. Discover your dream
              home with our innovative platform.
            </p>
         
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-700">Sign in</h1>
              <p className="text-gray-500 mt-2">
                Welcome to NovelHome: Your Gateway to Modern Real Estate
                Solutions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Phone Number
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. javid@overview.com"
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="space-y-4">
              <button
                onClick={() => alert("Google login")}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue With Google
              </button>

              <button
                onClick={() => alert("Apple login")}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue With Apple
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                I don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
