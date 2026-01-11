import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext.jsx'
import axios from "axios"
import { UserDataContext } from '../context/UserContext.jsx'

function Login() {
  const [show, setShow] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("")
    setSuccess("")

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )

      setUserData(result.data)
      setSuccess("Login successful!")
      setEmail("")
      setPassword("")

      // Redirect after 1 second
      setTimeout(() => navigate("/"), 1000)
    } catch (error) {
      console.error("Login Error:", error)
      if (error.response) {
        setErr(
          error.response.data.message || error.response.data.error || JSON.stringify(error.response.data)
        )
      } else if (error.request) {
        setErr("No response from server. Please check your network or server.")
      } else {
        setErr(error.message || "Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-[10px]'>

      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="logo" />
      </div>

      <form
        className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]'
        onSubmit={handleSignIn}
        autoComplete="off"
      >
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign In</h1>

        <input
          type="email"
          placeholder='Email'
          required
          className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] rounded-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <div className='w-full h-[50px] border-2 border-gray-600 rounded-md relative'>
          <input
            type={show ? "text" : "password"}
            placeholder='Password'
            required
            className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] rounded-md'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span
            className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold'
            onClick={() => setShow(prev => !prev)}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        {err && <p className='text-center text-red-500'>{err}</p>}
        {success && <p className='text-center text-green-600'>{success}</p>}

        <button
          className='w-full h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white disabled:opacity-50'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className='text-center cursor-pointer mt-[10px]' onClick={() => navigate("/signup")}>
          Want to create a new account? <span className='text-[#2a9bd8]'>Sign Up</span>
        </p>
      </form>
    </div>
  )
}

export default Login
