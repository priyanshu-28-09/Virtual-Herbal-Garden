import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../../AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call logout from context
    if (logout) {
      logout();
    }
    
    // Redirect to login
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className={`flex justify-between items-center px-6 md:px-20 py-4 transition-all duration-300 ease-in-out bg-emerald-600 shadow-lg rounded-md sticky top-0 z-50`}>
        <div className="text-white text-2xl font-medium font-serif">
          <h1>AYUSH Virtual</h1>
          <h1>Herbal Garden</h1>
        </div>

        <div className="md:hidden">
          <button className="text-white text-3xl focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
    
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex items-center space-y-6 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[#252725] md:bg-transparent z-10 p-4 md:p-0 ml-[500px]`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 text-white">
            <Link to="/home"><li className="rounded-full bg-gray-900 bg-opacity-40 px-4 py-2 cursor-pointer">Home</li></Link>
            <Link to="/home/about"><li className="rounded-full bg-gray-900 bg-opacity-40 px-4 py-2 cursor-pointer">About</li></Link>
            <Link to="/home/virtualTour"><li className="rounded-full bg-gray-900 bg-opacity-40 px-4 py-2 cursor-pointer">Virtual Tour</li></Link>
          </ul>
        </div>

        <div className="flex items-center space-x-14">
          {isAuthenticated && (
            <button 
              className="bg-red-600 py-2 px-4 rounded-full bg-opacity-100 hover:bg-red-700 transition-colors font-semibold" 
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          )}

          <div className="relative">
            <button
              className="text-white text-3xl focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <FaUserCircle />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                <Link to="/home/bookmarks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out">
                  Bookmarks
                </Link>
                <Link to="/home/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out">
                  Profile
                </Link>
                <Link to="/home/setting" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out">
                  Settings
                </Link>
              </div>
            )}
          </div>
        </div>
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

export default Navbar;