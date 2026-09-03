import React, { useState, useEffect } from "react";
import OverviewCard from "../components/OverviewCard";
import RecentActivityTable from "../components/RecentActivityTable";
import Navbar from "../components/Navigation";
import { useTranslation } from "react-i18next";
import API from "../../api";

const Dashboard = () => {
  const { t } = useTranslation();
  const [plant, setPlant] = useState([]);
  const [counts, setCounts] = useState({
    contentCreators: 0,
    users: 0,
    admins: 0,
});
  useEffect(() => {
    API
      .get(`/herbs`)
      .then((res) => setPlant(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch((err) => console.error("Error fetching plants:", err));
  }, []);

 

useEffect(() => {
    const fetchCounts = async () => {
        try {
            const response = await API.get(`/users/getCount`);
            setCounts(response.data);
        } catch (error) {
            console.error('Error fetching user counts:', error);
        }
    };

    fetchCounts();
}, []);
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-white to-[#E6FFF5] dark:from-[#0F1720] dark:to-[#0a1f15]">
      {/* <Navbar /> */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">{t('admin.subtitle')}</p>
      </div>
      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <OverviewCard title={t('admin.totalUsers')} value={counts.users} icon="👤" />
        <OverviewCard title={t('admin.totalHerbs')} value={plant.length} icon="🌿" />
        <OverviewCard title={t('admin.contentCreator')} value={counts.contentCreators} icon="📄" />
        {/* <OverviewCard title="Herb Categories" value="8" icon="📚" /> */}
      </div>

      {/* Recent Activities */}
      <div className="mb-6 bg-white dark:bg-[#0F1720] rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('admin.recentActivity')}</h2>
        <RecentActivityTable />
      </div>
    </div>
  );
};

export default Dashboard;
