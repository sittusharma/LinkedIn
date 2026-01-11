import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav.jsx'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi"
import { UserDataContext } from '../context/UserContext.jsx'
import { HiPencil } from "react-icons/hi2"
import EditProfile from '../components/EditProfile.jsx'
import { RxCross1 } from "react-icons/rx"
import { BsImage } from "react-icons/bs"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import Post from '../components/Post.jsx'

function Home() {
  const {
    userData,
    edit,
    setEdit,
    postData,
    getPost,
    handleGetProfile
  } = useContext(UserDataContext)

  const { serverUrl } = useContext(authDataContext)

  const [frontendImage, setFrontendImage] = useState("")
  const [backendImage, setBackendImage] = useState("")
  const [description, setDescription] = useState("")
  const [uploadPost, setUploadPost] = useState(false)
  const [posting, setPosting] = useState(false)
  const [suggestedUser, setSuggestedUser] = useState([])

  const image = useRef()

  function handleImage(e) {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      const formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) {
        formdata.append("image", backendImage)
      }

      await axios.post(
        `${serverUrl}/api/post/create`,
        formdata,
        { withCredentials: true }
      )

      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)   // ✅ FIXED TYPO
      console.log(error)
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/suggestedusers`,
        { withCredentials: true }
      )
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
  }, [serverUrl])

  useEffect(() => {
    getPost()
  }, [uploadPost, getPost])

  if (!userData) return null   // ✅ Prevent crash

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px]'>

      {edit && <EditProfile />}
      <Nav />

      {/* LEFT PROFILE */}
      <div className='w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-[10px] relative'>
        <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.coverImage || ""} alt="" className='w-full' />
          <FiCamera className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white' />
        </div>

        <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[35px]' onClick={() => setEdit(true)}>
          <img src={userData.profileImage || dp} alt="" className='h-full' />
        </div>

        <div className='mt-[30px] pl-[20px] font-semibold text-gray-700'>
          <div className='text-[22px]'>{userData.firstName} {userData.lastName}</div>
          <div className='text-[18px] text-gray-600'>{userData.headline || ""}</div>
          <div className='text-[16px] text-gray-500'>{userData.location}</div>
        </div>

        <button className='w-full h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
          Edit Profile <HiPencil />
        </button>
      </div>

      {/* POSTS */}
      <div className='w-full lg:w-[50%] flex flex-col gap-[20px]'>
        {postData.map(post => (
          <Post
            key={post._id}   // ✅ better key
            {...post}
          />
        ))}
      </div>

      {/* SUGGESTED USERS */}
      <div className='w-full lg:w-[25%] bg-white shadow-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>

        {suggestedUser.length === 0 && <div>No Suggested Users</div>}

        {suggestedUser.map(su => (
          <div key={su._id} className='flex items-center gap-[10px] mt-[10px] cursor-pointer hover:bg-gray-200 rounded-lg p-[5px]' onClick={() => handleGetProfile(su.userName)}>
            <img src={su.profileImage || dp} className='w-[40px] h-[40px] rounded-full' />
            <div>
              <div className='text-[19px] font-semibold'>{su.firstName} {su.lastName}</div>
              <div className='text-[12px]'>{su.headline}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Home
