import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageContent = () => {
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
      const response = await axios.get("http://localhost:5000/api/herbs");
      setHerbs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching herbs:", error);
      showNotification("Failed to fetch herbs data", "bg-red-600");
      setLoading(false);
    }
  };

  // Function to show notification
  const showNotification = (message, color) => {
    setNotification({ message, color, visible: true });

    setTimeout(() => {
      setNotification({ message: "", color: "", visible: false });
    }, 5000);
  };

  // Delete herb function
  const handleDeleteHerb = async (id) => {
    const herb = herbs.find((h) => h._id === id);
    if (herb) {
      if (window.confirm(`Are you sure you want to delete ${herb.name}?`)) {
        try {
          await axios.delete(`http://localhost:5000/api/herbs/${id}`);
          setHerbs((prevHerbs) => prevHerbs.filter((h) => h._id !== id));
          showNotification(`${herb.name} has been deleted.`, "bg-red-600");
        } catch (error) {
          console.error("Error deleting herb:", error);
          showNotification("Failed to delete herb", "bg-red-600");
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
        await axios.put(`http://localhost:5000/api/herbs/status/${id}`, {
          isActive: newStatus
        });
        
        setHerbs((prevHerbs) =>
          prevHerbs.map((h) =>
            h._id === id ? { ...h, isActive: newStatus } : h
          )
        );
        showNotification(
          `${herb.name} has been ${newStatus ? 'activated' : 'deactivated'}.`,
          newStatus ? "bg-green-600" : "bg-yellow-600"
        );
      } catch (error) {
        console.error("Error updating herb status:", error);
        showNotification("Failed to update herb status", "bg-red-600");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Content</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading herbs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      <h2 className="text-2xl font-semibold mb-6">Manage Content</h2>

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
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Scientific Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Uses</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {herbs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                  No herbs found
                </td>
              </tr>
            ) : (
              herbs.map((herb) => (
                <tr key={herb._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {herb.image ? (
                      <img
                        src={herb.image}
                        alt={herb.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{herb.name}</td>
                  <td className="py-3 px-4 text-sm italic text-gray-600">
                    {herb.scientificName || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
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
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {herb.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(herb._id)}
                        className={`${
                          herb.isActive !== false
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white px-3 py-1 rounded text-sm transition`}
                      >
                        {herb.isActive !== false ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteHerb(herb._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
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
    </div>
  );
};

export default ManageContent;