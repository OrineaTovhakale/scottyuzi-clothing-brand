// src/components/Hero.jsx — GREEN BAFANA EDITION HERO
// Sits at the top of the page in the normal hero position.
// Timer to 6:00 PM TODAY. Once done → Shop Now shown PERMANENTLY (localStorage).

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';

const heroGreen = asset('worldcup/green hero.png');
const scXwc1 = asset('worldcup/scXwc1.png');

const STORAGE_KEY = 'wcDualDropDone';
const pad = (n) => String(n).padStart(2, '0');

const useCountdown = (target) => {
  const calc = () => {
    if (localStorage.getItem(STORAGE_KEY) === 'true')
      return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const diff = target - Date.now();
    if (diff <= 0) {
      localStorage.setItem(STORAGE_KEY, 'true');
      return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    }
    return {
      days:    Math.floor(diff / 864e5),
      hours:   Math.floor((diff / 36e5) % 24),
      minutes: Math.floor((diff / 6e4) % 60),
      seconds: Math.floor((diff / 1e3) % 60),
      done:    false,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    if (t.done) return;
    const id = setInterval(() => {
      const next = calc();
      setT(next);
      if (next.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target, t.done]);
  return t;
};

const Hero = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const target = useMemo(() => {
    const t = new Date();
    t.setHours(18, 0, 0, 0);
    return t.getTime();
  }, []);

  const { days, hours, minutes, seconds, done } = useCountdown(target);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  const handleShop = () => navigate('/product', {
    state: {
      product: {
        name:         'ScottyUzi World Cup Tee — Green',
        image:        scXwc1,
        price:        450,
        customizable: true,
        isWorldCup:   true,
      }
    }
  });

  return (
    <section className="hg-root">

      <div className="hg-img-wrap">
        <img src={heroGreen} alt="Bafana Bafana Green Edition" className="hg-img" />
      </div>
      <div className="hg-overlay" />

      <div className="hg-content">

        <div className={`hg-anim ${visible ? 'hg-anim--in' : ''}`} style={{ '--d': '0s' }}>
          <div className="hg-eyebrow">
            <span className="hg-eyebrow__line" />
            <span className="hg-eyebrow__text">One For One Thursday · Green Edition</span>
          </div>
        </div>

        <div className={`hg-anim ${visible ? 'hg-anim--in' : ''}`} style={{ '--d': '0.12s' }}>
          <h1 className="hg-heading">
            <span className="hg-heading__top">Bafana Bafana</span>
            <span className="hg-heading__bot">Edition.</span>
          </h1>
        </div>

        <div className={`hg-anim ${visible ? 'hg-anim--in' : ''}`} style={{ '--d': '0.24s' }}>
          {!done ? (
            <div className="hg-timer-wrap">
              <p className="hg-timer__label">Drops in</p>
              <div className="hg-timer">
                {[['Days', days], ['Hrs', hours], ['Min', minutes], ['Sec', seconds]].map(([unit, val], i) => (
                  <React.Fragment key={unit}>
                    <div className="hg-timer__block">
                      <span className="hg-timer__num">{pad(val)}</span>
                      <span className="hg-timer__unit">{unit}</span>
                    </div>
                    {i < 3 && <span className="hg-timer__sep">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <button className="hg-cta" onClick={handleShop}>
              <span className="hg-cta__text">Shop Now</span>
              <span className="hg-cta__line" />
            </button>
          )}
        </div>

      </div>

      <style jsx>{`
        .hg-root {
          position: relative; height: 100vh; width: 100%;
          overflow: hidden; background: #0D3B1F;
          display: flex; align-items: center; justify-content: flex-start;
        }
        .hg-img-wrap { position: absolute; inset: 0; z-index: 1; }
        .hg-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center;
          display: block; animation: hg-drift 16s ease-in-out infinite alternate;
        }
        @keyframes hg-drift { from { transform: scale(1); } to { transform: scale(1.04); } }
        .hg-overlay {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background:
            linear-gradient(to right, rgba(13,59,31,0.92) 0%, rgba(13,59,31,0.58) 45%, rgba(13,59,31,0.10) 100%),
            linear-gradient(to top,   rgba(13,59,31,0.72) 0%, transparent 55%);
        }
        .hg-content {
          position: relative; z-index: 3;
          max-width: 1380px; width: 100%; margin: 0 auto;
          padding: 0 8%; display: flex; flex-direction: column; gap: 20px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) { .hg-content { padding: 0 24px; gap: 16px; } }

        .hg-anim {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.75s cubic-bezier(.22,1,.36,1) var(--d, 0s),
                      transform 0.75s cubic-bezier(.22,1,.36,1) var(--d, 0s);
        }
        .hg-anim--in { opacity: 1; transform: none; }

        .hg-eyebrow { display: flex; align-items: center; gap: 12px; }
        .hg-eyebrow__line { display: block; width: 28px; height: 1px; background: #C8A84B; flex-shrink: 0; }
        .hg-eyebrow__text {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: #C8A84B;
        }
        .hg-heading { display: flex; flex-direction: column; gap: 0; margin: 0; line-height: 0.94; }
        .hg-heading__top {
          font-family: 'Georgia', serif;
          font-size: clamp(28px, 4.5vw, 64px); font-weight: 400;
          font-style: italic; letter-spacing: -0.02em;
          color: rgba(255,255,255,0.88); display: block;
        }
        .hg-heading__bot {
          font-family: 'Georgia', serif;
          font-size: clamp(28px, 4.5vw, 64px); font-weight: 400;
          font-style: italic; letter-spacing: -0.02em;
          color: #3DDB4A; display: block;
        }

        /* TIMER */
        .hg-timer-wrap { display: flex; flex-direction: column; gap: 10px; }
        .hg-timer__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(61,219,74,0.5); margin: 0;
        }
        .hg-timer { display: flex; align-items: center; }
        .hg-timer__block {
          display: flex; flex-direction: column; align-items: center;
          padding: 14px 18px 10px;
          border: 1px solid rgba(61,219,74,0.22);
          background: rgba(61,219,74,0.05);
          backdrop-filter: blur(8px); min-width: 68px;
        }
        @media (max-width: 480px) { .hg-timer__block { min-width: 52px; padding: 10px 12px 8px; } }
        .hg-timer__num {
          font-family: 'Georgia', serif;
          font-size: clamp(26px, 3.5vw, 48px); font-weight: 400;
          letter-spacing: -0.02em; line-height: 1; color: #3DDB4A; display: block;
        }
        .hg-timer__unit {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(61,219,74,0.4);
          margin-top: 6px; display: block;
        }
        .hg-timer__sep {
          font-family: 'Georgia', serif;
          font-size: clamp(20px, 2.5vw, 36px);
          color: rgba(61,219,74,0.18);
          padding: 0 2px; margin-bottom: 12px; align-self: center;
        }

        /* CTA */
        .hg-cta {
          display: inline-flex; flex-direction: column; align-items: flex-start;
          gap: 6px; background: none; border: none; cursor: pointer;
          padding: 0; margin-top: 4px;
        }
        .hg-cta__text {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #C8A84B;
          transition: color 0.25s ease; display: block;
        }
        .hg-cta:hover .hg-cta__text { color: #ffffff; }
        .hg-cta__line {
          display: block; height: 1px; background: #C8A84B; width: 100%;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1);
        }
        .hg-cta:hover .hg-cta__line { transform: scaleX(1); }
      `}</style>
    </section>
  );
};

export default Hero;