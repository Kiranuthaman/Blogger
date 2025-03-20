import React, { useContext, useState } from "react";
import { faHeart, faComment, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { serverUrl } from "../service/serviceUrl";
import { likePostApi, viewPostApi } from "../service/allApi";
import Comments from "./Comments";
import { likePostResponse } from "../context/ContextShare";

function UserCard({ post, setPosts }) {
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { likeResponse, setLikeResponse } = useContext(likePostResponse);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  // Handle Like
  const handleLike = async (postId) => {
    if (hasLiked) return;

    try {
      console.log("Liking post with ID:", postId);

      // Update UI optimistically
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      );
      setHasLiked(true);

      // API Call
      const response = await likePostApi(postId, {
        headers: { "Content-Type": "application/json" },
      });

      if (response?.data?.post) {
        setLikeResponse(response.data.post);
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? response.data.post : p
          )
        );
      } else {
        throw new Error("Failed to update like count");
      }
    } catch (error) {
      console.error("Error liking post:", error);

      // Revert UI if API fails
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId ? { ...p, likes: (p.likes || 0) - 1 } : p
        )
      );
      setHasLiked(false);
    }
  };

  // Handle View
  const handleView = async (postId) => {
    if (hasViewed) return;
    try {
      console.log("Viewing post with ID:", postId);
      await viewPostApi(postId, {
        headers: { "Content-Type": "application/json" },
      });
      setHasViewed(true);
    } catch (error) {
      console.error("Error viewing post:", error);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden w-full max-w-2xl mx-auto">
      {/* Post Image */}
      <Link to={"/page"} state={{ post }} onClick={() => handleView(post._id)}>
        <img
          src={`${serverUrl}/upload/${post.postImg}`}
          className="w-full h-64 object-cover transition-transform transform hover:scale-105"
          alt={post.title || "Post Image"}
        />
      </Link>

      {/* Post Content */}
      <div className="p-6">
        <Link to={"/page"} state={{ post }}>
          <h2
            onClick={() => handleView(post._id)}
            className="text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {post.title}
          </h2>
        </Link>

        {/* Post Description */}
        <p className="text-gray-700 mt-3">
          {showMore ? post.content : `${post.content.substring(0, 100)}...`}
        </p>

        {/* Post Footer */}
        <div className="mt-4 flex justify-between items-center">
          {/* Like Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLike(post._id)}
              className={`text-gray-500 hover:text-pink-600 transition ${
                hasLiked ? "text-pink-600" : ""
              }`}
            >
              <FontAwesomeIcon icon={faHeart} className="text-2xl" />
            </button>
            <span className="text-gray-700">{post.likes || 0}</span>
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          >
            <FontAwesomeIcon icon={faComment} className="text-2xl" />
            <span>Comments</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && <Comments postId={post._id} />}
      </div>
    </article>
  );
}

export default UserCard;
