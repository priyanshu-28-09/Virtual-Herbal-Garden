import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  // Notification state
  const [notification, setNotification] = useState({
    message: "",
    color: "",
    visible: false,
  });

  const [usersAndCreators, setUsersAndCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  console.log(usersAndCreators);

  useEffect(() => {
    fetchUsersAndCreators();
  }, []);

  const fetchUsersAndCreators = async () => {
    try {
      setLoading(true);
      
      // ✅ ADDED: Get token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      // ✅ ADDED: Send token in headers
      const response = await axios.get('http://localhost:5001/api/users/userData', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = response.data;
      
      // ✅ ADDED: Validate that data is an array
      if (Array.isArray(data)) {
        setUsersAndCreators(data);
      } else {
        console.error('Expected array but got:', typeof data);
        setUsersAndCreators([]);
        showNotification('Invalid data format received from server', "bg-red-600");
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users and content creators:', error);
      showNotification(
        error.response?.data?.message || 'Failed to fetch users data', 
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
      showNotification('User not found', "bg-red-600");
      return;
    }
    
    // ✅ ADDED: Prevent blocking admin
    if (user.role === 'admin') {
      showNotification('Cannot block admin accounts', "bg-red-600");
      return;
    }
    
    try {
      // ✅ ADDED: Get token for authentication
      const token = localStorage.getItem('token');
      
      // Call your backend API to block the user
      await axios.put(
        `http://localhost:5001/api/users/block/${id}`, 
        { isActive: false },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setUsersAndCreators((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isActive: false } : u
        )
      );
      showNotification(`${user.username} has been blocked.`, "bg-yellow-600");
    } catch (error) {
      console.error('Error blocking user:', error);
      showNotification(
        `Failed to block user: ${error.response?.data?.message || error.message}`, 
        "bg-red-600"
      );
    }
  };

  // Unblock user function - ENHANCED
  const handleUnblockUser = async (id) => {
    const user = usersAndCreators.find((u) => u._id === id);
    
    if (!user) {
      showNotification('User not found', "bg-red-600");
      return;
    }
    
    try {
      // ✅ ADDED: Get token for authentication
      const token = localStorage.getItem('token');
      
      // Call your backend API to unblock the user
      await axios.put(
        `http://localhost:5001/api/users/block/${id}`, 
        { isActive: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setUsersAndCreators((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isActive: true } : u
        )
      );
      showNotification(`${user.username} has been unblocked.`, "bg-green-600");
    } catch (error) {
      console.error('Error unblocking user:', error);
      showNotification(
        `Failed to unblock user: ${error.response?.data?.message || error.message}`, 
        "bg-red-600"
      );
    }
  };

  // Delete user function - ENHANCED
  const handleDeleteUser = async (id) => {
    const user = usersAndCreators.find((u) => u._id === id);
    
    if (!user) {
      showNotification('User not found', "bg-red-600");
      return;
    }
    
    // ✅ ADDED: Prevent deleting admin
    if (user.role === 'admin') {
      showNotification('Cannot delete admin accounts', "bg-red-600");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) {
      try {
        console.log('Attempting to delete user:', id);
        
        // ✅ ADDED: Get token for authentication
        const token = localStorage.getItem('token');
        
        // Call your backend API to delete the user
        const response = await axios.delete(
          `http://localhost:5001/api/users/delete/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('Delete response:', response);
        
        // Update local state
        setUsersAndCreators((prevUsers) => prevUsers.filter((u) => u._id !== id));
        showNotification(`${user.username} has been deleted successfully.`, "bg-red-600");
      } catch (error) {
        console.error('Error deleting user:', error);
        console.error('Error details:', error.response?.data);
        showNotification(
          `Failed to delete user: ${error.response?.data?.message || error.message}`, 
          "bg-red-600"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">User Management</h2>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <div className="text-xl text-gray-600">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        {/* ✅ ADDED: Refresh button */}
        <button
          onClick={fetchUsersAndCreators}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Refresh
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

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersAndCreators.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              usersAndCreators.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{user._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'content-creator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {/* ✅ ENHANCED: Disable buttons for admin */}
                      {user.isActive ? (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          disabled={user.role === 'admin'}
                          className={`px-3 py-1 rounded text-sm transition ${
                            user.role === 'admin'
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-500 text-white hover:bg-yellow-600'
                          }`}
                          title={user.role === 'admin' ? 'Cannot block admin' : 'Block user'}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          disabled={user.role === 'admin'}
                          className={`px-3 py-1 rounded text-sm transition ${
                            user.role === 'admin'
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          title={user.role === 'admin' ? 'Cannot unblock admin' : 'Unblock user'}
                        >
                          Unblock
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                        className={`px-3 py-1 rounded text-sm transition ${
                          user.role === 'admin'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                      >
                        Delete
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
      <div className="mt-4 text-sm text-gray-600">
        Total users: {usersAndCreators.length}
      </div>
    </div>
  );
};

export default Users;