import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import HTMLDocx from "html-docx-js/dist/html-docx";
import DOMPurify from "dompurify";
import ConfirmationAlert from "../ConfirmDialog/index.jsx"; // import your ConfirmationAlert component
import axios from "axios";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const DisplayAchievement = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('yourAuthToken'); 
            const response = await axios.get("https://localhost:7010/api/Achievements/GetUserAchievements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login"); // Adjust to your login route
      } else {
        alert("Failed to fetch achievements. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleEditClick = (achievementId) => {
    navigate("/EditAchievement", { state: { achievementId } });
  };

  const handleDelete = (id) => {
    // Set the delete index and show the confirmation alert
    setDeleteIndex(id);
    setShowConfirmAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("yourAuthToken"); // Ensure token retrieval is consistent
      await axios.delete(`https://localhost:7010/api/Achievements/Delete/${deleteIndex}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAchievements(); // Fetch updated achievements after deletion
      alert("Achievement deleted successfully.");
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement. Please try again.");
    } finally {
      setShowConfirmAlert(false); // Close the confirmation dialog after deletion attempt
    }
  };

  const handleExportPDF = () => {
    if (achievements.length === 0) {
      console.log("No achievements to export.");
      return;
    }

    const content = achievements
      .map(
        (ach) => `
      <div style="font-family: Arial, sans-serif; margin: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <h1 style="font-size: 24px; color: #333;">Achievement</h1>
        <p style="font-size: 18px; color: #555;"><strong>Start Date:</strong> ${formatDate(ach.startDate)}</p>
        <p style="font-size: 18px; color: #555;"><strong>End Date:</strong> ${formatDate(ach.endDate)}</p>
        <p style="font-size: 18px; color: #555;"><strong>Description:</strong></p>
        <div style="font-size: 16px; color: #666;">${DOMPurify.sanitize(ach.description)}</div>
        <p style="font-size: 18px; color: #555;"><strong>Impact:</strong> ${ach.impact}</p>
        <p style="font-size: 18px; color: #555;"><strong>Keywords:</strong> ${ach.keywords || "No keywords"}</p>
        <p style="font-size: 18px; color: #555;"><strong>Achievement ID:</strong> ${ach.achievementId}</p>
        <hr style="margin: 20px 0; border-top: 1px solid #eee;">
      </div>
    `
      )
      .join("");

    const element = document.createElement("div");
    element.innerHTML = content;
    document.body.appendChild(element);

    html2pdf()
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.autoPrint();
        pdf.save("achievements.pdf");
      })
      .finally(() => document.body.removeChild(element));
  };

  const handleExportWord = () => {
    const htmlContent = `
      <html>
      <body>
        ${achievements
          .map(
            (ach) => `
          <h1>Achievement</h1>
          <p><strong>Start Date:</strong> ${formatDate(ach.startDate)}</p>
          <p><strong>End Date:</strong> ${formatDate(ach.endDate)}</p>
          <p><strong>Description:</strong></p>
          ${DOMPurify.sanitize(ach.description)}
          <p><strong>Impact:</strong> ${ach.impact}</p>
          <p><strong>Keywords:</strong> ${ach.keywords || ""}</p>
          <p><strong>Achievement ID:</strong> ${ach.achievementId}</p>
          <hr>
        `
          )
          .join("")}
      </body>
      </html>
    `;

    const converted = HTMLDocx.asBlob(htmlContent);
    saveAs(converted, "achievements.docx");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex items-center mb-6">
          <FaTrophy className="text-yellow-500 text-4xl mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Your Achievements</h1>
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
                achievements.map((ach, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition duration-300">
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
                        onClick={() => handleDelete(ach.achievementId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-3 px-4 text-sm text-center text-gray-700">
                    No achievements available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="px-6 py-2 bg-red-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md"
            onClick={handleExportPDF}
          >
            <FaFilePdf className="inline-block mr-2" /> Export as PDF
          </button>
          <button
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
            onClick={handleExportWord}
          >
            <FaFileWord className="inline-block mr-2" /> Export as Word
          </button>
        </div>
      </div>

      {showConfirmAlert && (
        <ConfirmationAlert
          message="Are you sure you want to delete this achievement?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmAlert(false)}
        />
      )}
    </div>
  );
};

export default DisplayAchievement;
