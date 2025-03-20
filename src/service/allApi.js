import { commonApi } from "./commonApi"
import { serverUrl } from "./serviceUrl"

// register request
export const requestApi = async(reqBody)=>{
    return await commonApi ('POST', `${serverUrl}/register`,reqBody,"")
}

// Login request
export const loginApi = async(reqBody)=>{
    return await commonApi ('POST', `${serverUrl}/login`,reqBody,"")
}

export const addPostApi = async (reqBody, reqHeader) => {
    return await commonApi("POST", `${serverUrl}/add-post`, reqBody, reqHeader);
};

// get all posts
export const allPostApi = async(searchKey,reqHeader)=>{
    return await commonApi("GET",`${serverUrl}/all-post?search=${searchKey}`,"",reqHeader)
}

// get user posts

export const userPostAPI = async(reqHeader)=>{
  return await commonApi("GET",`${serverUrl}/user-post`,"",reqHeader)
}
// get delete posts

export const userRemoveAPi = async(id,reqHeader)=>{
  return await commonApi("DELETE",`${serverUrl}/remove-post/${id}`,{},reqHeader)
}

// update user posts
export const updateUserPostApi= async (id, reqBody , reqHeader)=>{
  return await commonApi("PUT",`${serverUrl}/update-post/${id}`,reqBody,reqHeader)
}

export const likePostApi = async (id, reqHeader) => {
  return await commonApi("PATCH", `${serverUrl}/posts/${id}/like`, {}, reqHeader);
};
// add commenst
export const addCommentApi = async (postId, content, reqHeader) => {
  // Make a POST request to the API for adding a comment
  return await commonApi("POST", `${serverUrl}/comment/${postId}`, content , reqHeader);
};

export const getCommentsApi = async (postId, reqHeader) => {
  return await commonApi("GET", `${serverUrl}/postcomments/${postId}`, null, reqHeader);
};

export const setPubllicStatusapi = async (postId,status,reqheader)=>{
  return await commonApi("PUT",`${serverUrl}/statusupdate/${postId}`,status,reqheader)
}

// add post views

export const viewPostApi  = async (id,reqHeader)=>{
  return await commonApi("PATCH", `${serverUrl}/posts/${id}/postview`, {}, reqHeader);
}

// get all  users

export const getUserApi = async(reqBody,reqHeader)=>{
  return await commonApi("get",`${serverUrl}/users`,reqBody,reqHeader)
}

// unblock user
export const unBlockApi = async(id,reqHeader)=>{
  return await commonApi("PUT",`${serverUrl}/unblock-user/${id}`,{},reqHeader)
}

// Block User
export const blockUserApi = async (id) => {
  return await commonApi("PUT", `${serverUrl}/block-user/${id}`);
};
