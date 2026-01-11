import React, { useContext, useRef, useState, useEffect } from 'react'
import { RxCross1 } from "react-icons/rx"
import { UserDataContext } from '../context/UserContext.jsx'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'

function EditProfile() {
  let { edit, setEdit, userData, setUserData, edit2, setEdit2 } =
    useContext(UserDataContext)

  let { serverUrl } = useContext(authDataContext)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [headline, setHeadline] = useState("")
  const [location, setLocation] = useState("")
  const [gender, setGender] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkills, setNewSkills] = useState("")
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])

  const [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: ""
  })

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: ""
  })

  const [frontendProfileImage, setFrontendProfileImage] = useState(dp)
  const [backendProfileImage, setBackendProfileImage] = useState(null)
  const [frontendCoverImage, setFrontendCoverImage] = useState(null)
  const [backendCoverImage, setBackendCoverImage] = useState(null)
  const [saving, setSaving] = useState(false)

  const profileImage = useRef()
  const coverImage = useRef()

  // ✅ safely load userData
  useEffect(() => {
    if (!userData) return

    setFirstName(userData.firstName || "")
    setLastName(userData.lastName || "")
    setUserName(userData.userName || "")
    setHeadline(userData.headline || "")
    setLocation(userData.location || "")
    setGender(userData.gender || "")
    setSkills(userData.skills || [])
    setEducation(userData.education || [])
    setExperience(userData.experience || [])
    setFrontendProfileImage(userData.profileImage || dp)
    setFrontendCoverImage(userData.coverImage || null)
  }, [userData])

  function handleProfileImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let formdata = new FormData()
      formdata.append("firstName", firstName)
      formdata.append("lastName", lastName)
      formdata.append("userName", userName)
      formdata.append("headline", headline)
      formdata.append("location", location)
      formdata.append("gender", gender)
      formdata.append("skills", JSON.stringify(skills))
      formdata.append("education", JSON.stringify(education))
      formdata.append("experience", JSON.stringify(experience))

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage)
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage)
      }

      let result = await axios.put(
        `${serverUrl}/api/user/updateprofile`,
        formdata,
        { withCredentials: true }
      )

      setUserData(result.data)
      setEdit(false)
    } catch (error) {
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <button
      className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white'
      disabled={saving}
      onClick={handleSaveProfile}
    >
      {saving ? "saving..." : "Save Profile"}
    </button>
  )
}

export default EditProfile
