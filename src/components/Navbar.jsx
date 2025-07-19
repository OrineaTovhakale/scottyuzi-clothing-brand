import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = ({ containerStyles = "", setMenuOpened }) => {
  const navLinks = [
    { path: '/', title: 'Home' },
    { path: '/collections', title: 'Collections' },
    { path: '/about', title: 'About' },
    { path: '/contact', title: 'Contact' }
  ]

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          onClick={() => setMenuOpened?.(false)}
          className={({ isActive }) =>
            `${isActive ? "text-secondary underline" : "text-gray-800"} px-3 py-2 uppercase text-sm font-bold hover:text-secondary transition`
          }
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar
