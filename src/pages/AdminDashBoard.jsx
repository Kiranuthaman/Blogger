import React, { useState, useEffect, useContext } from 'react';
import { getUserApi, unBlockApi } from '../service/allApi';
import AdminHeader from '../components/AdminHeader';
import { loginresponseContext } from '../context/ContextShare';

function AdminDashBoard() {
  const { loginResponse, setLoginResponse } = useContext(loginresponseContext); 
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Check if the token exists in sessionStorage
    const token = sessionStorage.getItem('token');
    
    // If a token is found, set loginResponse to true
    if (token && !loginResponse?.isLoggedIn) {
      setLoginResponse({ isLoggedIn: true });
    }

    // Fetch users only if the user is logged in
    if (loginResponse?.isLoggedIn) {
      const fetchUsers = async () => {
        try {
          const response = await getUserApi();
          if (response.status === 200) {
            setUsers(response.data);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, [loginResponse, setLoginResponse]);

  // Handle Unblock User
  const handleUnblock = async (id) => {
    try {
      const response = await unBlockApi(id);
      if (response.status === 200) {
        setUsers(users.map(user => 
          user._id === id ? { ...user, isBlocked: false, failedAttempts: 0 } : user
        ));
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  // If the user is not logged in (no token or loginResponse is false), show a message
  if (!loginResponse?.isLoggedIn) {
    return <div>You must be logged in to view this page.</div>; // Or you can redirect to a login page
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AdminHeader />
      <h1 className="text-2xl mt-4 font-bold mb-4 text-center">Admin Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user => user.role !== "admin") // Exclude admin users
              .map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="border p-2 whitespace-nowrap">{user.username}</td>
                  <td className="border p-2 whitespace-nowrap">{user.email}</td>
                  <td className={`border p-2 ${user.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </td>
                  <td className="border p-2">
                    {user.isBlocked ? (
                      <button 
                        className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-700 w-full md:w-auto"
                        onClick={() => handleUnblock(user._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <span className="text-gray-500">Active</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashBoard;
