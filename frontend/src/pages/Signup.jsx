import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";

function Signup() {
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // Handle signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { firstName, lastName, userName, email, password },
        { withCredentials: true }
      );

      // Signup successful
      setSuccess(response.data.message);

      // Clear form
      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");

      // Redirect to login after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup error:", error);
      // Show real backend error
      if (error.response) {
        setErr(error.response.data.message || "Signup failed");
      } else if (error.request) {
        setErr("No response from server. Please check your network.");
      } else {
        setErr(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-start gap-4">
      {/* Logo */}
      <div className="p-6 w-full h-[80px] flex items-center">
        <img src={logo} alt="logo" />
      </div>

      {/* Signup Form */}
      <form
        className="w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-4 p-4"
        onSubmit={handleSignUp}
      >
        <h1 className="text-gray-800 text-2xl font-semibold mb-6">Sign Up</h1>

        {/* First Name */}
        <input
          type="text"
          placeholder="First Name"
          required
          className="w-full h-12 border-2 border-gray-600 px-4 rounded-md"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder="Last Name"
          required
          className="w-full h-12 border-2 border-gray-600 px-4 rounded-md"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          required
          className="w-full h-12 border-2 border-gray-600 px-4 rounded-md"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full h-12 border-2 border-gray-600 px-4 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="w-full h-12 border-2 border-gray-600 rounded-md relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full h-full border-none px-4 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-4 top-3 text-blue-500 cursor-pointer font-semibold"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Error Message */}
        {err && <p className="text-center text-red-500 mt-2">{err}</p>}

        {/* Success Message */}
        {success && <p className="text-center text-green-600 mt-2">{success}</p>}

        {/* Submit Button */}
        <button
          className="w-full h-12 rounded-full bg-blue-400 mt-6 text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Redirect to Login */}
        <p
          className="text-center mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account?{" "}
          <span className="text-blue-500 font-semibold">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
