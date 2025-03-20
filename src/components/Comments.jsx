import { useState, useEffect } from 'react';
import { addCommentApi, getCommentsApi } from '../service/allApi';

function Comments({ postId }) {
  const [allComments, setAllComments] = useState([]); 
  const [comments, setComments] = useState({ content: "" });
  const [newComment, setNewComment] = useState(null); 

  // Fetch all comments when the component mounts or a new comment is added
  useEffect(() => {
    getAllComments();
  }, [postId, newComment]); 


  const getAllComments = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("User not logged in");
      return;
    }

    const reqHeader = {
      "Authorization": `Bearer ${token}`
    };

    try {
      const result = await getCommentsApi(postId, reqHeader);
      setAllComments(result.data.comments || []); 
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAdd = async () => {
    const { content } = comments;
    if (!content.trim()) {
      alert("Please add a comment");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to post a comment");
      return;
    }

    const reqHeader = {
      "Authorization": `Bearer ${token}`
    };
    const reqBody = { content };

    try {
      const result = await addCommentApi(postId, reqBody, reqHeader);
      setNewComment(result.data); 
      setComments({ content: "" }); 
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Something went wrong while adding your comment");
    }
  };

  return (
    <>
      <div className='mt-6'>
        <h3 className='text-xl font-semibold mb-4'>Comments</h3>

        <form className='mb-4'>
          <textarea
            onChange={(e) => setComments({ ...comments, content: e.target.value })}
            className='w-full p-3 border border-black rounded-lg resize-none'
            placeholder='Add a comment'
            rows={3}
            value={comments.content}
          />
        </form>

        <div className='flex justify-end'>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post Comment
          </button>
        </div>

        <div className="space-y-4 mt-5">
          {/* Display newly added comment if it exists */}
          {newComment && (
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                {/* <span className="font-semibold">You</span> */}
              </div>
              <p className="text-gray-700">{newComment.content}</p>
            </div>
          )}

          {/* Display fetched comments */}
          {allComments.length > 0 ? (
            allComments.map((comment, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Comments;
