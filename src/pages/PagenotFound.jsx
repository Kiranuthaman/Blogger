import React from 'react';
import { Link } from 'react-router-dom';

function PagenotFound() {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <img
            className="w-1/2 md:w-1/3 lg:w-1/4"
            src="https://cdn.dribbble.com/users/1175431/screenshots/6188233/404-error-dribbble-800x600.gif"
            alt="404 Error"
          />
          <h1 className="text-4xl font-bold text-gray-800 mt-6">
            Looks like you're lost
          </h1>
          <h4 className="text-xl text-gray-600 mt-4">
            The page you are looking for is unavailable.
          </h4>
          <Link to="/">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
              aria-label="Go to homepage"
            >
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PagenotFound;
