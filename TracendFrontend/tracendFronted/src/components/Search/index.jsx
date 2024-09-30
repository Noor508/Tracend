import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import DOMPurify from "dompurify";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const SearchedAchievement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query"); // Extract the search query from the URL
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('yourAuthToken');
      const response = await axios.get(`https://localhost:7010/api/Achievements/Search?keyword=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to fetch achievements. Please try again.");
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        fetchAchievements();
      }
    }, 300); // 300ms delay
  
    return () => {
      clearTimeout(handler); // Cleanup the timeout
    };
  }, [searchQuery]);
  

  const handleEditClick = (achievementId) => {
    navigate("/EditAchievement", { state: { achievementId } }); // Navigate to the edit page with the achievement ID
  };

  const handleDeleteClick = (achievementId) => {
    navigate("/ConfirmDelete", { state: { achievementId } }); // Navigate to the confirmation delete page with the achievement ID
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex items-center mb-6">
          <FaTrophy className="text-yellow-500 text-4xl mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Search Results for "{searchQuery}"</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">End Date</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Impact</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Keywords</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.length > 0 ? (
                achievements.map((ach) => (
                  <tr key={ach.achievementId} className="border-b border-gray-300 hover:bg-gray-50 transition duration-300">
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(ach.startDate)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(ach.endDate)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ach.description) }}></td>
                    <td className="py-3 px-4 text-sm text-gray-700">{ach.impact}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{ach.keywords || "No keywords"}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 flex space-x-2">
                      <FaEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEditClick(ach.achievementId)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(ach.achievementId)} // Navigate to delete confirmation
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 px-4 text-sm text-center text-gray-700">
                    No achievements found for your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchedAchievement;
