import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Quiz from "./Quiz";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { API_URL, SERVER_URL, normalizeApiResponse } from "../../api";
import { FaBookmark, FaLeaf, FaSearch } from "react-icons/fa";

const Home = ({ addBookmark }) => {
  const { t } = useTranslation();
  const [plants, setPlants] = useState([]);
  const [notification, setNotification] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPlantOfTheDay, setShowPlantOfTheDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchReviews = async (herbId) => {
    if (!herbId) return;
    try {
      const res = await axios.get(`${API_URL}/reviews/${herbId}`);
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (selectedPlant?._id) {
      setReviewMessage("");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews(selectedPlant._id);
    }
  }, [selectedPlant]);

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewMessage(t('home.pleaseLoginReview'));
      return;
    }
    if (!newReview.comment.trim()) {
      setReviewMessage(t('home.pleaseWriteReview'));
      return;
    }
    setIsSubmittingReview(true);
    setReviewMessage("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/reviews`,
        { herbId: selectedPlant._id, rating: newReview.rating, comment: newReview.comment.trim() },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.data?.newReview) {
        const added = { ...res.data.newReview, userId: { username: user.username, email: user.email } };
        setReviews((prev) => [added, ...prev]);
      }
      setNewReview({ rating: 5, comment: "" });
      setReviewMessage(`✓ ${t('home.reviewSuccess')}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewMessage(error.response?.data?.message || t('home.reviewFailed'));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(n)}
          className={`text-2xl ${onChange ? 'cursor-pointer' : 'cursor-default'} ${n <= value ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const params = { page, limit: 9 };
        if (searchTerm.trim()) params.q = searchTerm.trim();
        if (selectedCategory) params.category = selectedCategory;
        const res = await axios.get(`${API_URL}/herbs`, { params });
        const data = normalizeApiResponse(res);
        if (mounted) {
          setPlants(data);
          setTotalPages(res.data?.pagination?.totalPages || 0);
          setTotal(res.data?.pagination?.total ?? data.length);
          if (!data.length) {
            setErrorMessage(t('home.noResults'));
          }
        }
      } catch (err) {
        console.error('Error fetching plants:', err);
        if (mounted) {
          setErrorMessage(t('home.backendUnavailable'));
          setPlants([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory, page]);

  // Fetch available categories for the filter chips
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_URL}/herbs/categories`)
      .then((res) => {
        if (mounted) setCategories(res.data?.categories || []);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });
    return () => { mounted = false; };
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
        setNotification(t('home.bookmarkLogin'));
        setIsNotificationVisible(true);
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification(t('home.bookmarkLogin'));
        setIsNotificationVisible(true);
        return;
      }

      const response = await axios.post(
        `${API_URL}/users/bookmark`,
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

      setNotification(t('home.bookmarkAdd', { name: plant.name }));
      setIsNotificationVisible(true);
    } catch (error) {
      console.error("Error adding bookmark:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response?.status === 401) {
        setNotification(t('home.bookmarkLogin'));
      } else {
        setNotification(error.response?.data?.message || t('home.bookmarkFailed'));
      }
      setIsNotificationVisible(true);
    }
  };

  const getPlantOfTheDay = () => {
    const dayOfWeek = new Date().getDay();
    return plants.length > 0 ? plants[dayOfWeek % plants.length] : null;
  };

  const plantOfTheDay = getPlantOfTheDay();

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat === selectedCategory ? "" : cat);
    setPage(1);
  };

  const getImageSource = (image) => {
    if (!image) return 'https://via.placeholder.com/800x600?text=Herb+Image';
    return image.startsWith('/') ? `${SERVER_URL}${image}` : image;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1720]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] py-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2ECC71]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('home.welcomeTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ECC71] to-[#58E07A]">{t('home.welcomeTitle2')}</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('home.welcomeSubtitle')}
          </p>
          <div className="flex justify-center gap-2">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#071519] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2ECC71] outline-none transition"
                placeholder={`${t('home.searchPlaceholder')} 🌿`}
                value={searchTerm}
                onChange={handleSearchInput}
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className="px-6 py-4 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold rounded-xl hover:scale-105 transition"
            >
              {t('common.search')}
            </button>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => handleSelectCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${selectedCategory === "" ? 'bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white border-transparent' : 'bg-white dark:bg-[#071519] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#2ECC71]'}`}
              >
                {t('home.categoryChipAll')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${selectedCategory === cat ? 'bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white border-transparent' : 'bg-white dark:bg-[#071519] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#2ECC71]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="py-16 px-6 bg-gray-50 dark:bg-[#071519]">
        <div className="container mx-auto lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('home.featuredTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('home.featuredSubtitle')}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaLeaf className="text-[#2ECC71]" />
              <span className="font-semibold">{t('home.plantsAvailable', { count: total })}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-[#2ECC71] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.loadHerbs')}</p>
            </div>
          ) : (
          <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plants.length > 0 ? (
              plants.map((plant) => (
                <div key={plant._id} className="group bg-white dark:bg-[#0F1720] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="relative overflow-hidden h-56">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={getImageSource(plant.image)}
                      alt={plant.name}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#2ECC71] text-white text-xs font-bold rounded-full">
                        {t('home.medicinalBadge')}
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
                        {t('common.learnMore')}
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
                <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.noResults')}</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-5 py-2 rounded-xl border-2 border-[#2ECC71] text-[#2ECC71] dark:text-[#58E07A] font-semibold hover:bg-[#2ECC71] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← {t('home.previous')}
              </button>
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                {t('home.pageOf', { current: page, total: totalPages })}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-5 py-2 rounded-xl border-2 border-[#2ECC71] text-[#2ECC71] dark:text-[#58E07A] font-semibold hover:bg-[#2ECC71] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('home.next')} →
              </button>
            </div>
          )}
          </>
          )}
        </div>
      </div>

      <div className="py-16 px-6 bg-gradient-to-tr from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="container mx-auto lg:px-12 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">🌟 {t('home.plantOfDayTitle')}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">{t('home.plantOfDaySubtitle')}</p>
          <button
            className="px-8 py-3 rounded-xl bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold shadow-lg hover:scale-105 transition"
            onClick={() => setShowPlantOfTheDay(!showPlantOfTheDay)}
          >
            {showPlantOfTheDay ? t('home.hide') : t('home.show')} {t('home.plantOfDayTitle')}
          </button>
          {showPlantOfTheDay && plantOfTheDay && (
            <div className="bg-white dark:bg-[#0F1720] rounded-3xl p-8 mt-8 shadow-2xl inline-block max-w-md mx-auto">
              <img
                src={getImageSource(plantOfTheDay.image)}
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
                {t('common.learnMore')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="py-16 px-6 bg-white dark:bg-[#0F1720]">
        <div className="container mx-auto lg:px-12">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900 dark:text-white">🧠 {t('home.quizTitle')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">{t('home.quizSubtitle')}</p>
          <div className="max-w-4xl mx-auto">
            <Quiz />
          </div>
        </div>
      </div>

      <div className="py-16 px-6 bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726]">
        <div className="container mx-auto lg:px-12">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-white">{t('home.whyHerbalTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">{t('home.whyNatural')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('home.whyNaturalDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">{t('home.whyEq')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('home.whyEqDesc')}
              </p>
            </div>

            <div className="bg-white dark:bg-[#0F1720] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-white">{t('home.whyHolistic')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('home.whyHolisticDesc')}
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
                src={getImageSource(selectedPlant.image)}
                alt={selectedPlant.name}
                className="w-48 h-48 object-cover rounded-2xl"
              />
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{selectedPlant.name}</h2>
                <p className="text-lg italic text-gray-500 dark:text-gray-400 mb-3">{selectedPlant.scientificName}</p>
                <span className="px-3 py-1 bg-[#2ECC71] text-white text-sm font-bold rounded-full">
                  {t('home.medicinalBadge')}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalDescription')}</h3>
                <p>{selectedPlant.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalBotanical')}</h3>
                <p>{selectedPlant.botanicalInfo}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalPhysical')}</h3>
                <p>{selectedPlant.physicalDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalHabitat')}</h3>
                <p>{selectedPlant.habitat}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalMedicinal')}</h3>
                <p>{selectedPlant.medicinalMethod}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalConventional')}</h3>
                <p>{selectedPlant.conventionalComposition}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalChemical')}</h3>
                <p>{selectedPlant.chemicalComposition}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalPharmacological')}</h3>
                <p>{selectedPlant.pharmacologicalEffect}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalClinical')}</h3>
                <p>{selectedPlant.clinicalStudies}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalSafety')}</h3>
                <p>{selectedPlant.safetyPrecautions}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalCultural')}</h3>
                <p>{selectedPlant.culturalSignificance}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalSuccess')}</h3>
                <p>{selectedPlant.plantSuccess}</p>
              </div>

              {selectedPlant.referenceLink && (
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.modalReference')}</h3>
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

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">⭐ {t('home.reviewsTitle')}</h3>
                {reviews.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('home.reviewsCount', { count: reviews.length })}</span>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">{t('home.noReviews')}</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.userId?.username || "Anonymous"}</p>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 bg-white dark:bg-[#0F1720] border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('home.leaveReview')}</h4>
                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('home.yourRating')}</p>
                  <StarRating value={newReview.rating} onChange={(n) => setNewReview((prev) => ({ ...prev, rating: n }))} />
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder={t('home.reviewPlaceholder')}
                  rows="3"
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71] text-sm"
                />
                {reviewMessage && (
                  <p className={`mt-2 text-sm font-semibold ${reviewMessage.startsWith('✓') ? 'text-green-500' : (reviewMessage.startsWith('Please') ? 'text-amber-500' : 'text-red-500')}`}>
                    {reviewMessage}
                  </p>
                )}
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="mt-3 px-6 py-2 bg-gradient-to-tr from-[#2ECC71] to-[#87E08A] text-white font-semibold rounded-lg hover:scale-105 transition disabled:opacity-50"
                >
                  {isSubmittingReview ? t('home.submittingReview') : t('home.submitReview')}
                </button>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              onClick={() => setSelectedPlant(null)}
            >
              {t('common.close')}
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