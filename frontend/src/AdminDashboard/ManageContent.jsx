import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "../api";

const ManageContent = () => {
  const { t } = useTranslation();
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    color: "",
    visible: false,
  });

  useEffect(() => {
    fetchHerbs();
  }, []);

  const fetchHerbs = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/herbs`);
      setHerbs(Array.isArray(response.data) ? response.data : (response.data?.data || []));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching herbs:", error);
      showNotification(t('admin.failedToFetchHerbs'), "bg-red-600");
      setLoading(false);
    }
  };

  // Function to show notification
  const showNotification = (message, color) => {
    setNotification({ message, color, visible: true });

    setTimeout(() => {
      setNotification({ message: "", color: "", visible: false });
    }, 5001);
  };

  // Delete herb function
  const handleDeleteHerb = async (id) => {
    const herb = herbs.find((h) => h._id === id);
    if (herb) {
      if (window.confirm(t('admin.confirmDeleteHerb', { name: herb.name }))) {
        try {
          await API.delete(`/herbs/${id}`);
          setHerbs((prevHerbs) => prevHerbs.filter((h) => h._id !== id));
          showNotification(t('admin.herbDeleted', { name: herb.name }), "bg-red-600");
        } catch (error) {
          console.error("Error deleting herb:", error);
          showNotification(t('admin.failedToDeleteHerb'), "bg-red-600");
        }
      }
    }
  };

  // Toggle herb visibility/status
  const handleToggleStatus = async (id) => {
    const herb = herbs.find((h) => h._id === id);
    if (herb) {
      try {
        const newStatus = !herb.isActive;
        await API.put(`/herbs/status/${id}`, {
          isActive: newStatus
        });
        
        setHerbs((prevHerbs) =>
          prevHerbs.map((h) =>
            h._id === id ? { ...h, isActive: newStatus } : h
          )
        );
        showNotification(
          t(newStatus ? 'admin.herbActivated' : 'admin.herbDeactivated', { name: herb.name }),
          newStatus ? "bg-green-600" : "bg-yellow-600"
        );
      } catch (error) {
        console.error("Error updating herb status:", error);
        showNotification(t('admin.failedToUpdateStatus'), "bg-red-600");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('admin.manageContentTitle')}</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-400">{t('admin.loadingHerbs')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 relative">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('admin.manageContentTitle')}</h2>

      {/* Notification */}
      {notification.visible && (
        <div
          className={`fixed top-6 right-6 z-50 ${notification.color} text-white p-4 rounded-md shadow-lg transition-all duration-300`}
          style={{ minWidth: "250px" }}
        >
          {notification.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full bg-white dark:bg-[#0F1720] overflow-hidden">
          <thead className="bg-gray-200 dark:bg-[#071519]">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.image')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.name')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.scientificName')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.category')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.uses')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.status')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {herbs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                  {t('admin.noHerbs')}
                </td>
              </tr>
            ) : (
              herbs.map((herb) => (
                <tr key={herb._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#071519] text-gray-800 dark:text-gray-200">
                  <td className="py-3 px-4">
                    {herb.image ? (
                      <img
                        src={herb.image}
                        alt={herb.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
                        {t('admin.noImage')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{herb.name}</td>
                  <td className="py-3 px-4 text-sm italic text-gray-600 dark:text-gray-400">
                    {herb.scientificName || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {herb.category || 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {herb.uses ? (
                      <div className="max-w-xs truncate" title={herb.uses}>
                        {herb.uses}
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        herb.isActive !== false
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {herb.isActive !== false ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleStatus(herb._id)}
                        className={`${
                          herb.isActive !== false
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white px-3 py-1 rounded text-sm transition`}
                      >
                        {herb.isActive !== false ? t('admin.deactivate') : t('admin.activate')}
                      </button>
                      <button
                        onClick={() => handleDeleteHerb(herb._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageContent;