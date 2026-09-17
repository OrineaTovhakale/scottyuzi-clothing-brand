// src/pages/About.jsx — REFINED to match the new design language.
// Copy, data source and images unchanged. Styling moved to the editorial system
// (Georgia headings, cream, hairline borders, gold accent, subtle reveals).
import React, { useEffect, useRef } from 'react';
import { categories } from '../assets/data';

const About = () => {
  const aboutData = categories.find(cat => cat.name === "About")?.images || [];
  const topImage = aboutData[0] || {};
  const secondImage = aboutData[1] || {};
  const rootRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ab-in'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    rootRef.current?.querySelectorAll('.ab-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="ab-root" ref={rootRef}>
      <div className="ab-wrap">

        {/* Hero image */}
        <div className="ab-figure ab-reveal">
          <img src={topImage.src} alt={topImage.alt || "ScottyUzi About"} loading="lazy"
               onError={() => console.error(`Failed to load image: ${topImage.src || 'ab1.png'}`)} />
        </div>

        {/* About Us */}
        <div className="ab-block ab-reveal">
          <p className="ab-label">Our Story</p>
          <h2 className="ab-heading">About Us</h2>
          <p className="ab-body">
            ScottyUzi is more than just a streetwear brand—it's a <strong>global movement</strong> born from the streets,
            fueled by creativity, and driven by authenticity. Founded with a passion for bold designs and urban culture,
            we create clothing that speaks to the dreamers, the hustlers, and the trendsetters. Our mantra,
            <em> "Friends Don't Forget Friends," </em> embodies our commitment to community, loyalty, and pushing the
            boundaries of style. Join us as we redefine streetwear with every drop.
          </p>
        </div>

        {/* Second image */}
        <div className="ab-figure ab-figure--wide ab-reveal">
          <img src={secondImage.src} alt={secondImage.alt || "ScottyUzi Culture"} loading="lazy"
               onError={() => console.error(`Failed to load image: ${secondImage.src || 'ab2.png'}`)} />
        </div>

        {/* Our Vision */}
        <div className="ab-block ab-reveal">
          <p className="ab-label">What Drives Us</p>
          <h2 className="ab-heading">Our Vision</h2>
        </div>

        {/* Cards */}
        <div className="ab-cards">
          {[
            { title: 'Quality', body: <>Every ScottyUzi piece is crafted with <strong>premium materials</strong>, from soft-touch acrylic fabrics to durable stitching. We obsess over details to ensure our clothing not only looks good but lasts through your hustle.</> },
            { title: 'Customer Service', body: <>Our community is our <strong>family</strong>. We're here to support you with fast, friendly service, easy returns, and a commitment to making your ScottyUzi experience as bold as our designs.</> },
          ].map((c, i) => (
            <div key={c.title} className="ab-card ab-reveal" style={{ '--i': i }}>
              <span className="ab-card__num">0{i + 1}</span>
              <h3 className="ab-card__title">{c.title}</h3>
              <span className="ab-card__rule" />
              <p className="ab-card__body">{c.body}</p>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .ab-root {
          --ink:#1A1A1A; --ink-mid:#5B5854; --ink-soft:#9A948C; --paper:#F7F5F2;
          --well:#FBFAF8; --border:#E0DBD5; --white:#fff; --accent:#C8972E;
          --ease:cubic-bezier(.22,1,.36,1);
          background:var(--paper); min-height:100vh; padding:9vh 0;
        }
        .ab-wrap { max-width:1100px; margin:0 auto; padding:0 40px; }
        @media (max-width:768px) { .ab-wrap { padding:0 20px; } }

        .ab-reveal { opacity:0; transform:translateY(34px); transition:opacity .9s var(--ease), transform .9s var(--ease); transition-delay:calc(var(--i,0) * .1s); }
        .ab-in { opacity:1; transform:none; }

        .ab-figure { overflow:hidden; border:1px solid var(--border); margin-bottom:56px; }
        .ab-figure img { width:100%; height:clamp(300px,48vw,520px); object-fit:cover; display:block; transition:transform .9s var(--ease); }
        .ab-figure:hover img { transform:scale(1.04); }
        .ab-figure--wide img { height:clamp(280px,40vw,440px); }

        .ab-block { text-align:center; max-width:760px; margin:0 auto 56px; }
        .ab-label { font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:var(--accent); margin:0 0 14px; }
        .ab-heading { font-family:'Georgia','Times New Roman',serif; font-size:clamp(32px,4.5vw,58px); font-weight:400; letter-spacing:-.02em; color:var(--ink); margin:0; }
        .ab-body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:1.8; color:var(--ink-mid); margin:26px 0 0; }
        .ab-body strong { color:var(--ink); font-weight:600; }
        .ab-body em { font-style:italic; color:var(--ink); }

        .ab-cards { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:920px; margin:0 auto; }
        @media (max-width:680px) { .ab-cards { grid-template-columns:1fr; } }
        .ab-card { position:relative; background:var(--white); border:1px solid var(--border); padding:40px 36px; transition:box-shadow .5s var(--ease), transform .5s var(--ease); }
        .ab-card:hover { box-shadow:0 30px 60px -30px rgba(26,26,26,.28); transform:translateY(-3px); }
        .ab-card__num { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:.1em; color:var(--accent); }
        .ab-card__title { font-family:'Georgia',serif; font-size:26px; font-weight:400; color:var(--ink); margin:12px 0 0; }
        .ab-card__rule { display:block; width:34px; height:1px; background:var(--accent); margin:16px 0 18px; transition:width .4s var(--ease); }
        .ab-card:hover .ab-card__rule { width:60px; }
        .ab-card__body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.75; color:var(--ink-mid); margin:0; }
        .ab-card__body strong { color:var(--ink); font-weight:600; }

        @media (prefers-reduced-motion: reduce) { .ab-reveal { opacity:1!important; transform:none!important; } }
      `}</style>
    </section>
  );
};

export default About;