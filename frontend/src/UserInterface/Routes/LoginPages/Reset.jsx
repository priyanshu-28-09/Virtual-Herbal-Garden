import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../api';
import LanguageSwitcher from '../../../LanguageSwitcher';

function Reset() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('reset.messageFailedDefault') });
        return;
      }
      setMessage({ type: 'success', text: data.message || t('reset.messageSent') });
    } catch (error) {
      setMessage({ type: 'error', text: t('reset.networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher variant="inverse" />
      </div>
      {/* Background lines pattern */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 800 600"
        >
          {/* You can add a background pattern here */}
        </svg>
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-white text-2xl font-bold text-center mb-6">{t('auth.resetTitle')}</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative mb-6">
            <input
              type="email"
              placeholder={t('auth.resetEmailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-b border-white/50 bg-transparent text-white focus:outline-none focus:border-yellow-300 placeholder-gray-200"
            />
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded-md text-center text-sm font-semibold ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {message.text}
            </div>
          )}
          {/* Reset Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-md font-semibold transition duration-300 disabled:opacity-50"
          >
            {isLoading ? t('auth.resetSending') : t('auth.resetButton')}
          </button>
        </form>
        {/* Remember password link */}
        <div className="text-center mt-6 text-white">
          {t('auth.rememberPassword')}{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">
            {t('auth.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reset;
