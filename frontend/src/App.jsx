import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { UserDataContext } from './context/UserContext.jsx'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

function App() {
  let {userData}=useContext(UserDataContext)
  return (
   <Routes>
    <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
    <Route path='/signup' element={userData?<Navigate to="/"/>:<Signup/>}/>
    <Route path='/login' element={userData?<Navigate to="/"/>:<Login/>}/>
    <Route path='/network' element={userData?<Network/>:<Navigate to="/login"/>}/>
    <Route path='/profile' element={userData?<Profile/>:<Navigate to="/login"/>}/>
    <Route path='/notification' element={userData?<Notification/>:<Navigate to="/login"/>}/>
  
   </Routes>
  )
}

export default App
