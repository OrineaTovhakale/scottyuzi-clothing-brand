import React, { useState, useContext } from 'react'
import { FaSearch, FaShoppingBasket } from 'react-icons/fa'
import { FaBars, FaBarsStaggered } from 'react-icons/fa6'
import { RiUserLine } from 'react-icons/ri'
import { Link, useLocation } from 'react-router-dom'
import userImg from '../assets/user.png'
import { ShopContext } from '../context/ShopContext'
import Navbar from './Navbar'

const Header = () => {
  const { user, setUser, navigate } = useContext(ShopContext)
  const [menuOpened, setMenuOpened] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  const toggleMenu = () => setMenuOpened(prev => !prev)

  return (
    <header
      className={`${
        !isHomepage ? 'bg-gradient-to-r from-primary via-white to-primary' : ''
      } w-full fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-50`}
    >
      {/* Logo */}
      <Link to="/" className="text-tertiary font-bold text-xl uppercase font-paci">
        ScottyUzi <span className="text-secondary">.</span>
      </Link>

      {/* Desktop Navbar */}
      <Navbar
        setMenuOpened={setMenuOpened}
        containerStyles="hidden lg:flex gap-x-6 text-white text-sm font-semibold"
      />

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search bar (xl and up) */}
        {showSearch && (
          <input
            type="text"
            placeholder="Search for products..."
            className="rounded-full px-4 py-2 border hidden xl:block"
          />
        )}
        <FaSearch
          onClick={() => setShowSearch(prev => !prev)}
          className="text-xl cursor-pointer text-tertiary "
        />

        {/* Cart */}
        <div onClick={() => navigate('/cart')} className="relative cursor-pointer text-tertiary">
          <FaShoppingBasket size={24} />
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">
            0
          </span>
        </div>

        {/* User/Login */}
        {user ? (
          <img src={userImg} alt="user" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <button className="flex items-center gap-1 text-tertiary border px-3 py-1 rounded-full">
            Login <RiUserLine />
          </button>
        )}

        {/* Hamburger + Dropdown Menu */}
        <div className="relative lg:hidden">
          {menuOpened ? (
            <FaBarsStaggered
              onClick={toggleMenu}
              className="text-tertiary text-xl cursor-pointer"
            />
          ) : (
            <FaBars
              onClick={toggleMenu}
              className="text-tertiary text-xl cursor-pointer"
            />
          )}

          {/* Mobile Navbar Dropdown */}
         {menuOpened && (
            <>
                {/* Blur Background */}
                <div
                onClick={toggleMenu}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                ></div>

                {/* Sliding Dropdown Menu */}
                <Navbar
                setMenuOpened={setMenuOpened}
                containerStyles="flex flex-col gap-y-4 absolute top-full right-0 mt-2 p-5 bg-white shadow-lg w-52 ring-1 ring-slate-900/5 z-50 rounded-md
                transition-all duration-300 ease-out transform translate-y-2 opacity-100"
                />
            </>
            )}


        </div>
      </div>
    </header>
  )
}

export default Header
