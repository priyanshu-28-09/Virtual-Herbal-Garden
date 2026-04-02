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
      console.log('📡 Sending request to: http://localhost:5000/api/herbs');
      
      const response = await fetch('http://localhost:5000/api/herbs', {
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
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 mb-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Add New Herb to AYUSH Virtual Garden
      </h2>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            {['name', 'scientificName', 'description'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botanical & Physical Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Botanical & Physical Information</h3>
          
          <div className="space-y-4">
            {['botanicalInfo', 'physicalDescription', 'habitat'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Medicinal & Chemical Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Medicinal & Chemical Information</h3>
          
          <div className="space-y-4">
            {['medicinalMethod', 'conventionalComposition', 'chemicalComposition', 'pharmacologicalEffect'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Clinical & Safety Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Clinical & Safety Information</h3>
          
          <div className="space-y-4">
            {['clinicalStudies', 'safetyPrecautions'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cultural & Additional Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cultural & Additional Information</h3>
          
          <div className="space-y-4">
            {['culturalSignificance', 'plantSuccess', 'referenceLink', '_3DId'].map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
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
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                ) : key === '_3DId' ? (
                  <input
                    type="text"
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder="Enter 3D model ID or URL"
                    required
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                ) : (
                  <textarea
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
                    required
                    rows={3}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Image */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Herb Image</h3>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Herb Image<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Herb Preview"
                className="mt-4 w-full max-h-64 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {loading ? '⏳ Adding Herb...' : 'Add Herb to Virtual Garden'}
        </button>
      </form>
    </div>
  );
};

export default AddHerb;