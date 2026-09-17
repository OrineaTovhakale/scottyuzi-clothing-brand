// src/components/CookieConsent.jsx — POLISHED EDITION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [show,    setShow]    = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // If already accepted, never show
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') return;

    // Show after page loader finishes (loader is ~900ms + 500ms fade = ~1.4s)
    const id = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(id);
  }, []);

  const accept = () => {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem('cookieConsent', 'accepted');
      setShow(false);
      setLeaving(false);
    }, 420);
  };

  if (!show) return null;

  return (
    <div
      className={`cc-root ${leaving ? 'cc-root--out' : 'cc-root--in'}`}
      style={{
        WebkitTransform: 'translate3d(0,0,0)',
        transform:       'translate3d(0,0,0)',
        willChange:      'transform',
      }}
    >
      {/* Ink accent top rule */}
      <div className="cc-rule" />

      <div className="cc-body">
        <p className="cc-label">Cookie Notice</p>

        <p className="cc-text">
          We use cookies to give you the best experience on our site.
          By continuing, you agree to our{' '}
          <Link to="/privacy-policy" className="cc-link">Privacy Policy</Link>.
        </p>

        <div className="cc-actions">
          <button className="cc-accept" onClick={accept}>
            Got It
          </button>
          <Link to="/privacy-policy" className="cc-more">
            Learn More
          </Link>
        </div>
      </div>

      <style jsx>{`
        .cc-root {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 10000;
          width: 320px;
          background: #FFFFFF;
          border: 1px solid #E0DBD5;
          box-shadow: 0 8px 40px rgba(0,0,0,0.10);
          overflow: hidden;
          /* Ensure it's visible above everything */
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }
        @media (max-width: 480px) {
          .cc-root {
            bottom: 0; right: 0; left: 0;
            width: 100%;
            border-left: none; border-right: none; border-bottom: none;
          }
        }

        .cc-root--in {
          animation: cc-up 0.5s cubic-bezier(.22,1,.36,1) forwards;
        }
        .cc-root--out {
          animation: cc-down 0.4s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes cc-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cc-down {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(24px); }
        }

        /* Ink top accent */
        .cc-rule {
          height: 2px;
          background: #1A1A1A;
        }

        .cc-body {
          padding: 20px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cc-label {
          font-family: 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #999999 !important;
          margin: 0 !important;
          line-height: 1 !important;
        }

        .cc-text {
          font-family: 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 13px !important;
          line-height: 1.6 !important;
          color: #555555 !important;
          margin: 0 !important;
        }

        .cc-link {
          color: #1A1A1A;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .cc-link:hover { opacity: 0.6; }

        .cc-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 4px;
        }

        .cc-accept {
          padding: 10px 24px;
          background: #1A1A1A;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: background 0.2s;
        }
        .cc-accept:hover { background: #333333; }

        .cc-more {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999999;
          text-decoration: none;
          transition: color 0.2s;
        }
        .cc-more:hover { color: #1A1A1A; }
      `}</style>
    </div>
  );
};

export default CookieConsent;