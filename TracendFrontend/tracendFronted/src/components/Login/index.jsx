import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons from react-icons
import 'tailwindcss/tailwind.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const loginDetails = { email, password };

    try {
      const response = await axios.post('https://localhost:7010/api/User/Login', loginDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const token = response.data.token; // Adjust based on your API response
        localStorage.setItem('yourAuthToken', token);
        alert("Login successful!");
        navigate('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data || 'Invalid email or password');
      } else if (error.request) {
        setError('No response received from server');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden" />
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <motion.h1
              className="my-3 font-semibold text-4xl"
              initial={{ scale: 1 }} // Initial scale
              animate={{ scale: [1, 1.1, 1] }} // Scale from 1 to 1.1 and back
              transition={{
                duration: 1, // Duration of the animation
                repeat: Infinity, // Repeat infinitely
                ease: "easeInOut", // Easing function
              }}
            >
              Welcome back
            </motion.h1>
            <p className="pr-3 text-sm opacity-75">Celebrate the Highs, Reach for the Skies</p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Sign In</h3>
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-sm text-purple-700 hover:text-purple-700">Register Here</Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  className="text-sm text-black-200 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />} {/* Toggle icon */}
                </span>
              </div>
              {error && <p className="text-red-500" role="alert">{error}</p>}
              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <Link to="/forgot-password" className="text-purple-700 hover:text-purple-600">Forgot your password?</Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-800 hover:bg-purple-700'} text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500`}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign in'}
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 my-5">
                <span className="h-px w-16 bg-gray-100"></span>
                
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
