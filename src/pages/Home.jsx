import React, { useContext, useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import UserCard from "../components/UserCard";
import PopularPost from "../components/PopularPost";
import { allPostApi, likePostApi } from "../service/allApi";
import { likePostResponse } from "../context/ContextShare";

const Home = () => {
  const [allPost, setAllPost] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const { likResponse, setLikeResponse } = useContext(likePostResponse);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const getAllPost = useCallback(async () => {
    if (!isLoggedIn) return;
  
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const result = await allPostApi(searchKey, reqHeader);
  
      const filteredPosts = result.data
        .filter((post) => post.public) // Show only public posts
        .sort((a, b) => b.postViews - a.postViews) // Sort by postViews (highest first)
        .slice(3); // Skip first 3 posts
  
      setAllPost(filteredPosts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [searchKey, likResponse, isLoggedIn]);
  
  

  useEffect(() => {
    getAllPost();
  }, [getAllPost]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  

  // Handle Like
  const handleLike = async (postId) => {
    if (!isLoggedIn) return;
  
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await likePostApi(postId, reqHeader);
      if (response?.data) {
        setLikeResponse(response.data); // Update like response globally
        setAllPost((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? { ...p, likes: response.data.likes } : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  

  // Pagination Logic
  const totalPages = Math.ceil(allPost.length / postsPerPage);
  const currentPosts = allPost.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6">
        <header className="text-center mt-6">
          <h2 className="text-4xl font-bold text-gray-900">
            Your Destination for Knowledge and Growth
          </h2>
          <p className="text-gray-600 mt-2">
            Discover insights, tips, and trends to fuel your creativity and success.
          </p>
        </header>

        {/* Search Input (Visible only if logged in) */}
        {isLoggedIn ? (
          <div className="flex justify-center mt-4">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="border rounded-full px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-red-500 font-semibold">
            <p>
              Please <a href="/login" className="text-blue-500 underline">login</a> to view all posts and search.
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center text-gray-500 my-6 animate-pulse">Loading posts...</div>
        ) : (
          <>
{isLoggedIn && currentPage === 1 && <PopularPost />}

            {/* Display Posts in a Single Column */}
            {currentPosts.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Posts For You</h3>
                <div className="flex flex-col items-center gap-6">
                  {currentPosts.map((post) => (
                    <UserCard key={post._id} post={post} handleLike={handleLike} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-6">
                <h1 className="text-5xl font-bold">No posts found.</h1>
              </div>
            )}

            {/* Pagination Controls */}
            {isLoggedIn && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage >= totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
