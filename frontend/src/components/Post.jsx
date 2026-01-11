import React, { useContext, useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import moment from "moment"
import { FaRegCommentDots } from "react-icons/fa"
import { BiLike, BiSolidLike } from "react-icons/bi"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { UserDataContext } from '../context/UserContext.jsx'
import { LuSendHorizontal } from "react-icons/lu"
import { io } from "socket.io-client"
import ConnectionButton from './ConnectionButton.jsx'

const socket = io("https://linkedin-backend-wmse.onrender.com")

function Post({ id, author, like, comment, description, image, createdAt }) {

  const [more, setMore] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { userData, getPost, handleGetProfile } =
    useContext(UserDataContext)

  const [likes, setLikes] = useState(like || [])
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState(comment || [])
  const [showComment, setShowComment] = useState(false)

  const handleLike = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/post/like/${id}`,
        { withCredentials: true }
      )
      setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    try {
      let result = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      )
      setComments(result.data.comment)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const likeHandler = ({ postId, likes }) => {
      if (postId === id) {
        setLikes(likes)
      }
    }

    const commentHandler = ({ postId, comm }) => {
      if (postId === id) {
        setComments(comm)
      }
    }

    socket.on("likeUpdated", likeHandler)
    socket.on("commentAdded", commentHandler)

    return () => {
      socket.off("likeUpdated", likeHandler)
      socket.off("commentAdded", commentHandler)
    }
  }, [id])

  useEffect(() => {
    if (getPost) getPost()
  }, [likes.length, comments.length]) // no logic change, safer dependency

  return (
    <div className="w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]">

      <div className='flex justify-between items-center'>
        <div
          className='flex gap-[10px] cursor-pointer'
          onClick={() => handleGetProfile(author.userName)}
        >
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={author.profileImage || dp} alt="" className='h-full' />
          </div>

          <div>
            <div className='text-[22px] font-semibold'>
              {author.firstName} {author.lastName}
            </div>
            <div className='text-[16px]'>{author.headline}</div>
            <div className='text-[16px]'>{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        {userData?._id !== author._id &&
          <ConnectionButton userId={author._id} />
        }
      </div>

      <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[50px]`}>
        {description}
      </div>

      <div
        className="pl-[50px] text-[19px] font-semibold cursor-pointer"
        onClick={() => setMore(p => !p)}
      >
        {more ? "read less..." : "read more..."}
      </div>

      {image &&
        <div className='w-full h-[300px] flex justify-center rounded-lg overflow-hidden'>
          <img src={image} alt="" className='h-full rounded-lg' />
        </div>
      }

      <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
        <div className='flex gap-[5px]'>
          <BiLike className='text-[#1ebbff]' />
          <span>{likes.length}</span>
        </div>

        <div
          className='cursor-pointer'
          onClick={() => setShowComment(p => !p)}
        >
          {comments.length} comments
        </div>
      </div>

      <div className='flex gap-[20px] p-[20px]'>

        {!likes.includes(userData?._id) &&
          <div className='flex gap-[5px] cursor-pointer' onClick={handleLike}>
            <BiLike />
            <span>Like</span>
          </div>
        }

        {likes.includes(userData?._id) &&
          <div className='flex gap-[5px] cursor-pointer' onClick={handleLike}>
            <BiSolidLike className='text-[#07a4ff]' />
            <span className='text-[#07a4ff] font-semibold'>Liked</span>
          </div>
        }

        <div className='flex gap-[5px] cursor-pointer' onClick={() => setShowComment(p => !p)}>
          <FaRegCommentDots />
          <span>Comment</span>
        </div>
      </div>

      {showComment &&
        <div>
          <form onSubmit={handleComment} className='flex p-[10px] border-b-2'>
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="leave a comment"
              className='outline-none w-full'
            />
            <button type="submit">
              <LuSendHorizontal className='text-[#07a4ff]' />
            </button>
          </form>

          {comments.map((com) => (
            <div key={com._id} className='p-[20px] border-b-2'>
              <div className='flex gap-[10px] items-center'>
                <img
                  src={com.user.profileImage || dp}
                  className='w-[40px] h-[40px] rounded-full'
                />
                <div className='font-semibold'>
                  {com.user.firstName} {com.user.lastName}
                </div>
              </div>
              <div className='pl-[50px]'>{com.content}</div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default Post
