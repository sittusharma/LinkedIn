import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoSearchSharp, IoNotificationsSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { UserDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [activeSearch, setActiveSearch] = useState(false);
  const { userData, setUserData, handleGetProfile } =
    useContext(UserDataContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSignOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchData([]);
      return;
    }
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${encodeURIComponent(
          searchInput
        )}`,
        { withCredentials: true }
      );
      setSearchData(result.data);
    } catch (error) {
      setSearchData([]);
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchInput]);

  return (
    <nav className="nav-wrapper">
      {/* Left: logo / home */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo2} alt="Logo" className="nav-logo" />
        <TiHome className="nav-icon" />
      </div>

      {/* Center: search */}
      <div className="nav-center">
        <div
          className={`nav-search ${activeSearch ? "nav-search-active" : ""}`}
        >
          <IoSearchSharp className="nav-icon" />
          <input
            type="text"
            value={searchInput}
            onFocus={() => setActiveSearch(true)}
            onBlur={() => setActiveSearch(false)}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users..."
          />
        </div>

        {activeSearch && searchData.length > 0 && (
          <div className="nav-search-results">
            {searchData.map((user) => (
              <div
                key={user._id}
                className="nav-search-item"
                onMouseDown={() => {
                  navigate(`/profile/${user._id}`);
                  setSearchInput("");
                }}
              >
                <img
                  src={user.profilePic || dp}
                  alt={user.name}
                  className="nav-search-avatar"
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="nav-right">
        <IoNotificationsSharp className="nav-icon" />

        <div className="nav-user" onClick={() => setShowPopup((p) => !p)}>
          <img
            src={userData?.profilePic || dp}
            alt={userData?.name || "User"}
            className="nav-avatar"
          />
        </div>

        {showPopup && (
          <div className="nav-popup" onMouseLeave={() => setShowPopup(false)}>
            <button
              className="nav-popup-item"
              onClick={() => {
                handleGetProfile && handleGetProfile();
                navigate("/profile");
              }}
            >
              <FaUserGroup className="nav-icon" />
              <span>Profile</span>
            </button>
            <button className="nav-popup-item" onClick={handleSignOut}>
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
