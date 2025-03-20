import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi, requestApi } from '../service/allApi';
import { ToastContainer, toast } from 'react-toastify';
import { loginresponseContext } from '../context/ContextShare';

function Auth({ register }) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { setLoginResponse } = useContext(loginresponseContext);

  console.log(userDetails);

  const navigate = useNavigate();

  // Register function
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form reload

    const { username, email, password } = userDetails;
    if (!username || !email || !password) {
      toast.info("Fill the form completely");
    } else {
      try {
        const result = await requestApi(userDetails);
        console.log(result);

        if (result.status === 200) {
          // If account is blocked, show warning and prevent further actions
          if (result.data.existingUsers.isBlocked) {
            toast.warning('Your account is blocked. Please contact support.');
            return;
          }

          toast.success('Registration Successful');

          setUserDetails({
            username: "",
            email: "",
            password: ""
          });

          navigate("/login");
        } else if (result.status === 406) {
          toast.error("Email already in use");
        } else {
          toast.error('Something went wrong');
        }
      } catch (error) {
        console.error(error);
        toast.error("Server Error. Try again later.");
      }
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form reload

    const { email, password } = userDetails;
    if (!email || !password) {
      toast.info('Fill the form completely');
    } else {
      try {
        const result = await loginApi({ email, password });

        if (result.status === 200) {
          // Check if the account is blocked
          if (result.data.existingUsers.isBlocked) {
            toast.warning('Your account is blocked. Please contact support.');
            return;
          }

          toast.success('Login successful');
          setLoginResponse(true);

          setUserDetails({
            username: "",
            email: "",
            password: ""
          });

          sessionStorage.setItem("existingUsers", JSON.stringify(result.data.existingUsers));
          sessionStorage.setItem("token", result.data.token);

          const userRole = result.data.existingUsers.role; // Get user role

          setTimeout(() => {
            if (userRole === "admin") {
              navigate("/admin"); // Navigate to admin page
            } else {
              navigate("/"); // Navigate to user homepage
            }
          }, 2000);

        } else if (result.status === 406) {
          toast.error('Incorrect password or email');
        } else {
          toast.error('Something went wrong');
        }
      } catch (error) {
        console.error(error);
        toast.error("Server Error. Try again later.");
      }
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 p-10 bg-white shadow-lg rounded-lg w-full max-w-3xl">

        {/* Image Section */}
        <div className="hidden md:block">
          <img className="w-60 p-5" src="https://cdn-icons-png.flaticon.com/512/10026/10026257.png" alt="Icon" />
        </div>

        {/* Authentication Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {register ? "Create an Account" : "Welcome Back"}
          </h2>

          <form className="space-y-4">
            {register && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={userDetails.password}
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                required
              />
            </div>

            {register ? (
              <button
                onClick={handleRegister}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )}
          </form>

          {/* Fixed Links (No Nested <a> Tags) */}
          {register ? (
            <p className="text-sm text-gray-600 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
          ) : (
            <p className="text-sm text-gray-600 mt-3">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
          )}

          <p className="text-sm text-gray-600 mt-3">
            Go Back{" "}
            <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}

export default Auth;
