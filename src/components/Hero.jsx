// src/components/Hero.jsx — SINGLE HERO: Never 2Fly 2Pray Vest
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';
import { VEST_PRODUCT } from '../utils/vestProduct';

// Supabase URL — do NOT import from ../assets/
const vestHero = asset('vests/never2fly2pray/hero.png');

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  const goToProduct = () => {
    navigate('/product', { state: { product: VEST_PRODUCT } });
  };

  return (
    <section className="nh-root">
      <div className="nh-img-wrap nh-img-wrap--active">
        <img src={vestHero} alt="Never 2Fly 2Pray Vest" className="nh-img" />
      </div>

      <div className="nh-overlay" />

      <div className="nh-content">
        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.16s' }}>
          <h1 className="nh-heading">Never 2Fly 2Pray Vest</h1>
        </div>

        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.26s' }}>
          <p className="nh-sub">Grommet details. Six colourways. Built to stand out.</p>
        </div>

        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.36s' }}>
          <button className="nh-cta" onClick={goToProduct}>
            Shop the Vest
          </button>
        </div>
      </div>

      <style jsx>{`
        .nh-root {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #0A0A0A;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .nh-img-wrap {
          position: absolute; inset: 0; z-index: 1;
        }
        .nh-img-wrap--active { opacity: 1; }
        .nh-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          animation: nh-drift 18s ease-in-out infinite alternate;
          will-change: transform;
          backface-visibility: hidden;
        }
        @keyframes nh-drift { from { transform: scale(1); } to { transform: scale(1.03); } }
        @media (max-width: 768px) {
          .nh-root { height: 72vh; min-height: 460px; }
          .nh-img  { animation: none; object-position: center 30%; }
        }
        @media (max-width: 480px) {
          .nh-root { height: 66vh; min-height: 420px; }
        }
        .nh-overlay {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(to top,
            rgba(0,0,0,0.60) 0%,
            rgba(0,0,0,0.26) 32%,
            rgba(0,0,0,0.05) 58%,
            transparent 100%);
        }
        .nh-content {
          position: relative; z-index: 3;
          width: 100%; max-width: 1380px;
          padding: 0 40px 9vh;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 18px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) { .nh-content { padding: 0 24px 12vh; gap: 15px; } }
        .nh-anim {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1) var(--d, 0s),
                      transform 0.8s cubic-bezier(.22,1,.36,1) var(--d, 0s);
        }
        .nh-anim--in { opacity: 1; transform: none; }
        .nh-heading {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(30px, 5.4vw, 82px);
          font-weight: 400;
          letter-spacing: 0.04em;
          line-height: 1.05;
          color: #FFFFFF;
          margin: 0;
          text-shadow: 0 2px 30px rgba(0,0,0,0.35);
        }
        .nh-sub {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(12px, 1.2vw, 15px);
          font-weight: 400; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.82);
          margin: 0;
        }
        .nh-cta {
          min-width: 260px;
          padding: 18px 64px;
          margin-top: 6px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          transition: background .25s ease, transform .3s cubic-bezier(.22,1,.36,1);
        }
        .nh-cta:hover { background: #1A1A1A; transform: translateY(-2px); }
        @media (max-width: 480px) { .nh-cta { min-width: 200px; padding: 16px 44px; } }
      `}</style>
    </section>
  );
};

export default Hero;