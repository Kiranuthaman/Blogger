import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // ✅ FontAwesome import
import Header from "../components/Header";
import { serverUrl } from "../service/serviceUrl";
import { getCommentsApi } from "../service/allApi";

function CardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState(null);

  if (!post) {
    return <p className="text-center text-gray-500 mt-10">No post data available.</p>;
  }

  useEffect(() => {
    if (post?._id) {
      getAllComments();
    }
  }, [post?._id, newComment]);

  const getAllComments = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("User not logged in");
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await getCommentsApi(post._id, reqHeader);
      setAllComments(result.data?.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="lg:container lg:mx-auto lg:px-72">

          {/* 🔹 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {/* ✅ FontAwesome Icon */}
            <span>Back</span>
          </button>

          <div className="mt-8">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`${serverUrl}/upload/${post.postImg}`}
                className="w-full h-full object-cover"
                alt={post.title || "Post Image"}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* 🔹 Comments Section */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Comments</h3>
                  <div className="space-y-4 mt-5">
                    {allComments.length > 0 ? (
                      allComments.map((comment, index) => (
                        <div key={index} className="bg-gray-200 p-4 rounded-lg">
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardPage;
