import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Import axios

const AddAchievement = () => {
  const [title, setTitle] = useState(''); // New state for title
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const quillRef = useRef(null);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleSave = async () => {
    const newAchievement = {
      title,
      startDate,
      endDate,
      description,
      impact,
      keywords: keyword,
    };

    try {
      // Retrieve the token (replace 'yourAuthToken' with the appropriate key)
      const token = localStorage.getItem('yourAuthToken'); 
      console.log("Retrieved token:", token); // Add this line

      // Post the new achievement to the API
      await axios.post('https://localhost:7010/api/Achievements/Add', newAchievement, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      // Clear input fields
      resetForm();

      // Show success alert
      setShowAlert(true);

      // Hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error saving achievement:', error);
      // Handle error appropriately
    }
  };

  const resetForm = () => {
    setTitle('');
    setStartDate(null);
    setEndDate(null);
    setDescription('');
    setImpact('');
    setKeyword('');
    if (quillRef.current) {
      quillRef.current.getEditor().setText(''); // Clear the Quill editor
    }
  };

  useEffect(() => {
    resetForm(); // Reset form whenever the component mounts

    const autoSaveInterval = setInterval(() => {
      const autoSaveData = { title, startDate, endDate, description, impact, keyword };
      localStorage.setItem('autoSaveAchievement', JSON.stringify(autoSaveData));
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  useEffect(() => {
    const autoSaveData = JSON.parse(localStorage.getItem('autoSaveAchievement'));
    if (autoSaveData) {
      setTitle(autoSaveData.title || '');
      setStartDate(autoSaveData.startDate || null);
      setEndDate(autoSaveData.endDate || null);
      setDescription(autoSaveData.description || '');
      setImpact(autoSaveData.impact || '');
      setKeyword(autoSaveData.keyword || '');
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4 sm:mx-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Achievement
        </h1>

        {/* Alert */}
        {showAlert && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Achievement Saved.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 5.652a1.5 1.5 0 00-2.121 0L10 6.879 7.773 4.652a1.5 1.5 0 00-2.121 2.121L7.879 9l-2.227 2.227a1.5 1.5 0 002.121 2.121L10 11.121l2.227 2.227a1.5 1.5 0 002.121-2.121L12.121 9l2.227-2.227a1.5 1.5 0 000-2.121z"/>
              </svg>
            </span>
          </div>
        )}

        {/* Title Field */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter the title of your achievement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">Date Range</label>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MMMM d, yyyy"
              placeholderText="Start Date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="MMMM d, yyyy"
              placeholderText="End Date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">Description</label>
          <ReactQuill
            ref={quillRef}
            value={description}
            onChange={handleDescriptionChange}
            theme="snow"
            className="bg-gray-50 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">Impact</label>
          <textarea
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Describe the impact of your achievement"
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
          ></textarea>
        </div>

        {/* New Keyword Input Field */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">Keyword</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter keywords for this achievement"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300"
          >
            Save Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAchievement;
