import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "../../api";

const Users = () => {
  const { t } = useTranslation();
  // Notification state
  const [notification, setNotification] = useState({
    message: "",
    color: "",
    visible: false,
  });

  const [usersAndCreators, setUsersAndCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsersAndCreators();
  }, []);

  const fetchUsersAndCreators = async () => {
    try {
      setLoading(true);
      
      // ✅ ADDED: Token auto-attached by API interceptor
      const response = await API.get(`/users/userData`);
      
      const data = response.data;
      
      // ✅ ADDED: Validate that data is an array
      if (Array.isArray(data)) {
        setUsersAndCreators(data);
      } else {
        console.error('Expected array but got:', typeof data);
        setUsersAndCreators([]);
        showNotification(t('admin.invalidDataFormat'), "bg-red-600");
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users and content creators:', error);
      showNotification(
        error.response?.data?.message || t('admin.failedToFetchUsers'), 
        "bg-red-600"
      );
      setUsersAndCreators([]); // ✅ ADDED: Set empty array on error
      setLoading(false);
    }
  };

  // Function to show notification
  const showNotification = (message, color) => {
    setNotification({ message, color, visible: true });

    // Hide the notification after 5 seconds
    setTimeout(() => {
      setNotification({ message: "", color: "", visible: false });
    }, 5001);
  };

  // Block user function - ENHANCED
  const handleBlockUser = async (id) => {
    const user = usersAndCreators.find((u) => u._id === id);
    
    if (!user) {
      showNotification(t('admin.userNotFound'), "bg-red-600");
      return;
    }
    
    // ✅ ADDED: Prevent blocking admin
    if (user.role === 'admin') {
      showNotification(t('admin.cannotBlockAdminAccounts'), "bg-red-600");
      return;
    }
    
    try {
      // Call your backend API to block the user
      await API.put(`/users/block/${id}`, { isActive: false });
      
      // Update local state
      setUsersAndCreators((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isActive: false } : u
        )
      );
      showNotification(t('admin.blockedNotification', { name: user.username }), "bg-yellow-600");
    } catch (error) {
      console.error('Error blocking user:', error);
      showNotification(
        t('admin.failedToBlock', { error: error.response?.data?.message || error.message }), 
        "bg-red-600"
      );
    }
  };

  // Unblock user function - ENHANCED
  const handleUnblockUser = async (id) => {
    const user = usersAndCreators.find((u) => u._id === id);
    
    if (!user) {
      showNotification(t('admin.userNotFound'), "bg-red-600");
      return;
    }
    
    try {
      // Call your backend API to unblock the user
      await API.put(`/users/block/${id}`, { isActive: true });
      
      // Update local state
      setUsersAndCreators((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isActive: true } : u
        )
      );
      showNotification(t('admin.unblockedNotification', { name: user.username }), "bg-green-600");
    } catch (error) {
      console.error('Error unblocking user:', error);
      showNotification(
        t('admin.failedToUnblock', { error: error.response?.data?.message || error.message }), 
        "bg-red-600"
      );
    }
  };

  // Delete user function - ENHANCED
  const handleDeleteUser = async (id) => {
    const user = usersAndCreators.find((u) => u._id === id);
    
    if (!user) {
      showNotification(t('admin.userNotFound'), "bg-red-600");
      return;
    }
    
    // ✅ ADDED: Prevent deleting admin
    if (user.role === 'admin') {
      showNotification(t('admin.cannotDeleteAdminAccounts'), "bg-red-600");
      return;
    }
    
    if (window.confirm(t('admin.confirmDelete', { name: user.username }))) {
      try {
        await API.delete(`/users/delete/${id}`);
        
        // Update local state
        setUsersAndCreators((prevUsers) => prevUsers.filter((u) => u._id !== id));
        showNotification(t('admin.deletedNotification', { name: user.username }), "bg-red-600");
      } catch (error) {
        console.error('Error deleting user:', error);
        console.error('Error details:', error.response?.data);
        showNotification(
          t('admin.failedToDelete', { error: error.response?.data?.message || error.message }), 
          "bg-red-600"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('admin.userManagement')}</h2>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <div className="text-xl text-gray-600 dark:text-gray-400">{t('admin.loadingUsers')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.userManagement')}</h2>
        {/* ✅ ADDED: Refresh button */}
        <button
          onClick={fetchUsersAndCreators}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {t('admin.refresh')}
        </button>
      </div>
      
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
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.id')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.name')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.email')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.role')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.status')}</th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {usersAndCreators.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                  {t('admin.noUsers')}
                </td>
              </tr>
            ) : (
              usersAndCreators.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#071519] text-gray-800 dark:text-gray-200">
                  <td className="py-3 px-4 text-sm">{user._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : user.role === 'content-creator'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {user.isActive ? t('admin.active') : t('admin.blocked')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {/* ✅ ENHANCED: Disable buttons for admin */}
                      {user.isActive ? (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          disabled={user.role === 'admin'}
                          className={`px-3 py-1 rounded text-sm transition ${
                            user.role === 'admin'
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-yellow-500 text-white hover:bg-yellow-600'
                          }`}
                          title={user.role === 'admin' ? t('admin.cannotBlockAdmin') : t('admin.blockUser')}
                        >
                          {t('admin.block')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          disabled={user.role === 'admin'}
                          className={`px-3 py-1 rounded text-sm transition ${
                            user.role === 'admin'
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          title={user.role === 'admin' ? t('admin.cannotUnblockAdmin') : t('admin.unblockUser')}
                        >
                          {t('admin.unblock')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                        className={`px-3 py-1 rounded text-sm transition ${
                          user.role === 'admin'
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        title={user.role === 'admin' ? t('admin.cannotDeleteAdmin') : t('admin.deleteUser')}
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
      
      {/* ✅ ADDED: Total count */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {t('admin.totalUsersFooter', { count: usersAndCreators.length })}
      </div>
    </div>
  );
};

export default Users;