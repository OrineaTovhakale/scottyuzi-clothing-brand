// src/components/HeroBlack.jsx — BLACK BAFANA · MATCHES REDESIGN CAMPAIGN SPLIT
// Dark split (image left with parallax, text right), italic headline with gold,
// supporting line + CTA. navigate()/product logic unchanged.
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';

const heroBlack = asset('worldcup/hero black.png');
const bafanaBlack = asset('worldcup/BafanaBlack.png');

const HeroBlack = () => {
  const navigate = useNavigate();
  const imgRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false, vh = window.innerHeight;
    const update = () => {
      ticking = false;
      const el = imgRef.current;
      if (!el) return;
      const host = el.parentElement.getBoundingClientRect();
      const center = host.top + host.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(center * (0.86 - 1)).toFixed(1)}px, 0) scale(1.04)`;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    const onResize = () => { vh = window.innerHeight; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  const handleShop = () => navigate('/product', {
    state: {
      product: {
        name:         'ScottyUzi World Cup Tee — Black',
        image:        bafanaBlack,
        price:        450,
        customizable: true,
        isWorldCup:   true,
      }
    }
  });

  return (
    <section className="camp">
      <div className="camp__media">
        <img ref={imgRef} src={heroBlack} alt="Bafana Bafana Black Edition" />
      </div>
      <div className="camp__text">
        <span className="eyebrow camp__eye">One For One Thursday · Black Edition</span>
        <h2>Bafana Bafana<br /><span className="g">Black Edition.</span></h2>
        <p>The away kit, reimagined. Zero restocks once they're gone — and yes, we mean that.</p>
        <button className="camp__cta" onClick={handleShop}>Shop the drop</button>
      </div>

      <style jsx>{`
        .camp {
          --ink:#1A1A1A; --paper:#F7F5F2; --white:#fff; --gold:#C8972E; --gold-soft:#E5C77E;
          --serif:'Georgia','Times New Roman',serif; --util:'Helvetica Neue',Arial,sans-serif;
          --ease:cubic-bezier(.22,1,.36,1);
          position:relative; background:var(--ink); color:#fff;
          display:grid; grid-template-columns:1fr 1fr; min-height:92vh; overflow:hidden;
        }
        .eyebrow { font-family:var(--util); font-size:10px; font-weight:600; letter-spacing:.26em; text-transform:uppercase; color:var(--gold); }
        .camp__media { position:relative; overflow:hidden; }
        .camp__media img { position:absolute; inset:-12% 0; width:100%; height:124%; object-fit:cover; will-change:transform; }
        .camp__media::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent 60%,var(--ink)); }
        .camp__text { display:flex; flex-direction:column; justify-content:center; padding:0 7vw; }
        .camp__eye { margin-bottom:24px; display:block; }
        .camp__text h2 { font-family:var(--serif); font-style:italic; font-weight:400; line-height:.98; letter-spacing:-.02em; font-size:clamp(40px,5.5vw,84px); margin:0; }
        .camp__text h2 .g { color:var(--gold-soft); }
        .camp__text p { font-family:var(--util); font-size:14px; line-height:1.8; color:rgba(255,255,255,.55); max-width:380px; margin:26px 0 36px; }
        .camp__cta { align-self:flex-start; background:var(--white); color:var(--ink); border:none; cursor:pointer; padding:16px 42px; font-family:var(--util); font-size:11px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; transition:background .3s var(--ease), transform .3s var(--ease); }
        .camp__cta:hover { background:var(--gold); color:#fff; transform:translateX(6px); }

        @media (max-width:860px) {
          .camp { grid-template-columns:1fr; }
          .camp__media { height:56vh; }
          .camp__media::after { background:linear-gradient(to bottom,transparent 55%,var(--ink)); }
          .camp__text { padding:48px 22px 64px; }
        }
      `}</style>
    </section>
  );
};

export default HeroBlack;