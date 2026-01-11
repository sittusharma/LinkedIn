import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from "../context/AuthContext.jsx"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client"

export const UserDataContext = createContext(null)

export const socket = io("https://linkedin-backend-wmse.onrender.com")

function UserContext({ children }) {
  const [userData, setUserData] = useState(null)
  const { serverUrl } = useContext(authDataContext)
  const [edit, setEdit] = useState(false)
  const [postData, setPostData] = useState([])
  const [profileData, setProfileData] = useState(null)

  const navigate = useNavigate()

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/currentuser`,
        { withCredentials: true }
      )
      setUserData(result.data)
    } catch (error) {
      console.log(error)
      setUserData(null)
    }
  }

  const getPost = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/post/getpost`,
        { withCredentials: true }
      )
      setPostData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/profile/${userName}`,
        { withCredentials: true }
      )
      setProfileData(result.data)
      navigate("/profile")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCurrentUser()
    getPost()
  }, [serverUrl])

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
