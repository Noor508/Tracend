import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Homepage() {
  return (
    <div className="mt-10 flex flex-col gap-5 items-center justify-center text-gray-900 bg-gray-100 min-h-screen p-6">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-extrabold mb-4">Highlight Your Achievements</h1>
        <p className="text-lg mb-6">
          Easily track and present your success in a structured format. Whether for performance reviews, job applications, or personal progress tracking, we've got you covered.
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            to="/AddAchievement"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition ease-in duration-300"
          >
            Add Achievement
          </Link>

          <Link
            to="/DisplayAchievement"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition ease-in duration-300"
          >
            View Achievements
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
