import React, { useState, useEffect } from "react";
import { FaCamera, FaEdit, FaRegSave } from "react-icons/fa";
import { useAuth } from "../../AuthContext";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "Tell us about yourself",
    email: "",
    phone: "",
    profilePicture: "https://via.placeholder.com/200",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/200");
  const { user } = useAuth();

  // Populate profile data when the user is available
  useEffect(() => {
    if (user) {
      setProfile({
        name:  user.username || "User",
        username: user.username || "",
        bio: user.bio || "Tell us about yourself",
        email: user.email || "",
        phone: user.phone || "12345",
        profilePicture: user.profilePicture || "https://via.placeholder.com/200",
      });
      setProfileImage(user.profilePicture || "https://via.placeholder.com/200");
    }
  }, [user]);

  // Handle input changes for profile data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle image change (profile picture)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Update profile image with the selected file
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  // Handle form submission for updating profile
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      profilePicture: profileImage, // Ensure profile image is updated
    });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] flex justify-center items-center p-4 overflow-auto">
      <div className="bg-white dark:bg-[#0F1720] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800">
        {/* Profile Header */}
        <div className="mb-12 text-center">
          <div className="relative mb-6 inline-block">
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-[#2ECC71] shadow-xl"
            />
            <button className="absolute bottom-2 right-2 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white p-3 rounded-full hover:shadow-lg transition-all duration-200">
              <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                <FaCamera className="w-5 h-5" />
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
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">{profile.name}</h2>
            <p className="text-lg text-[#2ECC71] mb-3 font-semibold">@{profile.username}</p>
            <p className="text-gray-700 dark:text-gray-300 italic text-sm">{profile.bio}</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing ? (
          <div className="text-left mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio:</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2"
                >
                  <FaRegSave />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.phone}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
