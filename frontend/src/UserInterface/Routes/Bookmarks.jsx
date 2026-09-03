import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, normalizeApiResponse } from "../../api";
import { useAuth } from "../../AuthContext";
import { FaHeart, FaLeaf } from "react-icons/fa";

const Bookmarks = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notification, setNotification] = useState("");
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        
        // ✅ Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setBookmarkedPlants([]);
          setLoading(false);
          return;
        }

        // Step 1: Get bookmark IDs
        const bookmarkResponse = await axios.get(`${API_URL}/users/getbookmark`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const bookmarkIds = Array.isArray(bookmarkResponse.data) ? bookmarkResponse.data : [];

        if (bookmarkIds.length === 0) {
          setBookmarkedPlants([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch all herbs
        const herbsResponse = await axios.get(`${API_URL}/herbs`);
        const allHerbs = normalizeApiResponse(herbsResponse);
        
        // Step 3: Filter herbs by bookmark IDs
        const bookmarkedHerbs = allHerbs.filter(herb => 
          bookmarkIds.includes(herb._id)
        );

        setBookmarkedPlants(bookmarkedHerbs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarked plants:", error);
        console.error("Error details:", error.response?.data);
        setBookmarkedPlants([]);
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchBookmarks();
    }
  }, [user]);

  // Remove a bookmark
  const handleRemoveBookmark = async (event, plant) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/users/removebookmark`,
        {
          plantId: plant._id
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setBookmarkedPlants((prevPlants) =>
          prevPlants.filter((item) => item._id !== plant._id)
        );

        // Update user's bookmarks in context (if possible)
        if (user && user.bookmarks) {
          user.bookmarks = user.bookmarks.filter(id => id !== plant._id);
        }

        // Show notification
        setNotification(t('bookmarks.removed', { name: plant.name }));
        setTimeout(() => setNotification(""), 3000);
      } else {
        console.error("Failed to remove bookmark:", response.data.message);
        setNotification(t('bookmarks.removeFailed'));
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      console.error("Error details:", error.response?.data);
      setNotification(t('bookmarks.removeFailed'));
      setTimeout(() => setNotification(""), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2ECC71] mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-xl">{t('bookmarks.loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="font-bold text-5xl bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">
          🌿 {t('bookmarks.title')}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {t('bookmarks.subtitle')}
        </p>
        {bookmarkedPlants.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('bookmarks.count', { count: bookmarkedPlants.length })}
          </p>
        )}
        <div className="mt-4 h-1 w-40 bg-gradient-to-r from-[#2ECC71] to-[#87E08A] rounded-full mx-auto"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white p-4 rounded-xl shadow-lg animate-in fade-in slide-in-from-top duration-300 w-[300px] max-w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Bookmark Cards */}
      <div className="flex-grow py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {bookmarkedPlants && bookmarkedPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedPlants.map((plant) => (
              <div
                key={plant._id}
                className="h-full bg-white dark:bg-[#0F1720] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    className="w-full h-56 object-cover"
                    src={plant.image}
                    alt={plant.name}
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white p-2 rounded-full">
                      <FaHeart />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                    {plant.name}
                  </h3>
                  <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">
                    {plant.scientificName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {plant.description}
                  </p>

                  {/* Remove Bookmark Button */}
                  <button
                    className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    onClick={(event) => handleRemoveBookmark(event, plant)}
                  >
                    <span>✕</span>
                    <span>{t('bookmarks.remove')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="text-8xl mb-6">
              <FaLeaf className="text-gray-300 dark:text-gray-700 mx-auto" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-2xl font-semibold mb-2">
              {t('bookmarks.empty')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('bookmarks.emptyDesc')}
            </p>
            <button
              onClick={() => window.location.href = '/home'}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white rounded-xl font-semibold hover:scale-105 transition"
            >
              {t('bookmarks.exploreCta')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;