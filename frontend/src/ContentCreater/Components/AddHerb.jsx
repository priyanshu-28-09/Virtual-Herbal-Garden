import React, { useState } from 'react';

const AddHerb = () => {
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    botanicalInfo: '',
    physicalDescription: '',
    habitat: '',
    medicinalMethod: '',
    conventionalComposition: '',
    chemicalComposition: '',
    pharmacologicalEffect: '',
    clinicalStudies: '',
    safetyPrecautions: '',
    culturalSignificance: '',
    plantSuccess: '',
    referenceLink: '',
    _3DId: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🚀 Starting form submission...');
      
      // Get user info
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      console.log('👤 User:', user);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');

      if (!user || !token) {
        setMessage({ type: 'error', text: '⚠️ Please login first!' });
        setLoading(false);
        return;
      }

      // Create FormData
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
        console.log(`📝 ${key}:`, formData[key]);
      });
      
      // Append user ID
      formDataToSend.append('userId', user._id || user.id);
      
      // Append image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
        console.log('🖼️ Image file:', imageFile.name);
      } else {
        setMessage({ type: 'error', text: '⚠️ Please upload an herb image!' });
        setLoading(false);
        return;
      }

      // API call
      console.log('📡 Sending request to: http://localhost:5001/api/herbs');
      
      const response = await fetch('http://localhost:5001/api/herbs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      console.log('📨 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✅ Herb added successfully!' });
        
        // Reset form
        setFormData({
          name: '',
          scientificName: '',
          description: '',
          botanicalInfo: '',
          physicalDescription: '',
          habitat: '',
          medicinalMethod: '',
          conventionalComposition: '',
          chemicalComposition: '',
          pharmacologicalEffect: '',
          clinicalStudies: '',
          safetyPrecautions: '',
          culturalSignificance: '',
          plantSuccess: '',
          referenceLink: '',
          _3DId: '',
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Reset file input
        document.getElementById('image').value = '';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({ type: 'error', text: `❌ ${data.message || 'Failed to add herb'}` });
      }
    } catch (error) {
      console.error('💥 Error:', error);
      setMessage({ type: 'error', text: '❌ Network error. Check if backend is running!' });
    } finally {
      setLoading(false);
    }
  };

  // Field labels mapping for better display
  const fieldLabels = {
    name: 'Herb Name',
    scientificName: 'Scientific Name',
    description: 'Description',
    botanicalInfo: 'Botanical Information',
    physicalDescription: 'Physical Description',
    habitat: 'Habitat & Distribution',
    medicinalMethod: 'Medicinal Method & Usage',
    conventionalComposition: 'Conventional Composition',
    chemicalComposition: 'Chemical Composition',
    pharmacologicalEffect: 'Pharmacological Effect',
    clinicalStudies: 'Clinical Studies',
    safetyPrecautions: 'Safety Precautions',
    culturalSignificance: 'Cultural Significance',
    plantSuccess: 'Plant Success & Cultivation Tips',
    referenceLink: 'Reference Link',
    _3DId: '3D Model ID',
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-[#0F1720] shadow-2xl rounded-2xl p-8 mt-10 mb-10 border border-gray-200 dark:border-gray-800">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2 text-center">
        🌱 Add New Herb
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Share your herbal knowledge with the community</p>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg font-semibold transition-all ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-400 dark:border-green-600'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-400 dark:border-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">📋 Basic Information</h3>
          
          <div className="space-y-4">
            {['name', 'scientificName', 'description'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {fieldLabels[key]}<span className="text-red-500">*</span>
                </label>
                <textarea
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                  required
                  rows={key === 'description' ? 4 : 2}
                  className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botanical & Physical Information */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">🌱 Botanical Information</h3>
          
          <div className="space-y-4">
            {['botanicalInfo', 'physicalDescription', 'habitat'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {fieldLabels[key]}<span className="text-red-500">*</span>
                </label>
                <textarea
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                  required
                  rows={3}
                  className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Medicinal & Chemical Information */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">💊 Medicinal Information</h3>
          
          <div className="space-y-4">
            {['medicinalMethod', 'conventionalComposition', 'chemicalComposition', 'pharmacologicalEffect'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {fieldLabels[key]}<span className="text-red-500">*</span>
                </label>
                <textarea
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                  required
                  rows={3}
                  className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Clinical & Safety Information */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">⚠️ Safety Information</h3>
          
          <div className="space-y-4">
            {['clinicalStudies', 'safetyPrecautions'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {fieldLabels[key]}<span className="text-red-500">*</span>
                </label>
                <textarea
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                  required
                  rows={3}
                  className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cultural & Additional Information */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">🌿 Additional Info</h3>
          
          <div className="space-y-4">
            {['culturalSignificance', 'plantSuccess', 'referenceLink', '_3DId'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {fieldLabels[key]}<span className="text-red-500">*</span>
                </label>
                {key === 'referenceLink' ? (
                  <input
                    type="url"
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder="https://example.com/herb-reference"
                    required
                    className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                  />
                ) : key === '_3DId' ? (
                  <input
                    type="text"
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder="Enter 3D model ID or URL"
                    required
                    className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                  />
                ) : (
                  <textarea
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                    required
                    rows={3}
                    className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Image */}
        <div className="bg-gradient-to-br from-[#E6FFF5] to-[#F0FFFA] dark:from-[#1a2f24] dark:to-[#0F1720] p-6 rounded-2xl border-2 border-[#2ECC71]/20">
          <h3 className="text-2xl font-bold text-[#2ECC71] mb-6 flex items-center gap-2">📸 Herb Image</h3>
          
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload Herb Image<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] sm:text-sm transition-all cursor-pointer hover:bg-white/50 dark:hover:bg-gray-600/50"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Herb Preview"
                className="mt-4 w-full max-h-64 object-cover rounded-2xl border-2 border-[#2ECC71]/30 shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:ring-offset-2 transition-all text-lg ${
            loading
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-600'
              : 'bg-gradient-to-r from-[#2ECC71] to-[#58E07A] text-white hover:shadow-2xl hover:scale-105 active:scale-95'
          }`}
        >
          {loading ? '⏳ Adding Herb...' : '🌱 Add Herb to Virtual Garden'}
        </button>
      </form>
    </div>
  );
};

export default AddHerb;