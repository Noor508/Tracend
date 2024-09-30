import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons
import "tailwindcss/tailwind.css";
import Typed from "typed.js"; // Import Typed.js
import { motion } from "framer-motion"; // Import Framer Motion

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const typedRef = useRef(null); // Create a ref for Typed.js

  useEffect(() => {
    const options = {
      strings: [
        "Join us and start tracking your achievements",
        
      ],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1000, // Delay before starting to delete
      loop: true, // Keep it looping indefinitely
    };

    // Initialize Typed.js
    typedRef.current = new Typed("#typed-text", options);

    return () => {
      typedRef.current.destroy(); // Cleanup on component unmount
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const userDetails = { name, email, password };

    try {
      const response = await axios.post(
        "https://localhost:7010/api/User/Register",
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data || "An error occurred";
      setError(errorMessage);
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
            <div className="self-start hidden lg:flex flex-col text-gray-300">
              <motion.h1
                className="my-3 font-semibold text-4xl italic text-white"
                initial={{ scale: 1 }} // Initial scale
                animate={{ scale: [1, 1.1, 1] }} // Scale from 1 to 1.1 and back
                transition={{
                  duration: 1, // Duration of the animation
                  repeat: Infinity, // Repeat infinitely
                  ease: "easeInOut", // Easing function
                }}
              >
                Welcome to Tracend
              </motion.h1>

              <p id="typed-text" className="pr-3 text-sm opacity-75"></p>
            </div>
            <p id="typed-text" className="pr-3 text-sm opacity-75"></p>{" "}
            {/* Added the typed text element */}
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">
                Create an Account
              </h3>
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-sm text-purple-700 hover:text-purple-700"
                >
                  Login
                </Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="text-sm text-black-200 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <div className="relative">
                <input
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="text-sm text-black-200 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-800 hover:bg-purple-700"
                  } text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500`}
                  disabled={loading}
                >
                  {loading ? <span className="loader"></span> : "Sign Up"}
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 my-5">
                <span className="h-px w-16 bg-gray-100"></span>
                <span className="h-px w-16 bg-gray-100"></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
