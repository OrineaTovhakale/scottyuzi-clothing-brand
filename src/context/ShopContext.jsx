import React from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const  ShopContext = createContext();

const ShopContextProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const value = {
    user,
    setUser,
    navigate,
  }
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider