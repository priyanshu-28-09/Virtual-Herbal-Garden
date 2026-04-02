import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockClosedIcon from "@heroicons/react/solid/LockClosedIcon";
import axios from "axios";
import { useAuth } from "../../../AuthContext";

export default function HerbalLogin({ setIsAuthenticated, setUserRole }) {
  const auth = useAuth() || {};
  const authSetIsAuthenticated = auth.setIsAuthenticated || (() => {});
  const authSetUser = auth.setUser || (() => {});
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("✅ Already logged in:", userData);
        
        // Update App.jsx states
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUserRole) setUserRole(userData.role);
        
        // If already logged in, redirect to appropriate dashboard
        if (userData.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (userData.role === "content-creator") {
          navigate("/content-creator/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        // If there's an error parsing user data, clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate, setIsAuthenticated, setUserRole]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Input validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log("🔐 Attempting login with:", { 
        email: email.trim(), 
        selectedRole 
      });

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: email.trim(),
          password: password.trim(),
          role: selectedRole,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log("✅ Login response:", response.data);

      const { token, user } = response.data;

      if (token && user) {
        // Clear any existing auth data first
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Set new auth data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        console.log("✅ LocalStorage updated:", { token, user });

        // Update App.jsx states (IMPORTANT for admin login)
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
          console.log("✅ App.jsx setIsAuthenticated: true");
        }
        
        if (setUserRole) {
          setUserRole(user.role);
          console.log("✅ App.jsx setUserRole:", user.role);
        }

        // Update auth context
        try {
          authSetIsAuthenticated(true);
          authSetUser(user);
          console.log("✅ AuthContext updated");
        } catch (err) {
          console.warn("Auth context update failed:", err);
        }

        // Navigate based on role
        console.log("🚀 Navigating to dashboard for role:", user.role);
        
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "content-creator") {
          navigate("/content-creator/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        setError("Invalid server response. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      
      // Enhanced error handling
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError("Cannot connect to server. Please check if the backend is running on port 5000.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid email or password.");
      } else if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.status === 403) {
        setError(`You don't have permission to login as ${selectedRole}. Please select the correct role.`);
      } else if (err.response?.status === 503) {
        setError("Server is temporarily unavailable. Please try again later.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (error) setError("");
  };

  const testBackendConnection = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/health", {
        timeout: 5000
      });
      console.log("✅ Backend connection successful:", response.data);
      alert("Backend is running! ✅");
      return true;
    } catch (err) {
      console.error("❌ Backend connection failed:", err);
      alert("Backend is NOT running! ❌\nMake sure your server is running on port 5000.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] relative overflow-hidden">
      {/* Background decorative element */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2ECC71]/30 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/90 dark:bg-[#0F1720]/90 shadow-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-lg transition-all">
        {/* Header */}
        <div className="mx-auto flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] flex items-center justify-center shadow-lg">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Login to explore the Virtual Herbal Garden
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" autoComplete="off" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-900 dark:text-gray-300 font-semibold">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              autoFocus
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2f24] border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your@email.com"
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-900 dark:text-gray-300 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2f24] border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-[#2ECC71] focus:outline-none disabled:opacity-50"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isLoading}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-3 text-gray-900 dark:text-gray-300 font-semibold">
              Login as
            </label>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-admin"
                  name="role"
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={() => handleRoleChange('admin')}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#2ECC71] bg-white dark:bg-[#1a2f24] border-gray-300 dark:border-gray-600 focus:ring-[#2ECC71] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label 
                  htmlFor="role-admin" 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Admin
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-content-creator"
                  name="role"
                  value="content-creator"
                  checked={selectedRole === 'content-creator'}
                  onChange={() => handleRoleChange('content-creator')}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#2ECC71] bg-white dark:bg-[#1a2f24] border-gray-300 dark:border-gray-600 focus:ring-[#2ECC71] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label 
                  htmlFor="role-content-creator" 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Content Creator
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="role-user"
                  name="role"
                  value="user"
                  checked={selectedRole === 'user'}
                  onChange={() => handleRoleChange('user')}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#2ECC71] bg-white dark:bg-[#1a2f24] border-gray-300 dark:border-gray-600 focus:ring-[#2ECC71] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label 
                  htmlFor="role-user" 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  User
                </label>
              </div>
            </div>
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#2ECC71] rounded focus:ring-2 focus:ring-[#2ECC71] disabled:opacity-50" 
                disabled={isLoading}
              />
              <span>Remember me</span>
            </label>
            <Link 
              to="/reset" 
              className="text-sm font-medium text-[#2ECC71] hover:text-[#1ea85a] transition disabled:opacity-50"
            >
              Forgot password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-6 rounded-xl bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-4 focus:ring-[#2ECC71]/50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        
        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#2ECC71] hover:text-[#1ea85a] transition"
          >
            Sign up here
          </Link>
        </div>

        {/* Backend Test Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={testBackendConnection}
            disabled={isLoading}
            className="text-xs text-gray-500 hover:text-[#2ECC71] transition disabled:opacity-50"
          >
            Test Backend Connection
          </button>
        </div>
      </div>
      
      {/* Bottom decorative wave */}
      <div
        className="absolute bottom-0 right-0 w-[320px] h-[170px] opacity-60"
        aria-hidden="true"
      >
        <svg width="100%" height="100%" viewBox="0 0 700 400" fill="none">
          <path d="M200,350 Q360,120 680,360 T700,400 H0 Z" fill="#2ECC71" opacity="0.13" />
        </svg>
      </div>
    </div>
  );
}