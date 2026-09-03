import React, { useState, useEffect } from "react";
import { FaLeaf, FaMedkit, FaUsers } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../api";

const ContentCreatorDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  useEffect(() => {
    let mounted = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const userId = user._id || user.id;

    if (userId && token) {
      fetch(`${API_URL}/herbs/my-herbs/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!mounted) return;
          const herbs = Array.isArray(data) ? data : (data.herbs || data.data || []);
          setStats({
            total: herbs.length,
            approved: herbs.filter((h) => h.status === 'approved').length,
            pending: herbs.filter((h) => h.status === 'pending' || h.status === undefined).length,
          });
        })
        .catch(() => {
          if (mounted) setStats({ total: 0, approved: 0, pending: 0 });
        });
    }
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-white dark:bg-[#0F1720] min-h-screen">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 dark:text-green-400 mb-6">
          {t('creator.welcome')} 🌿
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
          {t('creator.welcomeDesc')}
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-[#0B2B1A] dark:to-[#0a2e1a] p-6 sm:p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-900">
            <div className="text-4xl sm:text-5xl font-extrabold text-green-700 dark:text-green-400 mb-2">{stats.total}</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('creator.totalHerbsAdded')}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#0B1B2B] dark:to-[#0a1f30] p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-900">
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">{stats.approved}</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('creator.approved')}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-[#2B2310] dark:to-[#302010] p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-900">
            <div className="text-4xl sm:text-5xl font-extrabold text-amber-700 dark:text-amber-400 mb-2">{stats.pending}</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('creator.pendingApproval')}</div>
          </div>
        </div>

        {/* Icons and Graphics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 mb-12">
          <div className="flex flex-col items-center bg-white dark:bg-[#071519] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
            <FaLeaf size={50} className="text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('creator.herbManagement')}</h3>
            <p className="text-center text-gray-700 dark:text-gray-400">
              {t('creator.herbManagementDesc')}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white dark:bg-[#071519] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
            <FaMedkit size={50} className="text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('creator.holisticRemedies')}</h3>
            <p className="text-center text-gray-700 dark:text-gray-400">
              {t('creator.holisticRemediesDesc')}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white dark:bg-[#071519] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
            <FaUsers size={50} className="text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('creator.wellnessCommunity')}</h3>
            <p className="text-center text-gray-700 dark:text-gray-400">
              {t('creator.wellnessCommunityDesc')}
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center mb-12 h-64 sm:h-80 md:h-96">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV-V60P4f_c5jNgCpiIRubR2kjveE0rgmJ6A&s"
            alt="Herbal Healing"
            className="w-full md:w-3/4 rounded-lg shadow-lg"
          />
        </div>

        {/* More Engaging Section */}
        <div className="text-center mb-12">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
            {t('creator.readyToShare')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorDashboard;