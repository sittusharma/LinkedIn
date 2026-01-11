import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext.jsx";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";

function Login() {
  const { serverUrl } = useContext(authDataContext);
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const data = error.response.data;
        setErr(data.message || data.error || JSON.stringify(data));
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
      <div className="p-6 w-full h-[80px] flex items-center">
        <img src={logo} alt="logo" />
      </div>

      <form
        className="w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-4 p-4"
        onSubmit={handleSignIn}
      >
        <h1 className="text-gray-800 text-2xl font-semibold mb-6">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full h-12 border-2 border-gray-600 px-4 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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

        {err && <p className="text-center text-red-500 mt-2">{err}</p>}

        <button
          className="w-full h-12 rounded-full bg-blue-400 mt-6 text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-center mt-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-blue-500 font-semibold">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
