import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
  
    try {
      const response = await fetch('https://localhost:7010/api/User/ForgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
  
      alert("Password reset link sent to your email!");
  
      // Redirect to the Reset Password screen with email in query params
      navigate(`/resetPassword?email=${encodeURIComponent(email)}`);
  
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div>
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden" />
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-3 font-semibold text-4xl">Forgot Your Password?</h1>
            <p className="pr-3 text-sm opacity-75">
              Enter your email address to receive a password reset link.
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Forgot Password</h3>
              <p className="text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-sm text-purple-700 hover:text-purple-700">
                  Login
                </Link>
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
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
