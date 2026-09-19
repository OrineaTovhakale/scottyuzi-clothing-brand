// src/components/Categories.jsx — REFINED + MOTION (matches redesign sections)
// Imports, data arrays and navigation unchanged. Collections, "ScottyUzi to the
// World" and Social now match the redesign demo exactly (layout + motion).
import React, { useEffect, useRef, useState } from 'react';
import { categories } from '../assets/data';
import { useNavigate } from 'react-router-dom';
import ImageComparisonSlider from './ImageComparisonSlider';
import { asset } from '../utils/assets';

const capsMostLovedImg = asset('new/caps.png');
const originalShortsImg = asset('shorts1.png');
const originalJacketsImg = asset('jackets1.png');
const displayCapsImg = asset('newCaps/displayCaps.png');
const viewsWorldImg = asset('view2.png');
const stripeGreen = asset('newCaps/StripeGreen.png');
const stripeYellow = asset('newCaps/StripeYellow.png');
const stripeBrown = asset('newCaps/StripeBrown.png');
const stripeRed = asset('newCaps/StripeRed.png');
const suWingTshirtHover = asset('new/SU Wingpreview.png');
const flannelGreenHover = asset('new/greenflannelpreview.png');
const flannelGreen = asset('new/flannel green.png');
const never2Fly2PrayGray = asset('vday/2praygray.png');
const redFlannelThumb = asset('vday/thumb1.png');
const never2Fly2Pray = asset('vday/2pray.png');
const peelOff2 = asset('new/peel off tshirt2.png');
const essential11 = asset('new/essential tshirt 11.png');
const est2020 = asset('new/est 2020 tshirt.png');
const suWing = asset('new/SU Wing tshirt2.png');
const peelOffHover = asset('new/peel off tshirt.png');
const est2020Hover = asset('new/est 2020preview.png');
const suWingMostLovedHover = asset('new/SU Wing tshirt 4.png');
const iLuvMe = asset('iluvme.png');
const propertySU = asset('propertySU.png');
const redFlannel = asset('vday/red flannel.png');
const blanco1 = asset('blancoX/blanco1.png');
const bonnie = asset('vday/bonnie.png');
const hoodie = asset('hoodie.png');
const fc1 = asset('vday/fc1.png');
const fc2 = asset('vday/fc2.png');
const fc3 = asset('vday/fc3.png');
const blackMan = asset('MandelaDay/blackMan.png');
const redMan = asset('MandelaDay/redMan.png');
const zipSetBlack = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET 1.png');
const zipSetGray = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G1.png');
const shacket = asset('Final Selection SCOT/Never2Fly2Pray Guadian Shacket/Never2Fly2Pray Guadian Shacket.png');
const wingQZip = asset('Final Selection SCOT/SU Wing Quarter-Zip Hoodie/SU Wing Quarter-Zip Hoodie 2.png');
const fiveCap = asset('Final Selection SCOT/Never2Fly2Pray 5-Panel Cap/Never2Fly2Pray 5-Panel Cap 2.png');
const beanieGray = asset('Final Selection SCOT/SU Slouchy Beanies/SU Slouchy Beanies Gray1.png');
const beanieBlack = asset('Final Selection SCOT/SU Slouchy Beanies/SU Slouchy Beanies Black1.png');
const hatsMostLoved = asset('Final Selection SCOT/mostLoved/hatsmostloved.png');
const shortsMostLoved = asset('Final Selection SCOT/mostLoved/shortsmostloved.png');
const zipSetSpace = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET .png');
const zipSet2 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET 2.png');
const zipSet3 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET 3.png');
const zipSetG2 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G2.png');
const zipSetG3 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G3.png');
const zipSetG4 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G4.png');
const zipSetG5 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G5.png');
const zipHoodie = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP Hoodie.png');
const zipHoodie1 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP Hoodie1.png');
const zipHoodie2 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP Hoodie2.png');
const zipHoodieG = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP  HoodieG.png');
const zipHoodieG1 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP HoodieG1.png');
const shacket1 = asset('Final Selection SCOT/Never2Fly2Pray Guadian Shacket/Never2Fly2Pray Guadian Shacket1.png');
const shacket2 = asset('Final Selection SCOT/Never2Fly2Pray Guadian Shacket/Never2Fly2Pray Guardian Shacket2.png');
const wingH1 = asset('Final Selection SCOT/SU Wing Quarter-Zip Hoodie/SU Wing Quarter-Zip Hoodie 1.png');
const wingPlain = asset('Final Selection SCOT/SU Wing Quarter-Zip Hoodie/SU Wing Quarter-Zip Hoodie.png');
const fiveCap3 = asset('Final Selection SCOT/Never2Fly2Pray 5-Panel Cap/Never2Fly2Pray 5-Panel Cap 3.png');
const beanieGray2 = asset('Final Selection SCOT/SU Slouchy Beanies/SU Slouchy Beanies Gray2.png');
const beanieBlack2 = asset('Final Selection SCOT/SU Slouchy Beanies/SU Slouchy Beanies Black2.png');
const cargoMain = asset('pantsSale/CargoBellasMain.png');
const cargoHover = asset('pantsSale/CargoBellasHover.png');
const cargo1 = asset('pantsSale/CargoBellas1.png');
const cargo2 = asset('pantsSale/CargoBellas2.png');
const cargo3 = asset('pantsSale/CargoBellas3.png');
const prayOrange = asset('pantsSale/never2fly2prayorange.png');
const never1 = asset('never2fly2praycolours/Never1.png');
const fcPurple = asset('purp/fcPurple.png');
const capsTile = asset('Final Selection SCOT/Explore-our-collections/CapCollections.png');
const jacketsTile = asset('Final Selection SCOT/Explore-our-collections/JacketsCollection.png');
const tracksuitsTile = asset('Final Selection SCOT/Explore-our-collections/TracksuitsCollection.png');
const tshirtsTile = asset('Final Selection SCOT/Explore-our-collections/TshirtsCollection.png');
const scXwc1 = asset('worldcup/scXwc1.png');
const bafanaBlack = asset('worldcup/BafanaBlack.png');
const soc1 = asset('socials/soc1.jpg');
const soc2 = asset('socials/soc2.jpg');
const soc3 = asset('socials/soc3.jpg');
const soc4 = asset('socials/soc4.jpg');
const soc5 = asset('socials/soc5.jpg');
const soc6 = asset('socials/soc6.jpg');
const soc7 = asset('socials/soc7.jpg');
const soc8 = asset('socials/soc8.jpg');
const soc9 = asset('socials/soc9.jpg');
const soc10 = asset('socials/soc10.jpg');
const soc11 = asset('socials/soc11.jpg');
const soc12 = asset('socials/soc12.jpg');
const soc13 = asset('socials/soc13.jpg');
const soc14 = asset('socials/soc14.jpg');
const soc15 = asset('socials/soc15.jpg');
const soc16 = asset('socials/soc16.jpg');

