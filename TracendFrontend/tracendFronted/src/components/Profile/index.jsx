import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const token = localStorage.getItem('yourAuthToken'); // Get the JWT

  // Function to fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`https://localhost:7010/api/Profile/GetProfile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
        }
      });
      setFormData({
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch profile data on component load
  useEffect(() => {
    fetchProfileData(); // Call the fetchProfileData function
  }, [token]);

  // Handle change for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('bio', formData.bio);

      // Send a PUT request to update profile details
      const response = await axios.put(
        `https://localhost:7010/api/Profile/UpdateProfile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className=" min-h-screen ">
      {/* Profile Picture */}
    

      {/* Profile Info and Form */}
      <div className="relative   bg-white max-w-3xl mx-auto px-4 py-8 text-center rounded-lg " style={{ marginTop: "10%" }}>

        <h1 className="text-3xl font-bold">{formData.name || "Your Name"}</h1>
        <p className="text-lg text-gray-600">{formData.bio || "Tell us about yourself"}</p>

        {/* Form to edit profile */}
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Tell us about yourself"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
