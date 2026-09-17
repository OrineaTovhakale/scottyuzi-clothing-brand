// src/components/Footer.jsx — POLISHED EDITION
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const quickLinks = [
    { path: '/',            label: 'Home' },
    { path: '/collections', label: 'Collections' },
    { path: '/about',       label: 'About' },
  ];

  const friendLinks = [
    { path: '/matric-collaborations', label: 'Matric Collaborations' },
    { path: '/collections',           label: 'Shop Now' },
  ];

  const legalLinks = [
    { path: '/privacy-policy',  label: 'Privacy Policy' },
    { path: '/shipping-policy', label: 'Shipping Policy' },
    { path: '/terms-of-service',label: 'Terms of Service' },
    { path: '/refund',          label: 'Refund Policy' },
  ];

  const socials = [
    {
      href: 'https://www.instagram.com/scotty.uzi_merchandise/',
      label: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="ft-social__svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      href: 'https://www.tiktok.com/@scottyuzi_merchandise',
      label: 'TikTok',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="ft-social__svg">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
        </svg>
      ),
    },
    {
      href: 'https://www.facebook.com/Uglyboy.ScottyUzi13',
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="ft-social__svg">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="ft-root">

      {/* ── TOP GRID ─────────────────────────────────────────────────── */}
      <div className="ft-grid">

        {/* Brand */}
        <div className="ft-brand">
          <p className="ft-brand__name">ScottyUzi</p>
          <p className="ft-brand__tagline">Friends Don't Forget Friends</p>
          <p className="ft-brand__desc">
            Redefining streetwear with bold, authentic style. Join the global movement.
          </p>

          {/* Socials */}
          <div className="ft-socials">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="ft-col">
          <p className="ft-col__heading">Navigate</p>
          <ul className="ft-list">
            {quickLinks.map(l => (
              <li key={l.path}>
                <NavLink to={l.path} className="ft-link">{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Friends */}
        <div className="ft-col">
          <p className="ft-col__heading">Our Friends</p>
          <ul className="ft-list">
            {friendLinks.map(l => (
              <li key={l.path}>
                <NavLink to={l.path} className="ft-link">{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="ft-col">
          <p className="ft-col__heading">Legal</p>
          <ul className="ft-list">
            {legalLinks.map(l => (
              <li key={l.path}>
                <NavLink to={l.path} className="ft-link">{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── SUBSCRIBE STRIP — logged out only ─────────────────────── */}
      {!user && (
        <div className="ft-subscribe">
          <div className="ft-subscribe__inner">
            <div className="ft-subscribe__text">
              <p className="ft-subscribe__label">Members Only</p>
              <h3 className="ft-subscribe__heading">You In?</h3>
              <p className="ft-subscribe__desc">
                Early access to drops, member discounts, and first look at events and collabs.
              </p>
            </div>
            <button className="ft-subscribe__cta" onClick={() => navigate('/login')}>
              Join Now
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
      <div className="ft-bottom">
        <p className="ft-bottom__copy">
          © {new Date().getFullYear()} Powered by Lift Media Solutions. All rights reserved.
        </p>
        <div className="ft-bottom__links">
          {legalLinks.slice(0, 2).map(l => (
            <NavLink key={l.path} to={l.path} className="ft-bottom__link">{l.label}</NavLink>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* TOKENS */
        .ft-root {
          --ink:        #1A1A1A;
          --ink-mid:    #888;
          --ink-soft:   #555;
          --border:     rgba(255,255,255,0.1);
          --white:      #FFFFFF;
          background: #1A1A1A;
          color: var(--white);
          overflow-x: hidden;
          max-width: 100%;
        }

        /* TOP GRID */
        .ft-grid {
          max-width: 1380px; margin: 0 auto;
          display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 64px;
          padding: 72px 40px 56px;
          border-bottom: 1px solid var(--border);
        }
        @media (max-width: 1024px) { .ft-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }
        @media (max-width: 600px)  { .ft-grid { grid-template-columns: 1fr; gap: 36px; padding: 48px 24px 40px; } }

        /* BRAND */
        .ft-brand {}
        .ft-brand__name {
          font-family: 'Georgia', serif;
          font-size: 22px; font-weight: 400; letter-spacing: 0.02em;
          color: var(--white); margin: 0 0 8px;
        }
        .ft-brand__tagline {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--ink-mid);
          margin: 0 0 16px;
        }
        .ft-brand__desc {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; line-height: 1.7; color: var(--ink-mid);
          margin: 0 0 28px; max-width: 280px;
        }

        /* SOCIALS */
        .ft-socials { display: flex; gap: 12px; }
                .ft-social {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
          transition: color .25s, border-color .25s, transform .3s cubic-bezier(.22,1,.36,1);
        }
        .ft-social:hover { color: #C8972E; border-color: #C8972E; transform: translateY(-2px); }
        .ft-social__svg { width: 16px; height: 16px; }

        /* COLUMNS */
        .ft-col {}
        .ft-col__heading {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin: 0 0 20px; padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .ft-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .ft-link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: color .2s;
          position: relative; display: inline-block;
        }
        .ft-link::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 0; height: 1px; background: #C8972E;
          transition: width .3s cubic-bezier(.22,1,.36,1);
        }
        .ft-link:hover { color: var(--white); }
        .ft-link:hover::after { width: 100%; }

        /* SUBSCRIBE */
        .ft-subscribe {
          border-bottom: 1px solid var(--border);
        }
        .ft-subscribe__inner {
          max-width: 1380px; margin: 0 auto;
          padding: 48px 40px;
          display: flex; align-items: center; justify-content: space-between; gap: 40px;
        }
        @media (max-width: 768px) {
          .ft-subscribe__inner { flex-direction: column; align-items: flex-start; padding: 40px 24px; gap: 24px; }
        }
        .ft-subscribe__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin: 0 0 8px;
        }
        .ft-subscribe__heading {
          font-family: 'Georgia', serif;
          font-size: clamp(28px, 4vw, 44px); font-weight: 400;
          letter-spacing: -0.02em; color: var(--white);
          margin: 0 0 10px;
        }
        .ft-subscribe__desc {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.45);
          line-height: 1.6; margin: 0; max-width: 480px;
        }
        .ft-subscribe__cta {
          flex-shrink: 0;
          padding: 14px 36px;
          background: var(--white); color: var(--ink);
          border: none; cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          transition: background .25s, color .25s;
          white-space: nowrap;
        }
        .ft-subscribe__cta:hover { background: rgba(255,255,255,0.85); }

        /* BOTTOM BAR */
        .ft-bottom {
          max-width: 1380px; margin: 0 auto;
          padding: 24px 40px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) { .ft-bottom { padding: 20px 24px; flex-direction: column; align-items: flex-start; gap: 12px; } }
        .ft-bottom__copy {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; color: rgba(255,255,255,0.25); margin: 0;
        }
        .ft-bottom__links { display: flex; gap: 20px; }
        .ft-bottom__link {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; color: rgba(255,255,255,0.25);
          text-decoration: none; transition: color .2s;
        }
        .ft-bottom__link:hover { color: rgba(255,255,255,0.6); }
      `}</style>
    </footer>
  );
};

export default Footer;