// MAIN IMAGES

// STRIPE 5-PANEL SNAPBACK CAPS

// HOVER IMAGES — DISCOVER WHAT'S NEW

// MOST LOVED T-SHIRTS

// ── NEW PRODUCTS — DISCOVER WHAT'S NEW ──────────────────────────────────────
// Priority 1

// Priority 2

// ── SCOTTYUZI FC TEES — MANDELA DAY ─────────────────────────────────────────

// ── NEW SEASON DROP — Final Selection SCOT ──────────────────────────────────

// Most Loved section images

// Hover + PDP thumbnails for the New Drops line-up

// ── ONE FOR ONE THURSDAY — WOMEN'S DAY EDITION ──────────────────────────────

// ── NEVER 2FLY 2PRAY NEW COLOURS + FC PURPLE ────────────────────────────────

// New collection tile images

// ── BAFANA BAFANA WORLD CUP TEES ────────────────────────────────────────────

// SOCIAL IMAGES

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionLabel = ({ text }) => <p className="su-label">{text}</p>;
const SectionHeading = ({ children }) => <h2 className="su-heading">{children}</h2>;

const ProductCard = ({ name, image, hoverImage, price, onClick }) => (
  <article
    className={`su-card ${hoverImage ? 'su-card--has-hover' : ''}`}
    data-tilt
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
    tabIndex={0}
    role="button"
    aria-label={name}
  >
    <div className="su-card__img-wrap">
      <img src={image} alt={name} className="su-card__img su-card__img--main" loading="lazy" />
      {hoverImage && (
        <img src={hoverImage} alt={name + ' alternate view'} className="su-card__img su-card__img--hover" loading="lazy" />
      )}
      <span className="su-card__quick">View</span>
    </div>
    <div className="su-card__info">
      <p className="su-card__name">{name}</p>
      <p className="su-card__price">R {price?.toFixed(2)}</p>
    </div>
  </article>
);

// ─── Cap Drop Banner ─────────────────────────────────────────────────────────

