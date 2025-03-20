import React, { useContext, useEffect, useState } from 'react';
import AddPost from '../components/AddPost';
import Header from '../components/Header';
import { faAngleDown, faAngleUp, faComment, faHeart, faEyeSlash, faTrash, faEye, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditPost from '../components/EditPost';
import { Button } from '@material-tailwind/react';
import Comments from '../components/Comments';
import { setPubllicStatusapi, userPostAPI, userRemoveAPi } from '../service/allApi';
import { addResponseContext, editProjectResponse } from '../context/ContextShare';
import { toast } from 'react-toastify';
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";

function Dashboard() {
  const [userPosts, setUserPosts] = useState([]);
  const [showMoreState, setShowMoreState] = useState({});
  const [showCommentsState, setShowCommentsState] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false); // New state to trigger re-fetch

  const { addResponse } = useContext(addResponseContext);
  const { editResponse } = useContext(editProjectResponse);

  const userData = sessionStorage.getItem("existingUsers");
  const user = userData ? JSON.parse(userData) : null;
  const username = user?.username || "Anonymous User";
  const email = user?.email || "user@example.com";

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      try {
        const result = await userPostAPI(reqHeader);
        setUserPosts(result.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [refreshTrigger, addResponse, editResponse]);

  // Handle post deletion
  const handleDelete = async (id) => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      try {
        const result = await userRemoveAPi(id, reqHeader);
        if (result.status === 200) {
          toast.success("Post deleted successfully");
          setRefreshTrigger(prev => !prev); // Trigger re-fetch
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Error deleting post");
      }
    }
  };

  // Toggle Public Status
  const togglePublicStatus = async (postId, currentStatus) => {
    const newStatus = !currentStatus;
    const status = { Public: newStatus };

    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const result = await setPubllicStatusapi(postId, status, reqHeader);
        if (result.status === 200) {
          toast.success(`Post is now ${newStatus ? "Public" : "Private"}`);
          setRefreshTrigger(prev => !prev); // Trigger re-fetch
        } else {
          toast.error("Failed to update visibility status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating status");
      }
    }
  };
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const confirmDelete = (id) => {
    setSelectedPostId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedPostId) {
      handleDelete(selectedPostId);
    }
    setOpenDeleteModal(false);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="lg:container lg:mx-auto lg:px-72">
          <div className="flex relative max-w-xl p-3 justify-end mx-auto">
            <AddPost refreshPosts={() => setRefreshTrigger(prev => !prev)} /> {/* Pass function to trigger refresh */}
          </div>
          <div className="max-w-4xl mx-auto py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center -mt-16 sm:-mt-20">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="w-16 h-16 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-2xl mt-5 text-gray-900 font-bold">{username}</h1>
                    <p className="text-gray-600 mt-4">{email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Posts */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">My Posts</h2>
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post, index) => {
                    const postId = post._id || `post-${index}`;
                    const showMore = showMoreState[postId] || false;
                    const showComments = showCommentsState[postId] || false;
                    const description = post.content || "";
                    const shouldShowMoreButton = description.length > 50;

                    return (
                      <div key={postId} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold">{post.title}</h3>

                        {/* Post Content */}
                        <div className='relative'>
                          <p className="text-gray-700 mb-4">
                            {showMore ? description : `${description.substring(0, 50)}...`}
                          </p>
                          {shouldShowMoreButton && (
                            <button
                              className="text-blue-500"
                              onClick={() => setShowMoreState(prev => ({ ...prev, [postId]: !showMore }))}
                            >
                              {showMore ? "Show Less" : "Show More"}
                              <FontAwesomeIcon icon={showMore ? faAngleUp : faAngleDown} style={{ color: "#165eda" }} />
                            </button>
                          )}
                        </div>

                        {/* Post Actions */}

                        <div className="flex items-center justify-between text-gray-500 mt-4 text-sm">
                          <div className="flex space-x-3">
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-gray-500 text-2xl cursor-pointer hover:text-pink-600 transition"
                            />
                            <span className="ml-1">{post.likes || 0} likes</span>
                            <FontAwesomeIcon
                              icon={faComment}
                              className="text-gray-600 text-2xl cursor-pointer hover:text-blue-500 transition"
                              onClick={() => setShowCommentsState((prev) => ({ ...prev, [postId]: !showComments }))}
                            />
                          </div>

                          <div className="flex space-x-3">
                            <EditPost post={post} />
                            <Button className="bg-purple-500 hover:bg-purple-600 transition" onClick={() => confirmDelete(postId)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            <FontAwesomeIcon
                              icon={post.public ? faEye : faEyeSlash}
                              className="text-gray-700 cursor-pointer text-xl hover:text-blue-500 transition"
                              onClick={() => togglePublicStatus(postId, post.public)}
                            />
                          </div>
                        </div>

                        {/* Delete Confirmation Modal */}
                        <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)}>
                          <DialogBody className="text-center text-gray-700 text-lg">
                            Are you sure you want to delete this post permentantily?
                          </DialogBody>
                          <DialogFooter className="flex justify-center space-x-3">
                            <Button variant="outlined" color="gray" onClick={() => setOpenDeleteModal(false)}>
                              Cancel
                            </Button>
                            <Button color="red" onClick={handleDeleteConfirmed}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </Dialog>

                        {showComments && <Comments postId={postId} />}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No posts available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
