// src/components/Header.jsx — POLISHED EDITION
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiUserLine } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import Navbar from './Navbar';
import SideCart from './SideCart';
import SearchModal from './SearchModal';
import { useAuth } from '../context/AuthContext';

// ─── Cart Icon ────────────────────────────────────────────────────────────────
const CartIcon = ({ count }) => (
  <div className="hd-cart-icon">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    {count > 0 && <span className="hd-cart-badge">{count}</span>}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Header = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, signOut } = useAuth();

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [cartCount,    setCartCount]    = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const userMenuRef = useRef(null);

  // Cart count
  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    update();
    window.addEventListener('storage',     update);
    window.addEventListener('cartUpdated', update);
    return () => {
      window.removeEventListener('storage',     update);
      window.removeEventListener('cartUpdated', update);
    };
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openCart = () => {
    if (window.innerWidth < 1024) navigate('/cart');
    else setCartOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/',            label: 'Home' },
    { path: '/collections', label: 'Collections' },
    { path: '/about',       label: 'About' },
  ];

  return (
    <>
      <header className={`hd-root ${scrolled ? 'hd-root--scrolled' : ''}`}>
        <div className="hd-inner">

          {/* LEFT — Menu + Search */}
          <div className="hd-side hd-side--left">
            <button className="hd-word-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span className="hd-word-btn__bars">
                <span /><span />
              </span>
              <span className="hd-word-btn__text">Menu</span>
            </button>

            <button className="hd-word-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <FaSearch size={13} />
              <span className="hd-word-btn__text hd-hide-sm">Search</span>
            </button>
          </div>

          {/* CENTER — logo */}
          <Link to="/" className="hd-logo" onClick={() => setMenuOpen(false)}>
            SCOTTYUZI
          </Link>

          {/* RIGHT — Contact us + Cart */}
          <div className="hd-side hd-side--right">
            <button className="hd-word-btn hd-hide-sm" onClick={() => navigate('/about')}>
              <span className="hd-word-btn__text">Contact us</span>
            </button>

            <button className="hd-btn hd-btn--cart" onClick={openCart} aria-label="Cart">
              <CartIcon count={cartCount} />
            </button>
          </div>

        </div>
      </header>

      {/* ── CINEMATIC MOBILE MENU ───────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`hd-menu-backdrop ${menuOpen ? 'hd-menu-backdrop--visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Panel layers — three sweep in sequence */}
      <div className={`hd-menu ${menuOpen ? 'hd-menu--open' : ''}`}>
        {/* Layer 3 — darkest, furthest back */}
        <div className="hd-menu__layer hd-menu__layer--3" />
        {/* Layer 2 — dark */}
        <div className="hd-menu__layer hd-menu__layer--2" />
        {/* Layer 1 — main content panel */}
        <div className="hd-menu__layer hd-menu__layer--1">
          <div className="hd-menu__content">

            {/* Close button */}
            <button className="hd-menu__close" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Nav links — staggered entry */}
            <nav className="hd-menu__nav">
              {navLinks.map((l, i) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="hd-menu__link"
                  style={{ '--i': i }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="hd-menu__link-num">0{i + 1}</span>
                  <span className="hd-menu__link-text">{l.label}</span>
                </Link>
              ))}
            </nav>

            {/* Footer area */}
            <div className="hd-menu__foot">
              {user ? (
                <div className="hd-menu__user">
                  <p className="hd-menu__user-name">{user.user_metadata?.name || user.email}</p>
                  <button className="hd-menu__logout" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <button className="hd-menu__cta" onClick={() => { setMenuOpen(false); navigate('/login'); }}>
                  Login / Sign Up
                </button>
              )}
              <p className="hd-menu__tagline">Friends Don't Forget Friends</p>
            </div>

          </div>
        </div>
      </div>

      {/* SIDE CART */}
      <SideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* SEARCH MODAL */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <style jsx>{`
        /* TOKENS */
        :root {
          --ink:        #1A1A1A;
          --ink-mid:    #555555;
          --ink-soft:   #999999;
          --paper:      #F7F5F2;
          --border:     #E0DBD5;
          --white:      #FFFFFF;
        }

        /* HEADER */
        .hd-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 9000;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          transition: box-shadow .3s ease;
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
          overflow: hidden;
          max-width: 100%;
        }
        .hd-root--scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
        }
        .hd-inner {
          max-width: 1380px; margin: 0 auto;
          position: relative;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
        }
        @media (max-width: 768px) { .hd-inner { padding: 0 20px; height: 56px; } }

        /* SIDE CLUSTERS */
        .hd-side { display: flex; align-items: center; gap: 22px; z-index: 1; }
        @media (max-width: 768px) { .hd-side { gap: 12px; } }

        /* LOGO — dead centre of the bar */
        .hd-logo {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Georgia', serif;
          font-size: 19px; font-weight: 400; letter-spacing: 0.22em;
          color: var(--ink); text-decoration: none;
          transition: opacity .2s;
          white-space: nowrap;
        }
        @media (max-width: 480px) { .hd-logo { font-size: 15px; letter-spacing: 0.16em; } }
        .hd-logo:hover { opacity: 0.7; }

        /* WORD BUTTONS — Menu · Search · Contact us */
        .hd-word-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 6px 0;
          color: var(--ink); -webkit-tap-highlight-color: transparent;
          transition: opacity .2s;
        }
        .hd-word-btn:hover { opacity: 0.6; }
        .hd-word-btn__text {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
          color: var(--ink);
        }
        .hd-word-btn__bars {
          display: inline-flex; flex-direction: column; gap: 4px; width: 18px;
        }
        .hd-word-btn__bars span {
          display: block; height: 1.5px; background: var(--ink); width: 100%;
        }
        .hd-hide-sm { }
        @media (max-width: 640px) {
          .hd-hide-sm { display: none !important; }
        }

        .hd-btn {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: var(--ink); transition: color .2s, background .2s;
          border-radius: 50%;
          -webkit-tap-highlight-color: transparent;
        }
        .hd-btn:hover { background: rgba(0,0,0,0.04); }

        /* CART */
        /* CART */
        .hd-btn--cart { position: relative; }
        .hd-cart-icon { position: relative; display: flex; align-items: center; justify-content: center; }
        .hd-cart-badge {
          position: absolute; top: -8px; right: -8px;
          min-width: 17px; height: 17px; border-radius: 9px;
          background: var(--ink); color: var(--white);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }

        /* LOGIN — desktop only */
        .hd-login {
          display: none;
          align-items: center; gap: 6px;
          padding: 8px 16px;
          border: 1px solid var(--border); background: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-mid);
          cursor: pointer; transition: border-color .2s, color .2s;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 1024px) { .hd-login { display: flex; } }
        .hd-login:hover { border-color: var(--ink); color: var(--ink); }

        /* USER MENU — desktop */
        .hd-user { position: relative; display: none; }
        @media (min-width: 1024px) { .hd-user { display: block; } }
        .hd-user__btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          border: 1px solid var(--border); background: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-mid);
          cursor: pointer; transition: border-color .2s, color .2s;
        }
        .hd-user__btn:hover { border-color: var(--ink); color: var(--ink); }
        .hd-user__menu {
          position: absolute; top: calc(100% + 10px); right: 0;
          min-width: 200px; background: var(--white);
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          z-index: 9999;
          animation: hd-drop-in .2s ease;
        }
        @keyframes hd-drop-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .hd-user__info { padding: 14px 16px; border-bottom: 1px solid var(--border); }
        .hd-user__name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 600; color: var(--ink); margin: 0 0 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hd-user__email {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; color: var(--ink-soft); margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hd-user__logout {
          width: 100%; padding: 12px 16px; text-align: left;
          background: none; border: none; cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--ink-soft);
          transition: color .2s, background .2s;
        }
        .hd-user__logout:hover { color: var(--ink); background: var(--paper); }

        /* HAMBURGER */
        .hd-hamburger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; width: 40px; height: 40px;
          background: none; border: none; cursor: pointer; padding: 10px;
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 1023px) { .hd-hamburger { display: flex; } }
        .hd-hamburger__bar {
          display: block; width: 20px; height: 1.5px;
          background: var(--ink);
          transform-origin: center;
          transition: transform .35s cubic-bezier(.22,1,.36,1), opacity .25s ease, width .3s ease;
        }
        /* Animate to X when open */
        .hd-hamburger--open .hd-hamburger__bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hd-hamburger--open .hd-hamburger__bar:nth-child(2) { opacity: 0; width: 0; }
        .hd-hamburger--open .hd-hamburger__bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MOBILE MENU ──────────────────────────── */
        .hd-menu-backdrop {
          position: fixed; inset: 0; z-index: 9001;
          background: rgba(0,0,0,0);
          pointer-events: none;
          transition: background .5s ease;
        }
        .hd-menu-backdrop--visible {
          background: rgba(0,0,0,0.5);
          pointer-events: all;
        }

        .hd-menu {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          z-index: 9002;
          pointer-events: none;
        }
        .hd-menu--open { pointer-events: all; }

        /* Three layered panels — each 300ms delay apart */
        .hd-menu__layer {
          position: absolute; inset: 0;
          transform: translateX(100%);
          transition: transform .55s cubic-bezier(.22,1,.36,1);
        }
        .hd-menu--open .hd-menu__layer { transform: translateX(0); }

        /* Layer 3 — darkest, deepest */
        .hd-menu__layer--3 {
          background: #0D0D0D;
          transition-delay: 0s;
        }
        .hd-menu--open .hd-menu__layer--3 { transition-delay: 0s; }

        /* Layer 2 — dark */
        .hd-menu__layer--2 {
          background: #1A1A1A;
          transition-delay: .06s;
        }
        .hd-menu--open .hd-menu__layer--2 { transition-delay: .06s; }

        /* Layer 1 — main content */
        .hd-menu__layer--1 {
          background: #F7F5F2;
          transition-delay: .12s;
          display: flex; flex-direction: column;
        }
        .hd-menu--open .hd-menu__layer--1 { transition-delay: .12s; }

        .hd-menu__content {
          display: flex; flex-direction: column;
          height: 100%; padding: 28px 40px 40px;
          overflow-y: auto;
        }
        @media (max-width: 480px) { .hd-menu__content { padding: 24px 28px 36px; } }

        .hd-menu__close {
          align-self: flex-end;
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: none; border: 1px solid var(--border); cursor: pointer;
          color: var(--ink-mid); margin-bottom: 40px;
          transition: border-color .2s, color .2s;
        }
        .hd-menu__close:hover { border-color: var(--ink); color: var(--ink); }

        /* NAV LINKS */
        .hd-menu__nav {
          display: flex; flex-direction: column; gap: 0;
          flex: 1;
        }
        .hd-menu__link {
          display: flex; align-items: baseline; gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          /* staggered entrance */
          opacity: 0;
          transform: translateX(24px);
          transition: opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1), color .2s;
          transition-delay: calc(.2s + var(--i) * .07s);
        }
        .hd-menu--open .hd-menu__link {
          opacity: 1;
          transform: translateX(0);
        }
        .hd-menu__link-num {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          color: var(--ink-soft); flex-shrink: 0;
          transition: color .2s;
        }
        .hd-menu__link-text {
          font-family: 'Georgia', serif;
          font-size: clamp(26px, 6vw, 38px); font-weight: 400;
          letter-spacing: -0.02em; color: var(--ink);
          transition: letter-spacing .3s ease;
        }
        .hd-menu__link:hover .hd-menu__link-num  { color: var(--ink); }
        .hd-menu__link:hover .hd-menu__link-text { letter-spacing: 0.02em; }

        /* FOOTER */
        .hd-menu__foot {
          margin-top: 40px; display: flex; flex-direction: column; gap: 16px;
          opacity: 0; transform: translateY(12px);
          transition: opacity .4s ease .45s, transform .4s ease .45s;
        }
        .hd-menu--open .hd-menu__foot { opacity: 1; transform: none; }

        .hd-menu__user { display: flex; flex-direction: column; gap: 4px; }
        .hd-menu__user-name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 600; color: var(--ink-mid);
        }
        .hd-menu__logout {
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--ink-soft);
          text-align: left; text-decoration: underline; transition: color .2s;
        }
        .hd-menu__logout:hover { color: var(--ink); }

        .hd-menu__cta {
          display: inline-block; width: fit-content;
          padding: 13px 28px;
          background: var(--ink); color: var(--white);
          border: none; cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          transition: background .25s;
        }
        .hd-menu__cta:hover { background: #333; }

        .hd-menu__tagline {
          font-family: 'Georgia', serif;
          font-size: 11px; font-style: italic; color: var(--ink-soft); margin: 0;
        }
      `}</style>
    </>
  );
};

export default Header;