const CapDropBanner = ({ navigate }) => {
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(id);
  }, []);

  const goToCaps = () => navigate('/collections?category=hats', { state: { scrollTo: 'stripe-snapback' } });

  return (
    <div className="cd-banner">
      <img src={displayCapsImg} alt="Stripe 5-Panel Snapback" className="cd-banner__img" />
      <div className="cd-banner__overlay" />
      <div className="cd-banner__content">
        <div className={`cd-anim cd-anim--label ${visible ? 'cd-anim--in' : ''}`}>
          <span className="cd-banner__pill">Limited Release</span>
        </div>
        <div className={`cd-anim cd-anim--heading ${visible ? 'cd-anim--in' : ''}`}>
          <h2 className="cd-banner__heading">Stripe 5-Panel<br /><em>Snapback</em></h2>
        </div>
        <div className={`cd-anim cd-anim--sub ${visible ? 'cd-anim--in' : ''}`}>
          <p className="cd-banner__sub">Four colourways. One silhouette. Zero restocks once they're gone — and yes, we mean that.</p>
        </div>
        <div className={`cd-anim cd-anim--swatches ${visible ? 'cd-anim--in' : ''}`}>
          <div className="cd-swatches">
            {[
              { colour: '#4A7C59', label: 'Green'  },
              { colour: '#D4B44A', label: 'Yellow' },
              { colour: '#6B4F3A', label: 'Brown'  },
              { colour: '#B03A2E', label: 'Red'    },
            ].map(s => (
              <div key={s.label} className="cd-swatch" title={s.label}>
                <span className="cd-swatch__dot" style={{ background: s.colour }} />
                <span className="cd-swatch__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`cd-anim cd-anim--timer ${visible ? 'cd-anim--in' : ''}`}>
          <button className="cd-banner__cta" onClick={goToCaps}>
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────

const Categories = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const tShirts              = categories.find(c => c.name === "T-Shirts");
  const tracksuits           = categories.find(c => c.name === "Tracksuits");
  const tshirtCollection     = tShirts?.collectionImage;
  const tracksuitsCollection = tracksuits?.collectionImage;
  const hatsCollection       = categories.find(c => c.name === "Hats")?.collectionImage;

  // ── MOTION: reveal + parallax + drift + statement + tilt (one effect) ──────
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('su-revealed'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    root.querySelectorAll('.su-reveal').forEach(el => io.observe(el));

    // ── TOUCH DEVICES: reveal only, no parallax / no tilt ──────────────────
    // These are the two things that fight a touch scroll:
    //  1. the tilt uses `mousemove`, and iOS *emulates* mousemove during a
    //     touch-drag — so dragging over a card writes a 3D transform on the
    //     element under your finger on every frame (and never gets mouseleave,
    //     so it stays stuck).
    //  2. the parallax calls getBoundingClientRect() for every element on
    //     every scroll frame, which forces a synchronous layout each time.
    // Together they produce the stutter/snap-back. Desktop keeps both.
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return () => io.disconnect();

    const par    = [...root.querySelectorAll('[data-parallax]')];
    const drifts = [...root.querySelectorAll('[data-drift]')];
    const stmt   = root.querySelector('.su-stmt');
    const words  = stmt ? [...stmt.querySelectorAll('.su-w')] : [];
    let vh = window.innerHeight, ticking = false;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const update = () => {
      ticking = false;
      // READ phase — gather every rect first (no writes in between = no layout thrash)
      const pr = par.map(el => ({ el, r: el.parentElement.getBoundingClientRect(), sp: parseFloat(el.dataset.speed || '0.85') }));
      const dr = drifts.map(el => ({ el, r: el.getBoundingClientRect(), amt: parseFloat(el.dataset.drift) }));
      const sr = stmt ? stmt.getBoundingClientRect() : null;
      // WRITE phase — apply transforms, skipping anything off-screen
      for (const { el, r, sp } of pr) {
        if (r.bottom < -120 || r.top > vh + 120) continue;
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(center * (sp - 1)).toFixed(1)}px, 0) scale(1.04)`;
      }
      for (const { el, r, amt } of dr) {
        if (r.bottom < -120 || r.top > vh + 120) continue;
        const prog = (vh - r.top) / (vh + r.height);
        el.style.transform = `translate3d(${((prog - 0.5) * amt).toFixed(1)}px,0,0)`;
      }
      if (sr) {
        const p = clamp((vh * 0.82 - sr.top) / (sr.height * 0.7), 0, 1);
        const lit = Math.floor(p * words.length);
        words.forEach((w, i) => w.classList.toggle('su-w--lit', i < lit));
      }
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    const onResize = () => { vh = window.innerHeight; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();

    // tilt (product cards + collection tiles)
    const tiltEls = [...root.querySelectorAll('[data-tilt]')];
    const onMove = (e) => {
      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      const wrap = card.querySelector('.su-card__img-wrap');
      if (wrap) { wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`; return; }
      const im = card.querySelector('img');
      if (im) im.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    };
    const onLeave = (e) => {
      const card = e.currentTarget;
      const wrap = card.querySelector('.su-card__img-wrap');
      if (wrap) { wrap.style.transform = ''; return; }
      const im = card.querySelector('img');
      if (im) im.style.transform = '';
    };
    tiltEls.forEach(c => {
      c.addEventListener('mousemove', onMove);
      c.addEventListener('mouseleave', onLeave);
      c.addEventListener('touchend', onLeave, { passive: true });   // never leave a card stuck mid-tilt
    });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      tiltEls.forEach(c => { c.removeEventListener('mousemove', onMove); c.removeEventListener('mouseleave', onLeave); c.removeEventListener('touchend', onLeave); });
    };
  }, []);

  // ── NEW DROPS — the new season line-up ───────────────────────────────────
  // EDIT PRICES HERE — placeholders until you confirm them:
  const NP = { zipSet: 1300, shacket: 750, hoodie: 750, cap: 250, beanie: 200, zipHoodie: 700 };

  // Never 2Fly 2Pray colour options (single image + colour picker on PDP)
  const NEVER_COLOURS = [
    'White and purple text',
    'Black and red text',
    'White and black text',
    'Black and green text',
    'White and red text',
    'White and blue text',
    'Black and cream white text',
  ];

  // Free sticker colours (same set used site-wide for stickers)
  const FREE_STICKER_COLOURS = [
    'Orange and Black',
    'Red and Black',
    'Green and Black',
    'Purple and Black',
    'Blue and Black',
    'White and Black',
  ];

  // Never 2Fly 2Pray tshirts — regular price R550
  const saleDrops = [
    { name: "Never 2Fly 2Pray", image: never1, hoverImage: null, price: 550,
      product: {
        name: "Never 2Fly 2Pray",
        image: never1,
        price: 550,
        isNew: true,
        hasColourOptions: true,
        colourOptions: NEVER_COLOURS,
        includesFreeSticker: true,
        freeStickerColours: FREE_STICKER_COLOURS,
      } },
    { name: "Cargo Bellas Trousers", image: cargoMain, hoverImage: cargoHover, price: 800,
      product: { name: "Cargo Bellas Trousers", image: cargoMain, images: [cargo1, cargo2, cargo3],
                 price: 800, isNew: true } },
    { name: "Never 2Fly 2Pray Orange", image: prayOrange, hoverImage: null, price: 550,
      product: {
        name: "Never 2Fly 2Pray Orange",
        image: prayOrange,
        price: 550,
        isNew: true,
        includesFreeSticker: true,
        freeStickerColours: FREE_STICKER_COLOURS,
      } },
  ];

  const newDrops = [
    { name: "SU Essential Zip Set — Black",    image: zipSetBlack, hoverImage: zipSetSpace, price: NP.zipSet,
      product: { name: "SU Essential Zip Set — Black", tagline: "Everyday. Elevated.",    image: zipSetBlack, images: [zipSet2, zipSet3, zipSetSpace], price: NP.zipSet, isNew: true } },
    { name: "SU Essential Zip Set — Gray",     image: zipSetGray,  hoverImage: zipSetG2,    price: NP.zipSet,
      product: { name: "SU Essential Zip Set — Gray", tagline: "Everyday. Elevated.",     image: zipSetGray,  images: [zipSetG2, zipSetG3, zipSetG4, zipSetG5], price: NP.zipSet, isNew: true } },
    { name: "SU Essential Zip Hoodie",         image: zipHoodie,   hoverImage: zipHoodie1,  price: NP.zipHoodie,
      product: { name: "SU Essential Zip Hoodie",         image: zipHoodie,   images: [zipHoodie1, zipHoodie2, zipSetBlack, zipHoodieG, zipHoodieG1], price: NP.zipHoodie, isNew: true } },
    { name: "Never2Fly2Pray Guardian Shacket", image: shacket,     hoverImage: shacket2,    price: NP.shacket,
      product: { name: "Never2Fly2Pray Guardian Shacket", tagline: "Faith Worn. Fear Forgotten.", image: shacket,     images: [shacket1, shacket2],            price: NP.shacket, isNew: true } },
    { name: "SU Wing Quarter-Zip Hoodie",      image: wingQZip,    hoverImage: wingPlain,   price: NP.hoodie,
      product: { name: "SU Wing Quarter-Zip Hoodie", tagline: "Rise Above.",      image: wingQZip,    images: [wingH1, wingPlain],             price: NP.hoodie, isNew: true } },
    { name: "Never2Fly2Pray 5-Panel Cap",      image: fiveCap,     hoverImage: fiveCap3,    price: NP.cap,
      product: { name: "Never2Fly2Pray 5-Panel Cap", tagline: "Wear Your Purpose.",      image: fiveCap,     images: [fiveCap3],                      price: NP.cap, isNew: true } },
    { name: "SU Slouchy Beanie — Gray",        image: beanieGray,  hoverImage: beanieGray2, price: NP.beanie,
      product: { name: "SU Slouchy Beanie — Gray", tagline: "Comfort Without Compromise.",        image: beanieGray,  images: [beanieGray2],                   price: NP.beanie, isNew: true } },
    { name: "SU Slouchy Beanie — Black",       image: beanieBlack, hoverImage: beanieBlack, price: NP.beanie,
      product: { name: "SU Slouchy Beanie — Black", tagline: "Comfort Without Compromise.",       image: beanieBlack, images: [beanieBlack2, beanieBlack],     price: NP.beanie, isNew: true } },
  ];

  const mostLovedTshirts = [
    { name: "Flannel Green Shirt", image: flannelGreen,   hoverImage: flannelGreenHover,  price: 500 },
    {
      name: "Never 2Fly 2Pray", image: never1, hoverImage: never2Fly2PrayGray, price: 550,
      hasColourOptions: true, colourOptions: NEVER_COLOURS,
      includesFreeSticker: true, freeStickerColours: FREE_STICKER_COLOURS, isNew: true,
    },
    {
      name: "ScottyUzi FC Purple", image: fcPurple, hoverImage: null, price: 350,
      includesFreeSticker: true, freeStickerColours: FREE_STICKER_COLOURS, isNew: true,
    },
    { name: "Red Flannel Shirt",   image: redFlannel,     hoverImage: redFlannelThumb,    price: 550 },
    { name: "SU Wing T-Shirt",     image: suWing,         hoverImage: suWingMostLovedHover, price: 550 },
  ];

  const socialPosts = [
    { id:1,  media:soc1,  caption:"New drop alert! Limited stock available.",  date:"Nov 28, 2025", likes:1247 },
    { id:2,  media:soc2,  caption:"Behind the scenes of our latest shoot.",     date:"Nov 27, 2025", likes:2891 },
    { id:3,  media:soc3,  caption:"Mafia 2.0 is here.",                         date:"Nov 26, 2025", likes:3542 },
    { id:4,  media:soc4,  caption:"ScottyUzi to the World.",                    date:"Nov 25, 2025", likes:4128 },
    { id:5,  media:soc5,  caption:"Fresh fits, fresh vibes.",                   date:"Nov 24, 2025", likes:1876 },
    { id:6,  media:soc6,  caption:"Thank you for 10K followers!",               date:"Nov 23, 2025", likes:9823 },
    { id:7,  media:soc7,  caption:"Restock incoming.",                          date:"Nov 22, 2025", likes:2341 },
    { id:8,  media:soc8,  caption:"Streetwear never sleeps.",                   date:"Nov 21, 2025", likes:1654 },
    { id:9,  media:soc9,  caption:"Which one are you copping?",                 date:"Nov 20, 2025", likes:3298 },
    { id:10, media:soc10, caption:"Classic never dies.",                        date:"Nov 19, 2025", likes:2756 },
    { id:11, media:soc11, caption:"Winter essentials dropping soon.",            date:"Nov 18, 2025", likes:1923 },
    { id:12, media:soc12, caption:"Tag a friend who needs this.",                date:"Nov 17, 2025", likes:4567 },
    { id:13, media:soc13, caption:"Quality over everything.",                   date:"Nov 16, 2025", likes:2134 },
    { id:14, media:soc14, caption:"ScottyUzi season.",                          date:"Nov 15, 2025", likes:3821 },
    { id:15, media:soc15, caption:"Built different.",                           date:"Nov 14, 2025", likes:2987 },
    { id:16, media:soc16, caption:"The movement continues.",                    date:"Nov 13, 2025", likes:1765 },
  ];

  // lifestyle masonry (matches redesign: 5 figures, varied positions + parallax)
  const lifePosts  = [socialPosts[1], socialPosts[3], socialPosts[4], socialPosts[8], socialPosts[13]];
  const lifeSpeeds = [1.12, 0.9, 1.18, 0.86, 1.06];

  const tickerItemsFwd = [
    "FAST SHIPPING ON ORDERS ABOVE R700",
    "DISCOUNTS AVAILABLE FOR MEMBERS",
    "FAST SHIPPING ON ORDERS ABOVE R700",
    "DISCOUNTS AVAILABLE FOR MEMBERS",
  ];
  const tickerItemsRev = [
    "24/7 CUSTOMER SUPPORT",
    "SAFE & SECURE PACKAGING FOR ALL ORDERS",
    "24/7 CUSTOMER SUPPORT",
    "SAFE & SECURE PACKAGING FOR ALL ORDERS",
  ];

  // collection tiles — feature / wide rhythm like the redesign
  const collectionTiles = [
    { img: jacketsTile,      label: "Jackets",    mod: "su-col--feat", to: '/collections?category=jackets' },
    { img: tshirtsTile,      label: "T-Shirts",   mod: "",             to: '/collections?category=t-shirts' },
    { img: capsTile,         label: "Hats",       mod: "",             to: '/collections?category=hats' },
    { img: tracksuitsTile,   label: "Tracksuits", mod: "su-col--wide", to: '/collections?category=tracksuits' },
  ];

  return (
    <section className="su-root" ref={sectionRef}>

      {/* ── 2. COLLECTIONS (asymmetric editorial — matches redesign) ── */}
      <div className="su-section su-reveal">
        <div className="su-section__header">
          <SectionLabel text="The Edit" />
          <SectionHeading>Explore Our Collections</SectionHeading>
        </div>
        <div className="su-cols">
          {collectionTiles.map((c, i) => (
            <a key={i} className={`su-col ${c.mod} su-reveal`} style={{ '--i': i }} data-tilt
               role="button" tabIndex={0}
               onClick={() => navigate(c.to)}
               onKeyDown={(e) => { if (e.key === 'Enter') navigate(c.to); }}>
              <img src={c.img} alt={c.label} loading="lazy" />
              <span className="su-col__veil" />
              <div className="su-col__lab"><span>{c.label}</span><em>Shop Collection &rarr;</em></div>
            </a>
          ))}
        </div>
      </div>

      {/* ── BRAND TICKER ────────────────────────────────────────────── */}
      <div className="su-ticker-wrap">
        <div className="su-ticker su-ticker--dark">
          <div className="su-ticker__track su-ticker__track--fwd">
            {["BUILT FOR EVERYDAY", "FAITH WORN, FEAR FORGOTTEN.", "COMFORT WITHOUT COMPROMISE.", "WEAR YOUR PURPOSE.",
              "BUILT FOR EVERYDAY", "FAITH WORN, FEAR FORGOTTEN.", "COMFORT WITHOUT COMPROMISE.", "WEAR YOUR PURPOSE."].map((t, i) => (
              <span key={i} className="su-ticker__item">{t}</span>
            ))}
          </div>
        </div>
        <div className="su-ticker su-ticker--light">
          <div className="su-ticker__track su-ticker__track--rev">
            {["BUILT FOR EVERYDAY", "FAITH WORN, FEAR FORGOTTEN.", "COMFORT WITHOUT COMPROMISE.", "WEAR YOUR PURPOSE.",
              "BUILT FOR EVERYDAY", "FAITH WORN, FEAR FORGOTTEN.", "COMFORT WITHOUT COMPROMISE.", "WEAR YOUR PURPOSE."].map((t, i) => (
              <span key={i} className="su-ticker__item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEW DROPS ───────────────────────────────────────────────── */}
      <div className="su-section su-reveal" id="new-drops">
        <div className="su-section__header">
          <SectionLabel text="Just Landed" />
          <SectionHeading>New Drops</SectionHeading>
        </div>
        <div className="su-grid su-grid--4 su-grid--stagger">
          {[...saleDrops, ...newDrops].map((item, i) => (
            <ProductCard key={i} name={item.name} image={item.image} hoverImage={item.hoverImage} price={item.price}
              onClick={() => navigate('/product', { state: { product: item.product } })} />
          ))}
        </div>
        <div className="su-section__foot">
          <button className="su-btn" onClick={() => navigate('/collections?category=new-products')}>View All New Drops</button>
        </div>
      </div>

      {/* breathing space before the slider */}
      <div style={{ height: 'clamp(48px, 8vw, 110px)' }} aria-hidden="true" />

      {/* ── FLANNEL SLIDER ──────────────────────────────────────────── */}
      <div className="su-reveal">
        <ImageComparisonSlider />
      </div>

      {/* ── 4. MOST LOVED — HATS & SHORTS ──────────────────────────── */}
      <div className="su-section su-section--dark su-reveal">
        <div className="su-section__header">
          <SectionLabel text="Customer Favourites" />
          <SectionHeading>Most Loved</SectionHeading>
        </div>
        <div className="su-grid su-grid--2">
          <div className="su-hero-card" onClick={() => navigate('/collections?category=hats')}>
            <img src={hatsMostLoved} alt="Hats" className="su-hero-card__img" loading="lazy" />
            <div className="su-hero-card__overlay" />
            <p className="su-hero-card__label">Hats</p>
          </div>
          <div className="su-hero-card" onClick={() => navigate('/collections?category=shorts')}>
            <img src={shortsMostLoved} alt="Shorts" className="su-hero-card__img" loading="lazy" />
            <div className="su-hero-card__overlay" />
            <p className="su-hero-card__label">Shorts</p>
          </div>
        </div>
      </div>

      {/* ── 5. MOST LOVED T-SHIRTS ──────────────────────────────────── */}
      <div className="su-section su-reveal">
        <div className="su-section__header">
          <SectionLabel text="Fan Picks" />
          <SectionHeading>Most Loved T-Shirts</SectionHeading>
        </div>
        <div className="su-grid su-grid--4">
          {mostLovedTshirts.map((t, i) => (
            <ProductCard key={i} name={t.name} image={t.image} hoverImage={t.hoverImage} price={t.price}
              onClick={() => navigate('/product', { state: { product: t } })} />
          ))}
        </div>
        <div className="su-section__foot">
          <button className="su-btn" onClick={() => navigate('/collections?category=t-shirts')}>More T-Shirts</button>
        </div>
      </div>

      {/* ── 6. SCOTTYUZI TO THE WORLD (kinetic — matches redesign) ──── */}
      <div className="su-world su-reveal">
        <div className="su-world__img">
          <img src={viewsWorldImg} alt="ScottyUzi" data-parallax data-speed="0.7" />
        </div>
        <div className="su-world__t">
          <span className="su-world__ln su-world__ln1" data-drift="-160">SCOTTYUZI</span>
          <span className="su-world__ln su-world__ln2" data-drift="180">TO THE WORLD</span>
        </div>
        <div className="su-world__cap"><span className="su-label su-label--gold-soft">Est. 2020 · Friends Don't Forget Friends</span></div>
      </div>

      {/* ── 7. TICKER BANNERS ───────────────────────────────────────── */}
      <div className="su-ticker-wrap">
        <div className="su-ticker su-ticker--dark">
          <div className="su-ticker__track su-ticker__track--fwd">
            {tickerItemsFwd.map((t, i) => <span key={i} className="su-ticker__item">{t}</span>)}
          </div>
        </div>
        <div className="su-ticker su-ticker--light">
          <div className="su-ticker__track su-ticker__track--rev">
            {tickerItemsRev.map((t, i) => <span key={i} className="su-ticker__item">{t}</span>)}
          </div>
        </div>
      </div>

      {/* ── 8. SOCIAL — LIFESTYLE MASONRY (matches redesign) ────────── */}
      <div className="su-section su-reveal">
        <div className="su-section__header su-section__header--row">
          <div>
            <SectionLabel text="Follow Along" />
            <SectionHeading>Social Platforms</SectionHeading>
          </div>
          <a className="su-all" href="https://www.instagram.com/scotty.uzi_merchandise/" target="_blank" rel="noopener noreferrer">@scottyuzi_merchandise</a>
        </div>
        <div className="su-life">
          {lifePosts.map((post, i) => (
            <figure key={post.id} className={`su-lf su-lf--${i + 1} su-reveal`} style={{ '--i': i }} onClick={() => setSelectedPost(post)}>
              <div className="su-lf__inner" data-parallax data-speed={lifeSpeeds[i]}>
                <img src={post.media} alt="ScottyUzi lifestyle" loading="lazy" />
              </div>
              <div className="su-lf__hover">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>{post.likes.toLocaleString()}</span>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* ── 9. SOCIAL MODAL ─────────────────────────────────────────── */}
      {selectedPost && (
        <div className="su-modal-backdrop" onClick={() => setSelectedPost(null)}>
          <button className="su-modal-close" onClick={() => setSelectedPost(null)}>×</button>
          <div className="su-modal" onClick={e => e.stopPropagation()}>
            <div className="su-modal__media"><img src={selectedPost.media} alt="post" /></div>
            <div className="su-modal__info">
              <div className="su-modal__account">
                <div className="su-modal__avatar">SU</div>
                <span>scottyuzi_merchandise</span>
              </div>
              <p className="su-modal__caption"><strong>scottyuzi_merchandise</strong> {selectedPost.caption}</p>
              <div className="su-modal__foot">
                <svg viewBox="0 0 24 24" fill="currentColor" className="su-modal__heart"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>{selectedPost.likes.toLocaleString()} likes</span>
                <time>{selectedPost.date}</time>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STYLES ──────────────────────────────────────────────────── */}
      <style jsx>{`
        .su-root {
          --ink:#1A1A1A; --ink-mid:#5B5854; --ink-soft:#9A948C;
          --paper:#E5E5E5; --well:#EBEBEB; --paper-dark:#D9D9D9; --border:#D4D4D4;
          --white:#FFFFFF; --accent:#C8972E; --gold-soft:#E5C77E;
          --ease:cubic-bezier(.22,1,.36,1);
          background:var(--paper); color:var(--ink); overflow-x:hidden; max-width:100%;
        }

        /* REVEAL (with optional --i stagger) */
        .su-reveal { opacity:0; transform:translateY(40px); transition:opacity .9s var(--ease), transform .9s var(--ease); transition-delay:calc(var(--i,0) * .08s); }
        .su-revealed { opacity:1; transform:none; }

        /* SECTION */
        .su-section { max-width:1480px; margin:0 auto; padding:9vh 40px; }
        @media (max-width:768px) { .su-section { padding:7vh 20px; } }
        .su-section--dark { background:var(--ink); max-width:100%; padding:9vh 40px; }
        .su-section--dark .su-section__header { max-width:1480px; margin-left:auto; margin-right:auto; }
        .su-section--dark .su-label { color:var(--accent); }
        .su-section--dark .su-heading { color:var(--white); }
        .su-section--dark .su-heading::before { background:rgba(255,255,255,0.14); }
        @media (max-width:768px) { .su-section--dark { padding:7vh 20px; } }
        .su-section__header { margin-bottom:60px; }
        .su-section__header--row { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; }
        .su-section__foot { text-align:center; margin-top:56px; }

        .su-label { display:inline-block; font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:var(--accent); margin:0 0 14px; }
        .su-label--gold-soft { color:var(--gold-soft); }
        .su-heading { position:relative; font-family:'Georgia','Times New Roman',serif; font-size:clamp(30px,4vw,58px); font-weight:400; letter-spacing:-.02em; line-height:1.04; color:var(--ink); margin:0; }
        .su-all { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ink); text-decoration:none; border-bottom:1px solid var(--ink); padding-bottom:5px; white-space:nowrap; transition:color .2s, border-color .2s; }
        .su-all:hover { color:var(--accent); border-color:var(--accent); }

        /* BUTTON */
        .su-btn { display:inline-flex; align-items:center; justify-content:center; background:transparent; color:var(--ink); border:1px solid var(--ink); padding:15px 40px; cursor:pointer; font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; transition:background .35s var(--ease), color .35s var(--ease), transform .35s var(--ease); }
        .su-btn:hover { background:var(--ink); color:var(--white); transform:translateX(4px); }
        .su-section--dark .su-btn { color:var(--white); border-color:rgba(255,255,255,0.4); }
        .su-section--dark .su-btn:hover { background:var(--white); color:var(--ink); border-color:var(--white); }

        /* GRIDS */
        .su-grid { display:grid; gap:30px 24px; width:100%; }
        .su-grid > * { min-width:0; box-sizing:border-box; }
        .su-grid--4 { grid-template-columns:repeat(4,minmax(0,1fr)); }
        .su-grid--2 { grid-template-columns:repeat(2,minmax(0,1fr)); gap:24px; }
        @media (max-width:1100px) { .su-grid--4 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
        @media (max-width:560px) { .su-grid--2 { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; } .su-grid--4 { grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px 12px; } }
        /* PHONES — one product per row so the pieces are actually visible */
        @media (max-width:480px) {
          .su-grid--4 { grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px 12px; }
          .su-grid--stagger { margin-bottom:32px; }
          .su-grid--stagger > *:nth-child(even) { transform:none; margin-top:0; }
        }

        /* Cards stay on a straight horizontal line — no vertical stagger */
        @media (min-width:1101px) {
          .su-grid--stagger { margin-bottom:0; }
          .su-grid--stagger .su-card { transform:none; }
        }

        /* PRODUCT CARD */
        .su-card { min-width:0; cursor:pointer; background:none; border:none; overflow:visible; -webkit-tap-highlight-color:transparent; }
        .su-card__img-wrap { position:relative; aspect-ratio:4/5; overflow:hidden; background:var(--well); border:1px solid var(--border); transition:box-shadow .5s var(--ease), transform .35s var(--ease); }
        .su-card:hover .su-card__img-wrap { box-shadow:0 30px 60px -28px rgba(26,26,26,.4); }
        .su-card__img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; padding:0; transition:transform .7s var(--ease), opacity .4s ease; }
        .su-card__img--main { opacity:1; } .su-card__img--hover { opacity:0; }
        .su-card--has-hover:hover .su-card__img--main, .su-card--has-hover:focus-visible .su-card__img--main { opacity:0; }
        .su-card:not(.su-card--has-hover):hover .su-card__img--main { transform:scale(1.05); }
        .su-card--has-hover:hover .su-card__img--hover { opacity:1; transform:scale(1.05); }
        .su-card__quick { position:absolute; left:50%; bottom:16px; transform:translate(-50%,14px); display:flex; align-items:center; justify-content:center; background:rgba(26,26,26,0.92); color:#fff; font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; padding:10px 26px; opacity:0; pointer-events:none; backdrop-filter:blur(2px); transition:opacity .35s var(--ease), transform .35s var(--ease); }
        .su-card:hover .su-card__quick, .su-card:focus-visible .su-card__quick { opacity:1; transform:translate(-50%,0); }
        .su-card__info { padding:16px 2px 0; display:flex; align-items:baseline; justify-content:space-between; gap:12px; min-width:0; }
        .su-card__name { position:relative; flex:1 1 auto; min-width:0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:12px; font-weight:500; letter-spacing:.04em; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0; }
        .su-card__name::after { content:''; position:absolute; left:0; bottom:-3px; width:100%; height:1px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .4s var(--ease); }
        .su-card:hover .su-card__name::after { transform:scaleX(1); }
        .su-card__price { font-family:'Georgia',serif; font-size:13px; color:var(--ink-mid); margin:0; white-space:nowrap; }

        /* KINETIC STATEMENT */
        .su-stmt { max-width:1480px; margin:0 auto; padding:4vh 40px 12vh; }
        @media (max-width:768px) { .su-stmt { padding:2vh 20px 8vh; } }
        .su-stmt__p { font-family:'Georgia',serif; font-weight:400; font-style:italic; line-height:1.5; letter-spacing:-.01em; word-spacing:.08em; font-size:clamp(24px,3.4vw,50px); color:var(--ink); margin:18px 0 0; max-width:18ch; }
        @media (max-width:768px) { .su-stmt__p { line-height:1.55; max-width:none; } }
        /* mask is padded top+bottom so ascenders/descenders never clip on wrap */
        .su-w { display:inline-block; overflow:hidden; vertical-align:top; padding:.12em .04em; margin:-.12em 0; }
        .su-w > span { display:inline-block; transform:translateY(115%); opacity:.16; transition:transform .6s var(--ease), opacity .6s var(--ease); }
        .su-w--lit > span { transform:none; opacity:1; }

        /* COLLECTIONS — asymmetric editorial (matches redesign .cols/.col) */
        .su-cols { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); grid-auto-rows:230px; gap:16px; }
        .su-col { position:relative; overflow:hidden; cursor:pointer; text-decoration:none; grid-column:span 2; grid-row:span 1; -webkit-tap-highlight-color:transparent; }
        .su-col--feat { grid-column:span 2; grid-row:span 2; }
        .su-col--wide { grid-column:span 2; }
        @media (max-width:760px) {
          .su-cols { grid-template-columns:1fr 1fr; grid-auto-rows:180px; }
          .su-col, .su-col--feat, .su-col--wide { grid-column:span 1; grid-row:span 1; }
          .su-col--feat { grid-column:span 2; grid-row:span 2; }
        }
        .su-col img { width:100%; height:100%; object-fit:cover; transition:transform .9s var(--ease); }
        /* full-image tile — no cropping (hats) */
        .su-col--contain { background: var(--well, #EDEAE5); }
        .su-col--contain img { object-fit: contain; }
        .su-col:hover img { transform:scale(1.07); }
        .su-col__veil { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,.05) 55%, transparent); transition:.4s; }
        .su-col:hover .su-col__veil { background:linear-gradient(to top, rgba(0,0,0,.74), rgba(0,0,0,.1) 55%, transparent); }
        .su-col__lab { position:absolute; left:0; right:0; bottom:0; padding:24px; }
        .su-col__lab span { display:block; font-family:'Georgia',serif; font-size:clamp(20px,2vw,32px); color:#fff; }
        .su-col__lab em { font-family:'Helvetica Neue',Arial,sans-serif; font-style:normal; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-soft); opacity:0; transform:translateY(6px); transition:.3s var(--ease); display:inline-block; margin-top:8px; }
        .su-col:hover .su-col__lab em { opacity:1; transform:none; }

        /* HERO CARD (dark Most-Loved) */
        .su-hero-card { position:relative; aspect-ratio:4/5; overflow:hidden; cursor:pointer; max-width:600px; margin:0 auto; width:100%; -webkit-tap-highlight-color:transparent; }
        .su-hero-card__img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .7s var(--ease); }
        .su-hero-card__img--contain { object-fit:contain; background:var(--well); padding:6%; }
        .su-hero-card:hover .su-hero-card__img { transform:scale(1.05); }
        .su-hero-card__overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%); }
        .su-hero-card__label { position:absolute; bottom:34px; left:0; right:0; text-align:center; font-family:'Georgia',serif; font-size:clamp(26px,4vw,50px); font-weight:400; color:var(--white); letter-spacing:.04em; }

        /* SCOTTYUZI TO THE WORLD — kinetic (matches redesign .world) */
        .su-world { position:relative; background:var(--ink); overflow:hidden; padding:18vh 0; }
        .su-world__img { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:min(34vw,420px); z-index:2; }
        .su-world__img img { width:100%; will-change:transform; }
        .su-world__t { position:relative; z-index:1; display:flex; flex-direction:column; gap:0; pointer-events:none; }
        .su-world__ln { font-family:'Helvetica Neue','Arial Black',sans-serif; font-weight:900; text-transform:uppercase; line-height:.82; letter-spacing:-.04em; white-space:nowrap; will-change:transform; }
        .su-world__ln1 { font-size:clamp(70px,15vw,230px); color:#fff; align-self:flex-start; }
        .su-world__ln2 { font-size:clamp(46px,10vw,150px); color:var(--accent); align-self:flex-end; }
        .su-world__cap { text-align:center; margin-top:7vh; position:relative; z-index:3; }

        /* TICKER */
        .su-ticker-wrap { overflow:hidden; width:100%; max-width:100%; }
        .su-ticker { overflow:hidden; width:100%; }
        .su-ticker--dark { background:var(--ink); padding:18px 0; }
        .su-ticker--light { background:var(--white); padding:18px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        .su-ticker__track { display:inline-flex; white-space:nowrap; }
        .su-ticker__track--fwd { animation:ticker-fwd 32s linear infinite; }
        .su-ticker__track--rev { animation:ticker-rev 32s linear infinite; }
        .su-ticker__item { display:inline-flex; align-items:center; padding:0 30px; font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; }
        .su-ticker__item::before { content:''; width:5px; height:5px; margin-right:30px; background:var(--accent); transform:rotate(45deg); flex-shrink:0; }
        .su-ticker--dark .su-ticker__item { color:var(--white); }
        .su-ticker--light .su-ticker__item { color:var(--ink); }
        @keyframes ticker-fwd { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes ticker-rev { from { transform:translateX(-50%); } to { transform:translateX(0); } }

        /* SOCIAL — LIFESTYLE MASONRY (matches redesign .life/.lf) */
        .su-life { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:16px; align-items:start; }
        .su-lf { position:relative; overflow:hidden; cursor:pointer; margin:0; }
        .su-lf__inner { position:absolute; inset:-12% 0; height:124%; overflow:hidden; will-change:transform; }
        .su-lf__inner img { width:100%; height:100%; object-fit:cover; transition:transform .9s var(--ease); }
        .su-lf:hover .su-lf__inner img { transform:scale(1.06); }
        .su-lf__hover { position:absolute; inset:0; z-index:2; background:rgba(26,26,26,0.5); display:flex; align-items:center; justify-content:center; gap:8px; color:#fff; opacity:0; transition:opacity .3s ease; font-family:'Helvetica Neue',Arial,sans-serif; font-size:13px; font-weight:600; }
        .su-lf__hover svg { width:18px; height:18px; color:var(--accent); }
        .su-lf:hover .su-lf__hover { opacity:1; }
        .su-lf--1 { grid-column:1/6; aspect-ratio:4/5; }
        .su-lf--2 { grid-column:6/10; aspect-ratio:1; margin-top:48px; }
        .su-lf--3 { grid-column:10/13; aspect-ratio:3/4; }
        .su-lf--4 { grid-column:1/5; aspect-ratio:1; margin-top:8px; }
        .su-lf--5 { grid-column:5/10; aspect-ratio:4/3; margin-top:-40px; }
        @media (max-width:760px) {
          .su-life { grid-template-columns:1fr 1fr; }
          .su-lf { grid-column:auto !important; margin-top:0 !important; aspect-ratio:4/5 !important; }
        }

        /* MODAL */
        .su-modal-backdrop { position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.82); display:flex; align-items:center; justify-content:center; padding:20px; animation:su-fade .25s ease; }
        @keyframes su-fade { from { opacity:0; } to { opacity:1; } }
        .su-modal-close { position:fixed; top:20px; right:20px; z-index:10001; width:46px; height:46px; background:var(--white); color:var(--ink); border:none; border-radius:50%; font-size:26px; font-weight:300; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform .25s, background .2s; }
        .su-modal-close:hover { transform:rotate(90deg); background:var(--paper-dark); }
        .su-modal { display:flex; flex-direction:row; max-width:880px; width:100%; background:var(--white); overflow:hidden; animation:su-pop .35s var(--ease); }
        @keyframes su-pop { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:none; } }
        @media (max-width:680px) { .su-modal { flex-direction:column; } }
        .su-modal__media { width:60%; background:var(--well); display:flex; align-items:center; justify-content:center; }
        @media (max-width:680px) { .su-modal__media { width:100%; } }
        .su-modal__media img { max-width:100%; max-height:80vh; object-fit:contain; }
        .su-modal__info { width:40%; padding:30px 26px; display:flex; flex-direction:column; gap:14px; border-left:1px solid var(--border); }
        @media (max-width:680px) { .su-modal__info { width:100%; border-left:none; border-top:1px solid var(--border); } }
        .su-modal__account { display:flex; align-items:center; gap:10px; padding-bottom:14px; border-bottom:1px solid var(--border); }
        .su-modal__avatar { width:38px; height:38px; border-radius:50%; background:var(--ink); color:var(--white); display:flex; align-items:center; justify-content:center; font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:.05em; }
        .su-modal__account span { font-family:'Helvetica Neue',Arial,sans-serif; font-size:12px; font-weight:600; color:var(--ink); }
        .su-modal__caption { font-family:'Georgia',serif; font-size:14px; line-height:1.65; color:var(--ink-mid); flex:1; }
        .su-modal__caption strong { color:var(--ink); font-weight:700; }
        .su-modal__foot { display:flex; align-items:center; gap:10px; padding-top:14px; border-top:1px solid var(--border); font-family:'Helvetica Neue',Arial,sans-serif; font-size:12px; color:var(--ink-mid); }
        .su-modal__foot time { margin-left:auto; font-size:10px; letter-spacing:.07em; text-transform:uppercase; }
        .su-modal__heart { width:16px; height:16px; color:var(--accent); }

        /* CAP DROP BANNER */
        .cd-banner { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#0D0D0D; }
        @media (max-width:768px) { .cd-banner { aspect-ratio:2/3; } }
        .cd-banner__img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; transition:transform 8s ease; }
        .cd-banner:hover .cd-banner__img { transform:scale(1.03); }
        .cd-banner__overlay { position:absolute; inset:0; background:linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.16) 100%); }
        @media (max-width:768px) { .cd-banner__overlay { background:linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.78) 55%, rgba(0,0,0,0.92) 100%); } }
        .cd-banner__content { position:relative; z-index:2; display:flex; flex-direction:column; align-items:flex-start; text-align:left; padding:0 8%; gap:18px; max-width:700px; width:100%; }
        @media (max-width:768px) { .cd-banner__content { align-items:center; text-align:center; padding:0 24px; justify-content:flex-end; padding-bottom:10%; max-width:100%; height:100%; } }
        .cd-banner__pill { display:inline-block; padding:6px 16px; border:1px solid rgba(200,151,46,0.5); font-family:'Helvetica Neue',Arial,sans-serif; font-size:9px; font-weight:700; letter-spacing:.26em; text-transform:uppercase; color:var(--accent); backdrop-filter:blur(4px); background:rgba(200,151,46,0.08); }
        .cd-banner__heading { font-family:'Georgia',serif; font-size:clamp(38px,6vw,88px); font-weight:400; letter-spacing:-.03em; line-height:.95; color:var(--white); margin:0; }
        .cd-banner__heading em { font-style:italic; color:var(--accent); }
        .cd-banner__sub { font-family:'Helvetica Neue',Arial,sans-serif; font-size:clamp(12px,1.1vw,14px); font-weight:400; letter-spacing:.02em; line-height:1.7; color:rgba(255,255,255,0.6); max-width:360px; margin:0; }
        @media (max-width:768px) { .cd-banner__sub { max-width:100%; } }
        .cd-swatches { display:flex; align-items:center; gap:16px; margin-top:2px; }
        .cd-swatch { display:flex; align-items:center; gap:7px; cursor:default; }
        .cd-swatch__dot { width:13px; height:13px; border-radius:50%; border:1px solid rgba(255,255,255,0.3); display:block; flex-shrink:0; }
        .cd-swatch__label { font-family:'Helvetica Neue',Arial,sans-serif; font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,0.5); }
        .cd-anim { opacity:0; transform:translateY(22px); transition:opacity .7s var(--ease), transform .7s var(--ease); }
        .cd-anim--in { opacity:1; transform:none; }
        .cd-anim--label { transition-delay:.05s; } .cd-anim--heading { transition-delay:.18s; }
        .cd-anim--sub { transition-delay:.30s; } .cd-anim--swatches { transition-delay:.40s; } .cd-anim--timer { transition-delay:.52s; }
        .cd-banner__cta { display:inline-flex; align-items:center; gap:10px; margin-top:8px; padding:15px 38px; background:var(--white); color:var(--ink); border:none; cursor:pointer; font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; transition:background .25s, transform .3s var(--ease), gap .3s; }
        .cd-banner__cta:hover { background:var(--accent); color:var(--white); transform:translateX(6px); gap:14px; }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .su-reveal { opacity:1!important; transform:none!important; }
          .su-grid--stagger .su-card { transform:none!important; }
          .su-w > span { transform:none!important; opacity:1!important; }
          .su-world__ln, .su-world__img img, .su-lf__inner { transform:none!important; }
          .su-lf__inner { inset:0!important; height:100%!important; }
        }
      `}</style>
    </section>
  );
};

export default Categories;