// src/components/PageLoader.jsx — POLISHED EDITION
import React, { useState, useEffect } from 'react';

const PageLoader = ({ duration = 900 }) => {
  const [phase, setPhase] = useState('in'); // 'in' → 'out' → 'gone'

  useEffect(() => {
    // Hold for `duration` ms then fade out
    const fadeOut = setTimeout(() => setPhase('out'), duration);
    // Remove from DOM after fade (500ms)
    const remove  = setTimeout(() => setPhase('gone'), duration + 500);
    return () => { clearTimeout(fadeOut); clearTimeout(remove); };
  }, [duration]);

  if (phase === 'gone') return null;

  return (
    <div className={`pl-root ${phase === 'out' ? 'pl-root--out' : ''}`}>

      <div className={`pl-inner ${phase === 'out' ? 'pl-inner--out' : ''}`}>
        <span className="pl-wordmark">ScottyUzi</span>
        <span className="pl-tagline">Friends Don't Forget Friends</span>
      </div>

      <div className="pl-bar-track">
        <div className="pl-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>

      <style jsx>{`
        .pl-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #F7F5F2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 36px;
          opacity: 1;
          transition: opacity 0.5s cubic-bezier(.22,1,.36,1);
          pointer-events: all;
        }
        .pl-root--out {
          opacity: 0;
          pointer-events: none;
        }

        .pl-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: pl-rise 0.55s cubic-bezier(.22,1,.36,1) forwards;
        }
        .pl-inner--out {
          animation: pl-drop 0.35s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes pl-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pl-drop {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }

        .pl-wordmark {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(30px, 5vw, 52px);
          font-weight: 400;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          line-height: 1;
          display: block;
        }
        .pl-tagline {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #999999;
          display: block;
        }

        .pl-bar-track {
          width: 56px;
          height: 1px;
          background: rgba(26,26,26,0.15);
          overflow: hidden;
          opacity: 0;
          animation: pl-fade 0.3s ease 0.15s forwards;
        }
        @keyframes pl-fade { to { opacity: 1; } }

        .pl-bar {
          height: 100%;
          width: 0%;
          background: #1A1A1A;
          animation: pl-fill linear forwards;
        }
        @keyframes pl-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;