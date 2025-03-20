import React, { createContext, useState } from 'react'
export const addResponseContext = createContext ({})
export const editProjectResponse = createContext({})
export const likePostResponse = createContext({})
export const loginresponseContext=createContext({})
function ContextShare({children}) {
    const [addResponse, setAddResponse] = useState([])
    const [editResponse,setEditResponse] = useState([])
    const [likeResponse,setLikeResponse] = useState([])
    const [loginResponse,setLoginResponse]=useState("")
  return (
    <>
    <addResponseContext.Provider value={{addResponse,setAddResponse}}>
      <editProjectResponse.Provider value={{editResponse,setEditResponse}}>
        <likePostResponse.Provider value={{likeResponse,setLikeResponse}}>
          <loginresponseContext.Provider value={{loginResponse,setLoginResponse}}>
        {children}
      </loginresponseContext.Provider>
        </likePostResponse.Provider>   
        </editProjectResponse.Provider>  
    </addResponseContext.Provider>
    </>
  )
}

export default ContextShare