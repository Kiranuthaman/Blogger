import { faCircleUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("existingUsers");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-10 bg-white  sticky top-0 z-50">
      <Link to="/">
        <h1 className="text-3xl font-bold text-blue-500">Blogger</h1>
      </Link>

      {/* Hamburger Menu */}
      <button
        className="md:hidden text-gray-700 text-2xl focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>

      {/* Navigation Links */}
      <ul
        className={`absolute md:static top-16 left-0 w-full md:w-auto md:flex md:items-center md:gap-6 bg-white text-gray-700 p-4 md:p-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "block" : "hidden md:flex"
        }`}
      >
        {!isLoggedIn && (
          <Link to="/login">
            <li className="cursor-pointer">
              <button className="bg-blue-500 rounded-lg px-4 py-1 hover:bg-blue-400 text-white w-full md:w-auto">
                Login
              </button>
            </li>
          </Link>
        )}

        {isLoggedIn && (
          <li className="relative mt-4 md:mt-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 focus:outline-none"
            >
              <FontAwesomeIcon className="fa-2x text-purple-500" icon={faCircleUser} />
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                <ul className="py-2 text-sm text-gray-700">
                  <Link to="/dashboard">
                    <li>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Dashboard</button>
                    </li>
                  </Link>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Header;
