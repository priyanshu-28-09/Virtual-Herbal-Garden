import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
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

    // Redirect to login page
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 h-full w-64 bg-green-600 text-white p-6 z-40">
        <h1 className="text-lg font-bold mb-6 pt-4">Admin Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin/dashboard"
              className="block p-2 rounded hover:bg-green-700 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block p-2 rounded hover:bg-green-700 transition-colors"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-content"
              className="block p-2 rounded hover:bg-green-700 transition-colors"
            >
              Manage Content
            </Link>
          </li>
          {/* <li>
            <Link
              to="/admin/logs"
              className="block p-2 rounded hover:bg-green-700 transition-colors"
            >
              Logs
            </Link>
          </li> */}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto absolute bottom-6 left-6 right-6">
          <button
            className="w-full px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600 transition-colors font-semibold"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </nav>

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

export default Navigation;