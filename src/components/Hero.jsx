// src/components/Hero.jsx — ALTERNATING HERO (Never2Fly2Pray + FC Women's Shutdown)
// Two full-bleed images swap every 5s. CTAs go straight to product detail.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';

const neverHero = asset('hero/NeverHero.png');
const fcHero = asset('hero/FcHero.png');
const never1 = asset('never2fly2praycolours/Never1.png');
const fcPurple = asset('purp/fcPurple.png');

const NEVER_COLOURS = [
  'White and purple text',
  'Black and red text',
  'White and black text',
  'Black and green text',
  'White and red text',
  'White and blue text',
  'Black and cream white text',
];

const FREE_STICKER_COLOURS = [
  'Orange and Black',
  'Red and Black',
  'Green and Black',
  'Purple and Black',
  'Blue and Black',
  'White and Black',
];

const NEVER_PRODUCT = {
  name: 'Never 2Fly 2Pray',
  image: never1,
  price: 550,
  isNew: true,
  hasColourOptions: true,
  colourOptions: NEVER_COLOURS,
  includesFreeSticker: true,
  freeStickerColours: FREE_STICKER_COLOURS,
};

const FC_PRODUCT = {
  name: 'ScottyUzi FC Purple',
  image: fcPurple,
  price: 350,
  isNew: true,
  includesFreeSticker: true,
  freeStickerColours: FREE_STICKER_COLOURS,
};

const SLIDES = [
  {
    image: neverHero,
    heading: 'Never 2Fly 2Pray',
    sub: 'New colours. Same statement. Limited drop.',
    cta: 'Shop New Colours',
    product: NEVER_PRODUCT,
  },
  {
    image: fcHero,
    heading: "Women's Shutdown",
    sub: 'Stand with her. Wear the message. End GBV.',
    cta: 'Shop the Drop',
    product: FC_PRODUCT,
  },
];

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex]     = useState(0);
  const navigate              = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  // Infinite 5-second rotation
  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  const goToProduct = () => {
    navigate('/product', { state: { product: slide.product } });
  };

  return (
    <section className="nh-root">

      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`nh-img-wrap ${i === index ? 'nh-img-wrap--active' : ''}`}
        >
          <img src={s.image} alt={s.heading} className="nh-img" />
        </div>
      ))}

      <div className="nh-overlay" />

      <div className="nh-content">
        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.16s' }} key={'h-' + index}>
          <h1 className="nh-heading">{slide.heading}</h1>
        </div>

        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.26s' }} key={'s-' + index}>
          <p className="nh-sub">{slide.sub}</p>
        </div>

        <div className={`nh-anim ${visible ? 'nh-anim--in' : ''}`} style={{ '--d': '0.36s' }} key={'c-' + index}>
          <button className="nh-cta" onClick={goToProduct}>{slide.cta}</button>
        </div>
      </div>

      <div className="nh-dots" aria-hidden="true">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`nh-dot ${i === index ? 'nh-dot--active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={'Go to slide ' + (i + 1)}
          />
        ))}
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
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        .nh-img-wrap--active { opacity: 1; z-index: 1; }

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

        .nh-dots {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 4; display: flex; gap: 10px;
        }
        .nh-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none; padding: 0; cursor: pointer;
          transition: background .3s, transform .3s;
        }
        .nh-dot--active { background: #fff; transform: scale(1.25); }
      `}</style>
    </section>
  );
};

export default Hero;
