import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "./Quiz";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { FaBookmark, FaLeaf, FaSearch } from "react-icons/fa";

const Home = ({ addBookmark }) => {
  const [plants, setPlants] = useState([]);
  const [notification, setNotification] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPlantOfTheDay, setShowPlantOfTheDay] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/herbs")
      .then((res) => setPlants(res.data))
      .catch((err) => console.error("Error fetching plants:", err));
  }, []);

  useEffect(() => {
    let timer;
    if (isNotificationVisible) {
      timer = setTimeout(() => setIsNotificationVisible(false), 5001);
    }
    return () => clearTimeout(timer);
  }, [isNotificationVisible]);

  const handleAddBookmark = async (plant) => {
    try {
      if (!user || !user._id) {
        setNotification("Please login to bookmark plants");
        setIsNotificationVisible(true);
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification("Please login to bookmark plants");
        setIsNotificationVisible(true);
        return;
      }

      console.log("Adding bookmark:", {
        userId: user._id,
        plantId: plant._id
      });

      const response = await axios.post(
        "http://localhost:5001/api/users/bookmark",
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

      console.log("Bookmark response:", response.data);
      setNotification(`${plant.name} has been bookmarked!`);
      setIsNotificationVisible(true);
    } catch (error) {
      console.error("Error adding bookmark:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response?.status === 401) {
        setNotification("Please login to bookmark plants");
      } else {
        setNotification(error.response?.data?.message || "Failed to bookmark the plant");
      }
      setIsNotificationVisible(true);
    }
  };

  const getPlantOfTheDay = () => {
    const dayOfWeek = new Date().getDay();
    return plants.length > 0 ? plants[dayOfWeek % plants.length] : null;
  };

  const plantOfTheDay = getPlantOfTheDay();

  const filteredPlants = plants.filter((plant) =>
    plant.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1720]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] py-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2ECC71]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Welcome to AYUSH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A]">Virtual Herbal Garden</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the healing power of nature's best remedies. Explore, learn, and bookmark your favorite medicinal plants.
          </p>
          <div className="flex justify-center gap-2">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#071519] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2ECC71] outline-none transition"
                placeholder="Search by herb name... 🌿"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-6 py-4 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold rounded-xl hover:scale-105 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-gray-50 dark:bg-[#071519]">
        <div className="container mx-auto lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Featured Medicinal Plants</h2>
              <p className="text-gray-600 dark:text-gray-400">Browse our collection and bookmark your favorites</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaLeaf className="text-[#2ECC71]" />
              <span className="font-semibold">{filteredPlants.length} Plants Available</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <div key={plant._id} className="group bg-white dark:bg-[#0F1720] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden h-56">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={plant.image}
                      alt={plant.name}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#2ECC71] text-white text-xs font-bold rounded-full">
                        Medicinal
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{plant.name}</h3>
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">{plant.scientificName}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{plant.description}</p>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold hover:scale-105 transition"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        Learn More
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg border-2 border-[#2ECC71] text-[#2ECC71] dark:text-[#58E07A] font-semibold hover:bg-[#2ECC71] hover:text-white transition"
                        onClick={() => handleAddBookmark(plant)}
                        title="Bookmark this plant"
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaLeaf className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No plants found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-gradient-to-tr from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="container mx-auto lg:px-12 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">🌟 Plant of the Day</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">Discover a special medicinal plant every day</p>
          <button
            className="px-8 py-3 rounded-xl bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold shadow-lg hover:scale-105 transition"
            onClick={() => setShowPlantOfTheDay(!showPlantOfTheDay)}
          >
            {showPlantOfTheDay ? "Hide" : "Show"} Plant of the Day
          </button>
          {showPlantOfTheDay && plantOfTheDay && (
            <div className="bg-white dark:bg-[#0F1720] rounded-3xl p-8 mt-8 shadow-2xl inline-block max-w-md mx-auto">
              <img
                src={plantOfTheDay.image}
                alt={plantOfTheDay.name}
                className="rounded-2xl w-full h-64 object-cover mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plantOfTheDay.name}</h3>
              <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-3">{plantOfTheDay.scientificName}</p>
              <p className="text-gray-600 dark:text-gray-400">{plantOfTheDay.description}</p>
              <button
                className="mt-4 px-6 py-2 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold rounded-lg hover:scale-105 transition"
                onClick={() => setSelectedPlant(plantOfTheDay)}
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="py-16 px-6 bg-white dark:bg-[#0F1720]">
        <div className="container mx-auto lg:px-12">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900 dark:text-white">🧠 Test Your Knowledge</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Take our herbal medicine quiz</p>
          <div className="max-w-4xl mx-auto">
            <Quiz />
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="container mx-auto lg:px-12">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-white">Why Choose Herbal Medicine?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Natural Healing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Harness the power of nature with time-tested remedies that have been used for thousands of years.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Scientifically Proven</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Modern research continues to validate the therapeutic benefits of traditional herbal medicine.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">Holistic Approach</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Treat the whole body, not just symptoms, with gentle and effective natural remedies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-[#0F1720] rounded-3xl p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={selectedPlant.image}
                alt={selectedPlant.name}
                className="w-48 h-48 object-cover rounded-2xl"
              />
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{selectedPlant.name}</h2>
                <p className="text-lg italic text-gray-500 dark:text-gray-400 mb-3">{selectedPlant.scientificName}</p>
                <span className="px-3 py-1 bg-[#2ECC71] text-white text-sm font-bold rounded-full">
                  Medicinal Herb
                </span>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Description</h3>
                <p>{selectedPlant.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Botanical Information</h3>
                <p>{selectedPlant.botanicalInfo}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Physical Description</h3>
                <p>{selectedPlant.physicalDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Habitat and Distribution</h3>
                <p>{selectedPlant.habitat}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Medicinal Method</h3>
                <p>{selectedPlant.medicinalMethod}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Conventional Composition</h3>
                <p>{selectedPlant.conventionalComposition}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Chemical Composition</h3>
                <p>{selectedPlant.chemicalComposition}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Pharmacological Effect</h3>
                <p>{selectedPlant.pharmacologicalEffect}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Clinical Studies and Research</h3>
                <p>{selectedPlant.clinicalStudies}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Safety and Precautions</h3>
                <p>{selectedPlant.safetyPrecautions}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Cultural and Historical Significance</h3>
                <p>{selectedPlant.culturalSignificance}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Success in Finding the Plant</h3>
                <p>{selectedPlant.plantSuccess}</p>
              </div>

              {selectedPlant.referenceLink && (
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Reference Link</h3>
                  <a 
                    href={selectedPlant.referenceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#2ECC71] hover:underline"
                  >
                    {selectedPlant.referenceLink}
                  </a>
                </div>
              )}
            </div>

            <button
              className="mt-6 w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              onClick={() => setSelectedPlant(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isNotificationVisible && (
        <div className="fixed bottom-5 right-5 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white py-3 px-6 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <FaBookmark />
          {notification}
        </div>
      )}
    </div>
  );
};

export default Home;