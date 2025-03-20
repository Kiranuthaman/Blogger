import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import { addPostApi } from "../service/allApi";
import { addResponseContext } from "../context/ContextShare";

function AddPost() {
   const {setAddResponse} = useContext(addResponseContext)
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem("token") || ""); // Get token initially
  const [postDetails, setPostDetails] = useState({
    title: "",
    content: "",
    postImg: null,
  });

  // Fetch token when component mounts or when sessionStorage updates
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleOpen = () => setOpen(!open);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setPostDetails({ ...postDetails, postImg: file });
  };

  useEffect(() => {
    if (postDetails.postImg) {
      setPreview(URL.createObjectURL(postDetails.postImg));
    } else {
      setPreview("");
    }
  }, [postDetails.postImg]);

  const handleAdd = async () => {
    try {
      const currentToken = sessionStorage.getItem("token"); // Get the latest token
      if (!currentToken) {
        toast.warning("Please log in first");
        return;
      }

      const { title, content, postImg } = postDetails;
      if (!title || !content || !postImg) {
        toast.info("Fill the form completely");
        return;
      }

      const reqBody = new FormData();
      reqBody.append("title", title);
      reqBody.append("content", content);
      reqBody.append("postImg", postImg);

      const reqHeader = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${currentToken}`,
      };

      const result = await addPostApi(reqBody, reqHeader);

      if (result?.status === 200) {
        toast.success("Post added successfully!");
        setAddResponse(result)
        setTimeout(() => {
          setOpen(false); // Ensure modal closes
          setPostDetails({ title: "", content: "", postImg: null }); // Clear form
          setPreview(""); // Reset preview image
        }, 2000);
      }else if(result?.status === 400) {
        toast.error("Cannot add a inaproperate word");
        setTimeout(() => {
          setOpen(false); // Ensure modal closes
          setPostDetails({ title: "", content: "", postImg: null }); // Clear form
          setPreview(""); // Reset preview image
        }, 2000);
      }else if (result?.status === 406) {
        toast.warning(result.response?.data || "Invalid request");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Failed to add post");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} className="bg-blue-500">
        Add Post
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="text-blue-500">Add Your Post</DialogHeader>
        <DialogBody>
          <div className="container">
            <div className="grid grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center">
                <label htmlFor="postImg" className="cursor-pointer">
                  <input
                    type="file"
                    id="postImg"
                    onChange={handleFile}
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg"
                  />
                  <img
                    className="w-52"
                    src={
                      preview
                        ? preview
                        : "https://www.freeiconspng.com/thumbs/person-icon-blue/person-icon-blue-18.png"
                    }
                    alt="Preview"
                  />
                </label>
              </div>

              {/* Post Details */}
              <div className="ms-3">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={postDetails.title}
                    onChange={(e) =>
                      setPostDetails({ ...postDetails, title: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="mt-3">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={postDetails.content}
                    onChange={(e) =>
                      setPostDetails({
                        ...postDetails,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                    placeholder="Write your post content..."
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleOpen} className="mr-1 bg-purple-500">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={handleAdd}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}

export default AddPost;