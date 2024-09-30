import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import styles
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';

const EditAchievement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { achievementId } = location.state || {};
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    impact: '',
    keywords: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (achievementId) {
      const fetchAchievement = async () => {
        try {
          const token = localStorage.getItem('yourAuthToken');
          const response = await axios.get(`https://localhost:7010/api/Achievements/AchievementbyId/${achievementId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Format dates from the API response
          const formattedStartDate = format(new Date(response.data.startDate), 'yyyy-MM-dd');
          const formattedEndDate = format(new Date(response.data.endDate), 'yyyy-MM-dd');

          setFormData({
            ...response.data,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          });
        } catch (error) {
          console.error('Error fetching achievement:', error.response?.data || error.message);
          setError('Error fetching achievement. Please ensure you are logged in.');
        } finally {
          setLoading(false);
        }
      };

      fetchAchievement();
    } else {
      setLoading(false);
    }
  }, [achievementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedDescription = DOMPurify.sanitize(formData.description);
    const payload = {
      ...formData,
      description: sanitizedDescription,
    };

    try {
      const token = localStorage.getItem('yourAuthToken');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(
        `https://localhost:7010/api/Achievements/Update/${achievementId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/DisplayAchievement');
    } catch (error) {
      setError('Error updating achievement.');
      console.error('Error updating achievement:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Achievement</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="mt-1"
              theme="snow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="impact">Impact</label>
            <input
              id="impact"
              name="impact"
              type="text"
              value={formData.impact}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="keywords">Keywords</label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              value={formData.keywords}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAchievement;
