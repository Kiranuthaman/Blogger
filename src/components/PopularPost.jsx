import React, { useEffect, useState, useCallback } from "react";
import { allPostApi } from "../service/allApi";
import UserCard from "./UserCard";

function PopularPost() {
  const [popularPosts, setPopularPosts] = useState([]);

  // Fetch most viewed posts
  const getPopularPosts = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const result = await allPostApi("", reqHeader);
      if (!result?.data) return;

      const sortedPosts = result.data
        .filter((post) => post.public)
        .sort((a, b) => b.postViews - a.postViews) 
        .slice(0, 3); 

      setPopularPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching popular posts:", error);
    }
  }, []);

  useEffect(() => {
    getPopularPosts();
  }, [getPopularPosts]);

  return (
    <div className="max-w-7xl mx-auto my-8 px-4">
      <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Popular Posts
      </h3>

      {/* For smaller screens, use a basic grid. For large screens, apply custom grid layout. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        {popularPosts.length > 0 ? (
          popularPosts.map((post, index) => (
            <div
              key={post._id}
              className={` bg-gradient-to-r text-white rounded-lg 
                ${index === 0 ? "lg:col-span-2" : ""}  // Make the first item span across both columns in large screen view`}
            >
              <UserCard key={post._id} post={post}  />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No popular posts found.</p>
        )}
      </div>
    </div>
  );
}

export default PopularPost;
