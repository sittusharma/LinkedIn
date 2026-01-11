import React, { createContext, useMemo } from 'react'

export const authDataContext = createContext()

function AuthContext({ children }) {
  const serverUrl = "https://linkedin-backend-wmse.onrender.com"

  const value = useMemo(() => ({
    serverUrl
  }), [])

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  )
}

export default AuthContext
