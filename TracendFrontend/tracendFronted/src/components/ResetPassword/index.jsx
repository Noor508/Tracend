import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email'); // Get the email from the URL
  const enteredCode = queryParams.get('code'); // Get the code from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7010/api/User/ResetPassword?email=${encodeURIComponent(email)}&enteredCode=${encodeURIComponent(code)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NewPassword: newPassword, ConfirmPassword: confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      alert("Password has been successfully reset!");
      navigate('/dashboard');
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
            <h1 className="my-3 font-semibold text-4xl">Reset Your Password</h1>
            <p className="pr-3 text-sm opacity-75">
              Enter the code you received via email and set your new password.
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-gray-800">Reset Password</h3>
              <p className="text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-sm text-purple-700 hover:text-purple-700">
                  Login
                </Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  placeholder="Code"
                  value={code} // Use the code state variable
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility state
                  className="absolute right-3 top-3 text-gray-600 hover:text-purple-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility state
                  className="absolute right-3 top-3 text-gray-600 hover:text-purple-600"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
