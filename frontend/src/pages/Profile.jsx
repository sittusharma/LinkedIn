import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav.jsx'
import dp from "../assets/dp.webp"
import { UserDataContext } from '../context/UserContext.jsx'
import { HiPencil } from "react-icons/hi2"
import EditProfile from '../components/EditProfile.jsx'
import Post from '../components/Post.jsx'
import ConnectionButton from '../components/ConnectionButton.jsx'

function Profile() {

  const {
    userData,
    edit,
    setEdit,
    postData,
    profileData
  } = useContext(UserDataContext)

  const [profilePost, setProfilePost] = useState([])

  useEffect(() => {
    if (!profileData?._id) return

    setProfilePost(
      postData.filter(post => post.author._id === profileData._id)
    )
  }, [profileData, postData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
      <Nav />
      {edit && <EditProfile />}

      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>

        <div className='relative bg-white pb-[40px] rounded shadow-lg'>
          <div className='w-full h-[100px] bg-gray-400 overflow-hidden'>
            <img src={profileData?.coverImage || ""} alt="" className='w-full' />
          </div>

          <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[35px]'>
            <img src={profileData?.profileImage || dp} alt="" className='h-full' />
          </div>

          <div className='mt-[30px] pl-[20px] font-semibold text-gray-700'>
            <div className='text-[22px]'>
              {`${profileData?.firstName || ""} ${profileData?.lastName || ""}`}
            </div>
            <div className='text-[18px] text-gray-600'>{profileData?.headline || ""}</div>
            <div className='text-[16px] text-gray-500'>{profileData?.location}</div>
            <div className='text-[16px] text-gray-500'>
              {`${profileData?.connection?.length || 0} connection`}
            </div>
          </div>

          {profileData?._id === userData?._id && (
            <button
              className='min-w-[150px] h-[40px] my-[20px] ml-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center gap-[10px]'
              onClick={() => setEdit(true)}
            >
              Edit Profile <HiPencil />
            </button>
          )}

          {profileData?._id !== userData?._id && (
            <div className="ml-[20px] mt-[20px]">
              <ConnectionButton userId={profileData?._id} />
            </div>
          )}
        </div>

        <div className='w-full p-[20px] text-[22px] bg-white shadow-lg rounded-lg'>
          {`Post (${profilePost.length})`}
        </div>

        {profilePost.map(post => (
          <Post
            key={post._id}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
          />
        ))}

        {profileData?.skills?.length > 0 && (
          <div className='bg-white shadow-lg rounded-lg p-[20px]'>
            <div className='text-[22px] text-gray-600'>Skills</div>
            <div className='flex flex-wrap gap-[20px] p-[20px]'>
              {profileData.skills.map((skill, i) => (
                <div key={i} className='text-[20px]'>{skill}</div>
              ))}
            </div>
          </div>
        )}

        {profileData?.education?.length > 0 && (
          <div className='bg-white shadow-lg rounded-lg p-[20px]'>
            <div className='text-[22px] text-gray-600'>Education</div>
            {profileData.education.map((edu, i) => (
              <div key={i} className='mb-[20px]'>
                <div>College: {edu.college}</div>
                <div>Degree: {edu.degree}</div>
                <div>Field: {edu.fieldOfStudy}</div>
              </div>
            ))}
          </div>
        )}

        {profileData?.experience?.length > 0 && (
          <div className='bg-white shadow-lg rounded-lg p-[20px]'>
            <div className='text-[22px] text-gray-600'>Experience</div>
            {profileData.experience.map((ex, i) => (
              <div key={i} className='mb-[20px]'>
                <div>Title: {ex.title}</div>
                <div>Company: {ex.company}</div>
                <div>Description: {ex.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
