import React, { useState, useEffect } from "react";
import { FaCamera, FaEdit, FaRegSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../api";

const Profile = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    phone: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setProfile({
          name: parsed.username || "",
          username: parsed.username || "",
          bio: parsed.bio || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          profilePicture: parsed.profilePicture || "",
        });
        setProfileImage(parsed.profilePicture || null);
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          bio: profile.bio,
          phone: profile.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || t('profile.failedToUpdate') });
        return;
      }
      const updatedUser = data.user;
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUser = {
        ...storedUser,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      setProfile((prev) => ({
        ...prev,
        name: updatedUser.username,
        username: updatedUser.username,
        bio: updatedUser.bio || prev.bio,
        phone: updatedUser.phone || prev.phone,
        email: updatedUser.email || prev.email,
        profilePicture: profileImage || prev.profilePicture,
      }));
      setIsEditing(false);
      setMessage({ type: 'success', text: t('profile.profileUpdated') });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || t('profile.networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] p-4 overflow-auto">
      <div className="bg-white dark:bg-[#0F1720] p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto transition-all border border-gray-200 dark:border-gray-800">
        <div className="mb-8 text-center">
          <div className="relative mb-4">
            <img
              src={profileImage || profile.profilePicture || "https://via.placeholder.com/200"}
              alt="Profile"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#2ECC71]"
            />
            <button className="absolute bottom-3 right-3 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white px-3 py-2 rounded-lg flex items-center hover:shadow-lg transition-all hover:scale-105">
              <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                <FaCamera className="mr-2" />
                {t('profile.change')}
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleImageChange}
              />
            </button>
          </div>
          <div>
            {isEditing ? (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">{t('profile.editProfile')}</h2>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{profile.name || t('profile.yourName')}</h2>
            )}
            <p className="text-sm text-[#2ECC71] font-semibold mb-4">@{profile.username || t('profile.username')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-6">{profile.bio || t('profile.bioPlaceholder')}</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border font-semibold ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300'}`}>
            {message.type === 'success' ? '✓ ' : '⚠️ '}{message.text}
          </div>
        )}

        {isEditing ? (
          <div className="text-left mt-8">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-4">{t('profile.editTitle')}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('profile.name')}:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] transition-all"
                  placeholder={t('profile.namePlaceholder')}
                />
              </div>
             <div>
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
    {t('profile.username')}:
  </label>

  <input
    type="text"
    name="username"
    value={profile.username}
    onChange={handleInputChange}
    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
    placeholder={t('profile.usernamePlaceholder')}
  />
</div>
              <label className="block text-sm text-gray-600 mb-2">{t('profile.bio')}:</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full p-3 mb-4 border rounded-lg border-gray-300 text-lg"
                placeholder={t('profile.bioPlaceholder')}
              />
              <label className="block text-sm text-gray-600 mb-2">{t('profile.email')}:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full p-3 mb-4 border rounded-lg border-gray-300 text-lg"
                placeholder={t('profile.emailPlaceholder')}
              />
              <label className="block text-sm text-gray-600 mb-2">{t('profile.phoneLabel')}:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="w-full p-3 mb-6 border rounded-lg border-gray-300 text-lg"
                placeholder={t('profile.phonePlaceholder')}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-md flex justify-center items-center disabled:opacity-50"
              >
                {isLoading ? t('profile.saving') : t('profile.saveChanges')}
                <FaRegSave className="ml-2" />
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-lg text-gray-800">{t('profile.email')}: {profile.email || t('profile.notProvided')}</p>
            <p className="text-lg text-gray-800">{t('profile.phoneLabel')}: {profile.phone || t('profile.notProvided')}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-yellow-500 text-white py-3 px-6 rounded-md flex items-center justify-center"
            >
              <FaEdit className="mr-2" />
              {t('profile.editProfile')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
