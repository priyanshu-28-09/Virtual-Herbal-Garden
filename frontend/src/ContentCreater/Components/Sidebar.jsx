import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);

    // Clear authentication tokens and user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login page
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="sidebar fixed w-64 bg-emerald-600 text-white h-screen flex flex-col p-5 font-bold">
        {/* Title */}
        <h2 className="text-xl mb-6">Content Creator</h2>
        
        {/* Navigation Links */}
        <nav className="flex flex-col gap-6">
          <NavLink
            to="/content-creator/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-green-200 underline"
                : "text-white hover:text-green-300"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/content-creator/add-herb"
            className={({ isActive }) =>
              isActive
                ? "text-green-200 underline"
                : "text-white hover:text-green-300"
            }
          >
            Add Herb
          </NavLink>
          <NavLink
            to="/content-creator/my-herbs"
            className={({ isActive }) =>
              isActive
                ? "text-green-200 underline"
                : "text-white hover:text-green-300"
            }
          >
            My Herbs
          </NavLink>
          <NavLink
            to="/content-creator/profile"
            className={({ isActive }) =>
              isActive
                ? "text-green-200 underline"
                : "text-white hover:text-green-300"
            }
          >
            Profile
          </NavLink>
          
          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="bg-red-600 text-white py-2 mt-4 rounded-md hover:bg-red-700 w-full transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to logout from your account?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </span>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;