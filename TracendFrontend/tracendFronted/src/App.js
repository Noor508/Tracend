import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Register from './components/Register/index.jsx';
import Login from './components/Login/index.jsx';
import ForgotPassword from './components/ForgotPassword/index.jsx';
import Profile from './components/Profile/index.jsx';
import Homepage from './components/HomePage/index.jsx'; // Import Homepage component
import AddAchievement from './components/AddAchievement/index.jsx'; // Import Add Achievement component
import DisplayAchievement from './components/DisplayAchievement/index.jsx'; // Import View Achievements component
import EditAchievement from './components/EditAchievement/index.jsx';
import SearchedAchievement from './components/Search/index.jsx';
import ResetPassword from './components/ResetPassword/index.jsx';
function App() {
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');

  // Callback function to update profile picture
  const updateProfilePic = (newPic) => {
    setProfilePic(newPic);
  };

  return (
    <Router>
      <Navbar profilePic={profilePic} /> {/* Navbar rendered once here */}

      <Routes>
  <Route path="/" element={<Register />} />
  <Route path="/dashboard" element={<Homepage />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/profile" element={<Profile updateProfilePic={updateProfilePic} />} />
  <Route path="/AddAchievement" element={<AddAchievement />} />
  <Route path="/DisplayAchievement" element={<DisplayAchievement />} />
  <Route path="/EditAchievement" element={<EditAchievement />} />
  <Route path="/Search" element={<SearchedAchievement />} />
  <Route path="/resetPassword" element={<ResetPassword />} />

  </Routes>

    </Router>
  );
}

export default App;
