import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = ({ profilePic }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/Search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 p-4 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <img src={logo} className="h-10" alt="Tracend Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Tracend
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg"
          aria-controls="navbar-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Search Input Field */}
        <form onSubmit={handleSearchSubmit} className="flex items-center mt-4 md:mt-0 md:ml-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg ml-2 hidden md:block"
          >
            Search
          </button>
        </form>

        {/* Navbar Menu */}
        <div className={`flex-col md:flex-row md:flex md:items-center ${isOpen ? 'flex' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 text-gray-900 dark:text-white mt-4 md:mt-0">
            <li>
              <Link to="/dashboard" className="text-black py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/DisplayAchievement" className="text-black py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Achievements
              </Link>
            </li>
          </ul>

          {/* Explicit Search and Logout Button in Mobile View */}
          <div className="flex items-center space-x-6 md:ml-6 mt-4 md:mt-0">
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg md:hidden" // Visible in mobile view only
              onClick={handleSearchSubmit}
            >
              Search
            </button>

            <Link
              to="/profile"
              className="text-black py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
