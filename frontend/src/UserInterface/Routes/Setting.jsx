import React, { useState } from 'react';

const Setting = () => {
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

  const handleSettingClick = (setting) => {
    setActiveSetting(setting === activeSetting ? null : setting);
  };

  const validatePassword = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (!newPassword) errors.newPassword = 'New password is required.';
    if (newPassword && !reenterPassword) errors.reenterPassword = 'Please re-enter the new password.';
    if (newPassword !== reenterPassword) errors.reenterPassword = 'Passwords do not match.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = () => {
    if (validatePassword()) {
      setIsPasswordChanged(true);
      alert('Password changed successfully!');
    }
  };

  const validateEmail = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format.';
    }

    if (!emailPassword) {
      errors.emailPassword = 'Email password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeEmail = () => {
    if (validateEmail()) {
      setIsEmailChanged(true);
      alert(`Email changed to: ${email}`);
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
            ⚙️ Settings
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Manage your account and preferences
          </p>
          <div className="mt-4 h-1 w-40 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Menu */}
          <div className="lg:col-span-1 bg-white dark:bg-[#0F1720] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 h-fit">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h3>
            <ul className="space-y-2">
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'changePassword' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('changePassword')}
              >
                🔐 Change Password
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'changeEmail' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('changeEmail')}
              >
                ✉️ Change Email
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'managePrivacy' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('managePrivacy')}
              >
                🔒 Privacy
              </li>
              <li 
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 font-semibold ${activeSetting === 'notifications' ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
                onClick={() => handleSettingClick('notifications')}>
                🔔 Notifications
              </li>
            </ul>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F1720] p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            {activeSetting === 'changePassword' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔐 Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    {formErrors.currentPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.currentPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" placeholder="Re-enter new password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)} />
                    {formErrors.reenterPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.reenterPassword}</p>}
                  </div>
                  <button onClick={handleChangePassword} className="w-full mt-6 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                    Update Password
                  </button>
                  {isPasswordChanged && <p className="text-green-500 text-sm mt-3 font-semibold">✓ Password changed successfully!</p>}
                </div>
              </div>
            )}

            {activeSetting === 'changeEmail' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">✉️ Change Email</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Email Address</label>
                    <input type="email" placeholder="Enter new email" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">✕ {formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password Confirmation</label>
                    <input type="password" placeholder="Enter your password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} />
                    {formErrors.emailPassword && <p className="text-red-500 text-sm mt-1">✕ {formErrors.emailPassword}</p>}
                  </div>
                  <button onClick={handleChangeEmail} className="w-full mt-6 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                    Update Email
                  </button>
                  {isEmailChanged && <p className="text-green-500 text-sm mt-3 font-semibold">✓ Email changed successfully to: {email}</p>}
                </div>
              </div>
            )}

            {activeSetting === 'managePrivacy' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔒 Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">Profile Visibility</span>
                    <button onClick={handleTogglePrivacy} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${privacy ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {privacy ? '✓ Public' : '✕ Private'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === 'notifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔔 Notifications</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">Email Notifications</span>
                    <button onClick={handleToggleEmailNotifications} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${emailNotifications ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {emailNotifications ? '✓ Enabled' : '✕ Disabled'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">Push Notifications</span>
                    <button onClick={handleTogglePushNotifications} className={`py-2 px-6 font-semibold rounded-lg transition-all duration-200 ${pushNotifications ? 'bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {pushNotifications ? '✓ Enabled' : '✕ Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!activeSetting && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Select a setting from the left to manage your account
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