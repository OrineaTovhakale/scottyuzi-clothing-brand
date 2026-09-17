// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { RiUserLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ containerStyles, setMenuOpened }) => {
  const { user, signOut } = useAuth();

  const handleLinkClick = () => {
    if (setMenuOpened) {
      setMenuOpened(false);
    }
  };

  const handleLogout = () => {
    signOut();
    handleLinkClick();
  };

  return (
    <>
      <nav className={containerStyles}>
        <NavLink 
          to="/" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            isActive ? "active-link magic-link" : "magic-link"
          }
        >
          Home
        </NavLink>

        <NavLink 
          to="/collections" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            isActive ? "active-link magic-link" : "magic-link"
          }
        >
          Collections
        </NavLink>

        <NavLink 
          to="/about" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            isActive ? "active-link magic-link" : "magic-link"
          }
        >
          About
        </NavLink>

        {/* MOBILE AUTH - Show on mobile menu only */}
        <div className="lg:hidden border-t pt-4 mt-4">
          {user ? (
            <>
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flexCenter gap-x-1"
              >
                <RiUserLine />
                Logout
              </button>
            </>
          ) : (
            <NavLink 
              to="/login" 
              onClick={handleLinkClick}
              className="flexCenter gap-x-1"
            >
              <RiUserLine />
              Login
            </NavLink>
          )}
        </div>
      </nav>

      {/* MAGIC UI STYLES */}
      <style jsx>{`
        .magic-link {
          position: relative;
          display: inline-block;
          padding: 0.5rem 0.75rem;
          text-transform: uppercase;
          font-size: 0.875rem;
          font-weight: bold;
          color: #374151;
          transition: all 0.3s ease;
        }

        .magic-link:hover {
          color: #000000;
        }

        .magic-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #000000;
          transition: width 0.3s ease;
        }

        .magic-link:hover::after {
          width: 100%;
        }

        .active-link {
          color: #000000;
        }

        .active-link::after {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Navbar;