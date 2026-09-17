// src/components/CardiganHero.jsx — NEW PRODUCT HERO (top of homepage)
// Mirrors the green Hero's split layout + motion exactly (text left on cream,
// image right that wipes in then parallaxes, masked headline rise, draw underline,
// scroll cue). Shop Now → ProductDetail with prodCar as the main gallery image
// and thumbCar1/thumbCar2 as the thumbnails.
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import heroCar   from '../assets/cardigans/heroCar.png';   // hero/landing image
import prodCar   from '../assets/cardigans/prodCar.png';   // product detail main image
import thumbCar1 from '../assets/cardigans/thumbCar1.png'; // thumbnail 1
import thumbCar2 from '../assets/cardigans/thumbCar2.png'; // thumbnail 2

const CardiganHero = () => {
  const navigate = useNavigate();
  const imgRef = useRef(null);

  // scroll parallax — identical formula to the green Hero
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false, vh = window.innerHeight;
    const update = () => {
      ticking = false;
      const el = imgRef.current;
      if (!el) return;
      const host = el.parentElement.getBoundingClientRect();
      const center = host.top + host.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(center * (0.82 - 1)).toFixed(1)}px, 0) scale(1.04)`;
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
        name:   'ScottyUzi x World : Chairman Edition Cardigans',
        image:  prodCar,                 // shown first in the gallery
        images: [thumbCar1, thumbCar2],  // thumbnails after the main image
        price:  550,
        isCardigan: true,
      }
    }
  });

  return (
    <section className="ch-hero">
      <div className="ch-hero__text">
        <div className="ch-hero__eye">
          <span className="ln" />
          <span className="eyebrow">Just Dropped · New Release</span>
        </div>
        <h1>
          <span className="ch-h-row">
            {["ScottyUzi", "x", "World"].map((w, i) => (
              <span className="ch-w" style={{ '--wi': i }} key={i}><span>{w}</span></span>
            ))}
          </span>
          <span className="ch-h-row ch-h-row--em">
            {["Chairman", "Edition", "Cardigans"].map((w, i) => (
              <span className="ch-w" style={{ '--wi': i + 3 }} key={i}><span>{w}</span></span>
            ))}
          </span>
        </h1>
        <div className="ch-hero__sub">
          <p className="ch-hero__sub-lead">The Chairman Movement</p>
          <p className="ch-hero__sub-body">Built for the generation leading South Africa forward.</p>
        </div>
        <button className="ch-hero__cta" onClick={handleShop}>
          <span>Shop Now</span>
          <span className="uln" />
        </button>
      </div>

      <div className="ch-hero__media">
        <img ref={imgRef} src={heroCar} alt="ScottyUzi x World Chairman Edition Cardigans" />
      </div>

      <div className="ch-hero__scroll"><span className="bar" /><span>Scroll</span></div>

      <style jsx>{`
        .ch-hero {
          --ink:#1A1A1A; --ink-mid:#5B5854; --ink-soft:#9A948C; --paper:#F7F5F2; --gold:#C8972E; --border:#E0DBD5;
          --serif:'Georgia','Times New Roman',serif; --util:'Helvetica Neue',Arial,sans-serif;
          --ease:cubic-bezier(.22,1,.36,1);
          position:relative; min-height:100vh; display:grid; grid-template-columns:1.05fr .95fr;
          align-items:center; gap:40px; padding:0 0 0 7vw; overflow:hidden; background:var(--paper);
        }
        .eyebrow { font-family:var(--util); font-size:10px; font-weight:600; letter-spacing:.26em; text-transform:uppercase; color:var(--gold); }
        .ch-hero__text { position:relative; z-index:3; max-width:620px; padding:120px 0; }
        .ch-hero__eye { display:flex; align-items:center; gap:14px; margin-bottom:26px; opacity:0; transform:translateY(20px); animation:ch-rise .9s var(--ease) .2s forwards; }
        .ch-hero__eye .ln { width:34px; height:1px; background:var(--gold); }
        .ch-hero h1 { font-family:var(--serif); font-weight:400; line-height:1.08; letter-spacing:-.025em; font-size:clamp(38px,5vw,76px); color:var(--ink); margin:0; }
        .ch-h-row { display:block; }
        .ch-w { display:inline-block; overflow:hidden; vertical-align:top; padding:.1em .03em; margin:-.1em .22em -.1em 0; }
        .ch-w > span { display:inline-block; transform:translateY(110%); opacity:.16; animation:ch-word .8s var(--ease) forwards; animation-delay:calc(var(--wi) * .09s + .35s); }
        .ch-h-row--em .ch-w > span { font-style:italic; color:var(--gold); }
        @keyframes ch-word { to { transform:none; opacity:1; } }
        .ch-hero__sub { margin-top:26px; max-width:440px; opacity:0; transform:translateY(20px); animation:ch-rise .9s var(--ease) .62s forwards; }
        .ch-hero__sub-lead { font-family:var(--util); font-size:12px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--ink); margin:0 0 10px; }
        .ch-hero__sub-body { font-family:var(--serif); font-style:italic; font-size:clamp(16px,1.5vw,20px); line-height:1.5; color:var(--ink-mid); margin:0; }
        .ch-hero__cta { display:inline-flex; flex-direction:column; gap:7px; margin-top:40px; cursor:pointer; background:none; border:none; padding:0; opacity:0; transform:translateY(20px); animation:ch-rise .9s var(--ease) .8s forwards; }
        .ch-hero__cta span:first-child { font-family:var(--util); font-size:12px; font-weight:700; letter-spacing:.24em; text-transform:uppercase; color:var(--ink); }
        .ch-hero__cta .uln { height:1.5px; background:var(--gold); transform:scaleX(0); transform-origin:left; animation:ch-draw 1s var(--ease) 1.2s forwards; }
        .ch-hero__cta:hover .uln { animation:none; transform:scaleX(1); background:var(--ink); }
        .ch-hero__media { position:relative; height:100vh; overflow:hidden; }
        .ch-hero__media img { position:absolute; inset:-12% 0; width:100%; height:124%; object-fit:cover; will-change:transform; clip-path:inset(0 0 100% 0); animation:ch-wipe 1.1s var(--ease) .25s forwards; }
        .ch-hero__media::after { content:''; position:absolute; inset:0; background:linear-gradient(115deg,var(--paper) 0%,rgba(247,245,242,.2) 22%,transparent 45%); }
        .ch-hero__scroll { position:absolute; left:7vw; bottom:34px; z-index:3; display:flex; align-items:center; gap:12px; font-family:var(--util); font-size:9px; font-weight:700; letter-spacing:.24em; text-transform:uppercase; color:var(--ink-soft); opacity:0; animation:ch-rise .9s var(--ease) 1.4s forwards; }
        .ch-hero__scroll .bar { width:46px; height:1px; background:var(--ink-soft); position:relative; overflow:hidden; }
        .ch-hero__scroll .bar::after { content:''; position:absolute; inset:0; background:var(--gold); transform:translateX(-100%); animation:ch-scrollbar 2s var(--ease) infinite; }

        @keyframes ch-rise { to { opacity:1; transform:none; } }
        @keyframes ch-wipe { to { clip-path:inset(0 0 0 0); } }
        @keyframes ch-draw { to { transform:scaleX(1); } }
        @keyframes ch-scrollbar { 0% { transform:translateX(-100%); } 60%,100% { transform:translateX(100%); } }

        @media (max-width:860px) {
          .ch-hero { grid-template-columns:1fr; padding:0 22px; }
          .ch-hero__text { padding:128px 0 40px; }
          .ch-hero__media { height:60vh; margin:0 -22px; }
          .ch-hero__media::after { background:linear-gradient(to top,var(--paper),transparent 45%); }
          .ch-hero__scroll { display:none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch-hero__eye, .ch-hero__cta, .ch-hero__scroll { opacity:1!important; transform:none!important; animation:none!important; }
          .ch-hero h1 .ch-w > span { transform:none!important; opacity:1!important; animation:none!important; }
          .ch-hero__media img { clip-path:none!important; transform:none!important; animation:none!important; }
          .ch-hero__cta .uln { transform:scaleX(1)!important; animation:none!important; }
        }
      `}</style>
    </section>
  );
};

export default CardiganHero;