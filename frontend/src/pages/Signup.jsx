import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { UserDataContext } from '../context/UserContext'

function Signup() {
  const [show, setShow] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("") // New state for success message

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("")
    setSuccess("") // Clear previous messages

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { firstName, lastName, userName, email, password },
        { withCredentials: true }
      )

      console.log("Signup success:", result.data)
      setUserData(result.data)

      // Show success message
      setSuccess("You have successfully signed up!")

      // Clear form fields
      setFirstName("")
      setLastName("")
      setUserName("")
      setEmail("")
      setPassword("")

      // Redirect to login after 2 seconds so user can see message
      setTimeout(() => {
        navigate("/login")
      }, 2000)
      
    } catch (error) {
      console.error("Signup Error:", error)

      if (error.response) {
        setErr(error.response.data.message || `Error: ${error.response.status}`)
      } else if (error.request) {
        setErr("No response from server. Please check your network or server status.")
      } else {
        setErr(error.message || "Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center gap-[10px]'>
      {/* Logo */}
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="logo" />
      </div>

      {/* Signup Form */}
      <form
        className='w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-[15px] p-[15px]'
        onSubmit={handleSignUp}
        autoComplete="off"
      >
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[20px]'>Sign Up</h1>

        {/* First Name */}
        <input
          type="text"
          placeholder='First Name'
          required
          className='w-full h-[50px] border-2 border-gray-600 text-[18px] px-[20px] rounded-md'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder='Last Name'
          required
          className='w-full h-[50px] border-2 border-gray-600 text-[18px] px-[20px] rounded-md'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
        />

        {/* Username */}
        <input
          type="text"
          placeholder='Username'
          required
          className='w-full h-[50px] border-2 border-gray-600 text-[18px] px-[20px] rounded-md'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="username"
        />

        {/* Email */}
        <input
          type="email"
          placeholder='Email'
          required
          className='w-full h-[50px] border-2 border-gray-600 text-[18px] px-[20px] rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        {/* Password */}
        <div className='w-full h-[50px] border-2 border-gray-600 rounded-md relative'>
          <input
            type={show ? "text" : "password"}
            placeholder='Password'
            required
            className='w-full h-full border-none text-[18px] px-[20px] rounded-md'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <span
            className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold'
            onClick={() => setShow(prev => !prev)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        {/* Error Message */}
        {err && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-center">
            {err}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-center">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          className='w-full h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white disabled:opacity-50'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Link to Login */}
        <p
          className='text-center cursor-pointer mt-[10px]'
          onClick={() => navigate("/login")}
        >
          Already have an account? <span className='text-[#2a9bd8]'>Sign In</span>
        </p>
      </form>
    </div>
  )
}

export default Signup
