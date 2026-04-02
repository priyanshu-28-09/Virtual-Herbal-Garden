import React, { useState, useEffect } from "react";
import { FaEye, FaTrashAlt, FaEdit, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyHerbs = () => {
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedHerb, setEditedHerb] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchMyHerbs();
  }, []);

  const fetchMyHerbs = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        setNotification({ message: '⚠️ Please login first!', type: 'error' });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/herbs/my-herbs/${user._id || user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setHerbs(data.herbs);
      } else {
        setNotification({ message: '❌ Failed to fetch herbs', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching herbs:', error);
      setNotification({ message: '❌ Error loading herbs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  };

  const handleView = (id) => {
    setViewingId(id);
  };

  const handleCloseView = () => {
    setViewingId(null);
  };

  const handleEdit = (id) => {
    const herbToEdit = herbs.find((herb) => herb._id === id);
    setEditedHerb({ ...herbToEdit });
    setEditingId(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedHerb({ ...editedHerb, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/herbs/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedHerb)
      });

      const data = await response.json();

      if (data.success) {
        setHerbs(herbs.map((herb) => (herb._id === editingId ? editedHerb : herb)));
        setEditingId(null);
        setEditedHerb(null);
        showNotification('✅ Herb updated successfully!', 'success');
      } else {
        showNotification('❌ Failed to update herb', 'error');
      }
    } catch (error) {
      console.error('Error updating herb:', error);
      showNotification('❌ Error updating herb', 'error');
    }
  };

  const handleDelete = async (id) => {
    const herb = herbs.find((h) => h._id === id);
    
    if (window.confirm(`Are you sure you want to delete "${herb.name}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/herbs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setHerbs(herbs.filter((herb) => herb._id !== id));
          showNotification('✅ Herb deleted successfully!', 'success');
        } else {
          showNotification('❌ Failed to delete herb', 'error');
        }
      } catch (error) {
        console.error('Error deleting herb:', error);
        showNotification('❌ Error deleting herb', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rejected' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚪ Inactive' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
        <span className="ml-4 text-xl text-gray-600">Loading your herbs...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-green-600 bg-clip-text text-transparent drop-shadow-md">
            🌿 My Herbal Garden 🌿
          </h1>
          <p className="text-lg text-gray-700 font-medium mt-2">
            Discover, manage, and grow your collection of medicinal herbs.
          </p>
        </div>
        <Link
          to="/content-creator/add-herb"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition font-semibold"
        >
          + Add New Herb
        </Link>
      </div>

      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Herbs Grid */}
      {herbs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl mb-4">
            No herbs added yet. Start by adding your first herb! 🌱
          </p>
          <Link
            to="/content-creator/add-herb"
            className="text-green-600 hover:underline font-semibold text-lg"
          >
            Add Your First Herb →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb._id}
              className="bg-white rounded-lg p-6 shadow-md transition-transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={
                    herb.image
                      ? `http://localhost:5000${herb.image}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={herb.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    getStatusBadge(herb.status).bg
                  } ${getStatusBadge(herb.status).text}`}
                >
                  {getStatusBadge(herb.status).label}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mt-4 text-teal-600">{herb.name}</h3>
              <p className="text-md text-gray-600 italic">
                <strong>Botanical Name:</strong> {herb.scientificName}
              </p>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {herb.description || "No description available"}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  onClick={() => handleView(herb._id)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 font-semibold"
                  onClick={() => handleEdit(herb._id)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold"
                  onClick={() => handleDelete(herb._id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>

              {/* Video Indicator */}
              {herb.video && (
                <div className="mt-3 text-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    📹 Has Video
                  </span>
                </div>
              )}

              {/* Date Added */}
              <p className="text-xs text-gray-500 text-center mt-3">
                Added: {new Date(herb.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewingId !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none"
              onClick={handleCloseView}
            >
              ✖
            </button>
            {herbs.find((herb) => herb._id === viewingId) && (() => {
              const herb = herbs.find((h) => h._id === viewingId);
              return (
                <>
                  <img
                    src={herb.image ? `http://localhost:5000${herb.image}` : "https://via.placeholder.com/600x300"}
                    alt={herb.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <h3 className="text-3xl font-bold mt-4 text-green-600">{herb.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <DetailItem label="Botanical Name" value={herb.scientificName} />
                    <DetailItem label="Status" value={getStatusBadge(herb.status).label} />
                    <DetailItem label="Description" value={herb.description} span={2} />
                    <DetailItem label="Habitat" value={herb.habitat} span={2} />
                    <DetailItem label="Medicinal Uses" value={herb.medicinalUses} span={2} />
                    <DetailItem label="Chemical Composition" value={herb.chemicalComposition} span={2} />
                    <DetailItem label="Pharmacological Effect" value={herb.pharmacologicalEffect} span={2} />
                    <DetailItem label="Clinical Studies" value={herb.clinicalStudies} span={2} />
                    <DetailItem label="Safety Precautions" value={herb.safetyPrecautions} span={2} />
                    <DetailItem label="Cultural Significance" value={herb.culturalSignificance} span={2} />
                  </div>

                  {/* Video */}
                  {herb.video && (
                    <div className="mt-6">
                      <h4 className="text-xl font-semibold mb-2">Video:</h4>
                      <video controls className="w-full rounded-md">
                        <source src={`http://localhost:5000${herb.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId !== null && editedHerb && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none"
              onClick={() => setEditingId(null)}
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Edit Herb Details</h3>
            <form className="space-y-4">
              {Object.keys(editedHerb)
                .filter(key => !['_id', '__v', 'image', 'video', 'createdAt', 'updatedAt', 'createdBy'].includes(key))
                .map((key) => (
                  <div key={key}>
                    <label className="block text-gray-700 font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <textarea
                      name={key}
                      value={editedHerb[key] || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ))}
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-600 text-white p-3 rounded-md w-full font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for displaying details
const DetailItem = ({ label, value, span = 1 }) => (
  <div className={`${span === 2 ? 'md:col-span-2' : ''}`}>
    <p className="text-gray-700">
      <strong className="text-green-600">{label}:</strong>{' '}
      {value || 'Not provided'}
    </p>
  </div>
);

export default MyHerbs;