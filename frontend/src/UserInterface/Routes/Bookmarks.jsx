import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { FaHeart, FaLeaf } from "react-icons/fa";

const Bookmarks = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState("");
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("User:", user);
  console.log("User bookmarks:", user?.bookmarks);

  // Fetch bookmarks on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        
        // ✅ FIX 1: Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!user || !user.bookmarks || user.bookmarks.length === 0) {
          console.log("No bookmarks found for user");
          setBookmarkedPlants([]);
          setLoading(false);
          return;
        }

        console.log("Fetching bookmarks for IDs:", user.bookmarks);

        // ✅ FIX 2: Correct API endpoint - should be /api/herbs not /api/herbb
        const response = await axios.get("http://localhost:5000/api/herbs/bookmarks", {
          params: { ids: user.bookmarks.join(',') },
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Fetched bookmarked plants:", response.data);
        setBookmarkedPlants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookmarked plants:", error);
        console.error("Error details:", error.response?.data);
        setLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  // Remove a bookmark
  const handleRemoveBookmark = async (event, plant) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      console.log("Removing bookmark:", {
        userId: user._id,
        plantId: plant._id
      });

      // ✅ FIX 3: Correct endpoint spelling - romovebookmark -> removebookmark
      const response = await axios.post(
        "http://localhost:5000/api/users/removebookmark",
        {
          userId: user._id,
          plantId: plant._id
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Remove response:", response.data);

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
        setNotification(`${plant.name} has been removed from your bookmarks!`);
        setTimeout(() => setNotification(""), 3000);
      } else {
        console.error("Failed to remove bookmark:", response.data.message);
        setNotification("Failed to remove bookmark");
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      console.error("Error details:", error.response?.data);
      setNotification("Failed to remove bookmark");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2ECC71] mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-xl">Loading your bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="font-bold text-5xl bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">
          🌿 Your Bookmarked Plants
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Your favorite medicinal herbs collection
        </p>
        {bookmarkedPlants.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {bookmarkedPlants.length} plant{bookmarkedPlants.length !== 1 ? 's' : ''} bookmarked
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
                    <span>Remove from Bookmarks</span>
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
              No bookmarks found
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore plants and bookmark your favorites!
            </p>
            <button
              onClick={() => window.location.href = '/home'}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white rounded-xl font-semibold hover:scale-105 transition"
            >
              Explore Plants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;