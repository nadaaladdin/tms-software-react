import React, { useState } from 'react';
import ourLogo from "../assets/svg/ourLogo.png";
import { Link } from 'react-router-dom';

export default function Home() {
  const [isSignedOut, setIsSignedOut] = useState(true);

  const handleSignOut = () => {
    // Logic for signing out the user
    setIsSignedOut(false);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-r from-yellow-200 to-green-300">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-8xl font-bold text-blue-900  mb-12">Welcome!</h1>
        <div className="mt-12">
          <div className="flex justify-center">
            <img
              src={ourLogo}
              alt="Featured Item 1"
              className="w-full max-w-lg mb-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl text-blue-900 mb-8 font-semibold">About us!</h1>
            <p className="text-lg text-blue-900 font-semibold">
              Streamline your tasks and boost your productivity with our task management system. From personal to professional projects, our user-friendly app helps you stay organized, collaborate seamlessly, and achieve your goals. Simplify your life and unlock your true potential today!
            </p>
            {isSignedOut && (
              <button
                className="w-full bg-blue-900 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-7 py-3 mt-24"
                type="submit"
                onClick={handleSignOut} // Call handleSignOut when the button is clicked
              >
                <Link to="/sign-in" className="flex justify-center items-center">
                  Get Started
                </Link>
              </button>
            )}
          </div>
          <div className="flex justify-center items-center">
            <img
              src="https://www.meistertask.com/pages/wp-content/uploads/sites/2/2022/01/MT-Sprechen-wir-daruber_DE_220112-1-898x1024.png"
              alt="Featured Item 2"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
