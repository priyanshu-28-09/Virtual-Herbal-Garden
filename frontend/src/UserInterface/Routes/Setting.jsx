import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../api';

const Setting = () => {
  const { t } = useTranslation();
  const [activeSetting, setActiveSetting] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [formErrors, setFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    reenterPassword: '',
    email: '',
    emailPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSettingClick = (setting) => {
    setActiveSetting(setting === activeSetting ? null : setting);
    setServerError('');
  };

  const validatePassword = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = t('settings.currentPasswordRequired');
    if (!newPassword) errors.newPassword = t('settings.newPasswordRequired');
    if (newPassword && newPassword.length < 6) errors.newPassword = t('settings.newPasswordMin', { count: 6 });
    if (newPassword && !reenterPassword) errors.reenterPassword = t('settings.reenterRequired');
    if (newPassword !== reenterPassword) errors.reenterPassword = t('settings.passwordMismatch');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setServerError('');
    setIsLoading(true);
    setFormErrors({});
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || t('settings.failedChangePassword'));
        return;
      }
      setIsPasswordChanged(true);
      setCurrentPassword('');
      setNewPassword('');
      setReenterPassword('');
      alert(t('settings.passwordChanged'));
    } catch (error) {
      setServerError(error.message || t('settings.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.email = t('settings.emailRequired');
    } else if (!emailRegex.test(email)) {
      errors.email = t('settings.invalidEmail');
    }

    if (!emailPassword) {
      errors.emailPassword = t('settings.emailPasswordRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeEmail = async () => {
    if (!validateEmail()) return;
    setServerError('');
    setIsLoading(true);
    setFormErrors({});
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/change-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail: email, password: emailPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || t('settings.failedChangeEmail'));
        return;
      }
      setIsEmailChanged(true);
      setEmail('');
      setEmailPassword('');
      alert(t('settings.emailChanged'));
    } catch (error) {
      setServerError(error.message || t('settings.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePrivacy = () => {
    setPrivacy(!privacy);
  };

  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleTogglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-bold text-5xl bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">
            ⚙️ {t('settings.title')}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {t('settings.subtitle')}
          </p>
          <div className="mt-4 h-1 w-40 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Menu */}
          <div className="lg:col-span-1 bg-white dark:bg-[#0F1720] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 h-fit">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('settings.accountSettings')}</h3>
            <ul className="space-y-2">
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'changePassword' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('changePassword')}
              >
                🔐 {t('settings.changePassword')}
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'changeEmail' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('changeEmail')}
              >
                ✉️ {t('settings.changeEmail')}
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'managePrivacy' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('managePrivacy')}
              >
                🔒 {t('settings.managePrivacy')}
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'notifications' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('notifications')}>
                🔔 {t('settings.notifications')}
              </li>
            </ul>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F1720] p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            {activeSetting && serverError && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 font-semibold">
                ⚠️ {serverError}
              </div>
            )}

            {activeSetting === 'changePassword' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔐 {t('settings.changePassword')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('settings.currentPassword')}</label>
                    <input type="password" placeholder={t('settings.currentPasswordPlaceholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    {formErrors.currentPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('settings.newPassword')}</label>
                    <input type="password" placeholder={t('settings.newPasswordPlaceholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('settings.confirmNewPassword')}</label>
                    <input type="password" placeholder={t('settings.confirmNewPasswordPlaceholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)} />
                    {formErrors.reenterPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.reenterPassword}</p>}
                  </div>
                  <button onClick={handleChangePassword} disabled={isLoading} className="w-full mt-6 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? `⏳ ${t('settings.updating')}` : t('settings.updatePassword')}
                  </button>
                  {isPasswordChanged && <p className="text-green-500 text-sm mt-3 font-semibold">✓ {t('settings.passwordChanged')}</p>}
                </div>
              </div>
            )}

            {activeSetting === 'changeEmail' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">✉️ {t('settings.changeEmail')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('settings.newEmailAddress')}</label>
                    <input type="email" placeholder={t('settings.newEmailPlaceholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">✕ {formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('settings.passwordConfirmation')}</label>
                    <input type="password" placeholder={t('settings.passwordConfirmationPlaceholder')} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} />
                    {formErrors.emailPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.emailPassword}</p>}
                  </div>
                  <button onClick={handleChangeEmail} disabled={isLoading} className="w-full mt-6 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? `⏳ ${t('settings.updating')}` : t('settings.updateEmail')}
                  </button>
                  {isEmailChanged && <p className="text-green-500 text-sm mt-3 font-semibold">✓ {t('settings.emailChangedTo', { email })}</p>}
                </div>
              </div>
            )}

            {activeSetting === 'managePrivacy' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔒 {t('settings.privacySettings')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">{t('settings.profileVisibility')}</span>
                    <button onClick={handleTogglePrivacy} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${privacy ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {privacy ? `✓ ${t('settings.public')}` : `✕ ${t('settings.private')}`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === 'notifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔔 {t('settings.notifications')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">{t('settings.emailNotifications')}</span>
                    <button onClick={handleToggleEmailNotifications} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${emailNotifications ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {emailNotifications ? `✓ ${t('settings.enabled')}` : `✕ ${t('settings.disabled')}`}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">{t('settings.pushNotifications')}</span>
                    <button onClick={handleTogglePushNotifications} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${pushNotifications ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {pushNotifications ? `✓ ${t('settings.enabled')}` : `✕ ${t('settings.disabled')}`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!activeSetting && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('settings.selectSetting')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;