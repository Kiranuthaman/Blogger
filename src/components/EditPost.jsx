import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { updateUserPostApi } from "../service/allApi";
import { serverUrl } from "../service/serviceUrl";
import { editProjectResponse } from "../context/ContextShare";

function EditPost({ post, Public }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [postDetails, setPostDetails] = useState({
    title: post.title,
    content: post.content,
    postImg: "",
    
  });
  const {setEditResponse} = useContext(editProjectResponse)


  const handleOpen = () => setOpen(!open);

  // Handle file selection
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostDetails({ ...postDetails, postImg: file });
    }
  };

  // Generate preview when image is selected
  useEffect(() => {
    if (postDetails.postImg) {
      setPreview(URL.createObjectURL(postDetails.postImg));
    }
  }, [postDetails.postImg]);

  // Handle post update
  const handleUpdate = async () => {
    const { title, content, postImg } = postDetails;
    if (!title || !content) {
      toast.info("Fill the form completely");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("title", title);
    reqBody.append("content", content);

    
    if (postImg) {
      reqBody.append("postImg", postImg);
    } else {
      reqBody.append("postImg", post.postImg);
    }

    const token = sessionStorage.getItem("token");
    const reqHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": postImg ? "multipart/form-data" : "application/json",
    };

    try {
      const result = await updateUserPostApi(post._id, reqBody, reqHeader);
      if (result.status === 200) {
        setEditResponse(result)
        toast.success("Post updated successfully");
        setTimeout(() => handleOpen(), 2000);
      } else {
        toast.warning(result.response?.data || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error updating post");
    }
  };

  return (
    <>
      <Button onClick={handleOpen} className="bg-blue-500">
        <FontAwesomeIcon icon={faPenToSquare} />
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="text-blue-500">Edit Your Post</DialogHeader>
        <DialogBody>
          <div className="container">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center">
                <label htmlFor="postImage" className="cursor-pointer">
                  <input type="file" id="postImage" className="hidden" onChange={handleFile} />
                  <img
                    className="w-52"
                    src={preview || `${serverUrl}/upload/${post.postImg}`}
                    alt="Preview"
                  />
                </label>
              </div>
              <div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title"
                    value={postDetails.title}
                    onChange={(e) => setPostDetails({ ...postDetails, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                    placeholder="Write your post content..."
                    value={postDetails.content}
                    onChange={(e) => setPostDetails({ ...postDetails, content: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleOpen} className="mr-1 bg-gray-400">
            <span>Cancel</span>
          </Button>
          <Button onClick={handleUpdate} className="bg-blue-500">
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default EditPost;
