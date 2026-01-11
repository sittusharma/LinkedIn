import React, { useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext.jsx'
import axios from 'axios'
import io from "socket.io-client"
import { UserDataContext } from "../context/UserContext.jsx"
import { useNavigate } from 'react-router-dom'

const socket = io("https://linkedin-backend-wmse.onrender.com")

function ConnectionButton({ userId }) {
  let { serverUrl } = useContext(authDataContext)
  let { userData } = useContext(UserDataContext)
  let [status, setStatus] = useState("loading")
  let navigate = useNavigate()

  const handleSendConnection = async () => {
    try {
      let result = await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        { withCredentials: true }
      )
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveConnection = async () => {
    try {
      let result = await axios.delete(
        `${serverUrl}/api/connection/remove/${userId}`,
        { withCredentials: true }
      )
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetStatus = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/connection/getStatus/${userId}`,
        { withCredentials: true }
      )
      setStatus(result.data.status)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!userData?._id) return   // ✅ prevent crash

    socket.emit("register", userData._id)
    handleGetStatus()

    const statusHandler = ({ updatedUserId, newStatus }) => {
      if (updatedUserId === userId) {
        setStatus(newStatus)
      }
    }

    socket.on("statusUpdate", statusHandler)

    return () => {
      socket.off("statusUpdate", statusHandler)
    }
  }, [userId, userData, serverUrl])

  const handleClick = async () => {
    if (status === "disconnect") {
      await handleRemoveConnection()
    } else if (status === "received") {
      navigate("/network")
    } else {
      await handleSendConnection()
    }
  }

  return (
    <button
      className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'
      onClick={handleClick}
      disabled={status === "pending" || status === "loading"}
    >
      {status}
    </button>
  )
}

export default ConnectionButton
