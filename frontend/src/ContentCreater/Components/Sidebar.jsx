import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../LanguageSwitcher";

const Sidebar = ({ isOpen, onToggle, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-white/20 text-white border-l-4 border-white"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#2ECC71] text-white p-2 rounded-lg shadow-lg hover:bg-[#1ea85a] transition-colors"
        aria-label="Toggle navigation menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 w-64 bg-gradient-to-b from-[#2ECC71] to-[#1ea85a] dark:from-[#0a2e1a] dark:to-[#071c10] text-white h-screen flex flex-col p-6 font-semibold z-40 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-8 text-white drop-shadow-md">{t('common.contentCreatorTitle')}</h2>
        
        <nav className="flex flex-col gap-3 flex-grow">
          <NavLink to="/content-creator/dashboard" className={linkClass} onClick={onClose}>
            {t('nav.dashboard')}
          </NavLink>
          <NavLink to="/content-creator/add-herb" className={linkClass} onClick={onClose}>
            {t('nav.addHerb')}
          </NavLink>
          <NavLink to="/content-creator/my-herbs" className={linkClass} onClick={onClose}>
            {t('nav.myHerbs')}
          </NavLink>
          <NavLink to="/content-creator/profile" className={linkClass} onClick={onClose}>
            {t('nav.profile')}
          </NavLink>
          
          <div className="mt-auto">
            <div className="flex justify-center mb-3">
              <LanguageSwitcher variant="inverse" />
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500/90 text-white py-3 rounded-lg hover:bg-red-600 hover:shadow-lg w-full transition-all font-semibold"
            >
              {t('common.logout')}
            </button>
          </div>
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
              {t('common.confirmLogout')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {t('common.logoutConfirmMsg')}
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
                    {t('common.loggingOut')}
                  </span>
                ) : (
                  t('common.logout')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
