import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Network from './pages/Network.jsx';
import Profile from './pages/Profile.jsx';
import Notification from './pages/Notification.jsx';
import { UserDataContext } from './context/UserContext.jsx';

// ProtectedRoute: only accessible if user is logged in
function ProtectedRoute({ children }) {
  const { userData } = useContext(UserDataContext);
  return userData ? children : <Navigate to="/login" />;
}

// GuestRoute: only accessible if user is NOT logged in
function GuestRoute({ children }) {
  const { userData } = useContext(UserDataContext);
  return !userData ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Routes>
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/network" element={
        <ProtectedRoute>
          <Network />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/notification" element={
        <ProtectedRoute>
          <Notification />
        </ProtectedRoute>
      } />

      {/* Guest routes */}
      <Route path="/signup" element={
        <GuestRoute>
          <Signup />
        </GuestRoute>
      } />
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />

      {/* Catch-all route for unknown paths */}
      <Route path="*" element={<div className="text-center mt-[100px] text-[24px]">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
