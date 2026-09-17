// src/pages/Collections.jsx — POLISHED EDITION
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '../assets/data';
import { asset } from '../utils/assets';

const stripeGreen = asset('newCaps/StripeGreen.png');
const stripeYellow = asset('newCaps/StripeYellow.png');
const stripeBrown = asset('newCaps/StripeBrown.png');
const stripeRed = asset('newCaps/StripeRed.png');
const never1 = asset('never2fly2praycolours/Never1.png');
const fcPurple = asset('purp/fcPurple.png');

// Stripe 5-Panel Snapback cap images

// New releases

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

const STRIPE_CAPS = [
  { name: 'Stripe 5-Panel Snapback — Green',  image: stripeGreen,  price: 200, category: 'Hats' },
  { name: 'Stripe 5-Panel Snapback — Yellow', image: stripeYellow, price: 200, category: 'Hats' },
  { name: 'Stripe 5-Panel Snapback — Brown',  image: stripeBrown,  price: 200, category: 'Hats' },
  { name: 'Stripe 5-Panel Snapback — Red',    image: stripeRed,    price: 200, category: 'Hats' },
];

const NEW_RELEASES = [
  {
    name: 'Never 2Fly 2Pray',
    image: never1,
    price: 350,
    originalPrice: 550,
    category: 'New Products',
    isNew: true,
    hasColourOptions: true,
    colourOptions: NEVER_COLOURS,
    includesFreeSticker: true,
    freeStickerColours: FREE_STICKER_COLOURS,
  },
  {
    name: 'Never 2Fly 2Pray',
    image: never1,
    price: 350,
    originalPrice: 550,
    category: 'T-Shirts',
    isNew: true,
    hasColourOptions: true,
    colourOptions: NEVER_COLOURS,
    includesFreeSticker: true,
    freeStickerColours: FREE_STICKER_COLOURS,
  },
  {
    name: 'ScottyUzi FC Purple',
    image: fcPurple,
    price: 350,
    category: 'T-Shirts',
    isNew: true,
    includesFreeSticker: true,
    freeStickerColours: FREE_STICKER_COLOURS,
  },
];

// ─── Product Card ─────────────────────────────────────────────────────────────
const CollectionCard = ({ product, onClick }) => (
  <div className={`cl-card ${product.isNew ? 'cl-card--new' : ''}`} onClick={onClick}>
    <div className="cl-card__img-wrap">
      <img src={product.image} alt={product.name} className="cl-card__img" loading="lazy" decoding="async" />
      {product.isNew && <span className="cl-card__badge">New</span>}
      <div className="cl-card__overlay" />
    </div>
    <div className="cl-card__info">
      <p className="cl-card__name">{product.name}</p>
      <p className="cl-card__price">R {product.price.toFixed(2)}</p>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Collections = () => {
  const { state }         = useLocation();
  const navigate          = useNavigate();
  const [searchParams]    = useSearchParams();
  const snapbackRef       = useRef(null);

  const categoryParam  = searchParams.get('category');
  const searchQuery    = searchParams.get('search');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [groupedProducts,  setGroupedProducts]  = useState({});
  const [currentCategory,  setCurrentCategory]  = useState(null);

  // Inject caps + new releases; strip old R550 Never 2Fly 2Pray entries
  const injectExtras = (all) => {
    // Remove legacy Never 2Fly 2Pray (no colour options / still at R550)
    let result = all.filter(p => {
      if (p.name !== 'Never 2Fly 2Pray') return true;
      // keep only the multi-colour sale version
      return p.hasColourOptions === true && p.price === 350;
    });

    const capsAlreadyIn = result.some(p => p.name.includes('Stripe 5-Panel'));
    if (!capsAlreadyIn) result = [...STRIPE_CAPS, ...result];

    const neverNewProducts = result.some(p => p.name === 'Never 2Fly 2Pray' && p.category === 'New Products' && p.hasColourOptions);
    const neverTshirts     = result.some(p => p.name === 'Never 2Fly 2Pray' && p.category === 'T-Shirts' && p.hasColourOptions);
    const fcAlready        = result.some(p => p.name === 'ScottyUzi FC Purple');

    const toPrepend = [];
    if (!neverNewProducts) toPrepend.push(NEW_RELEASES[0]); // New Products
    if (!neverTshirts)     toPrepend.push(NEW_RELEASES[1]); // T-Shirts
    if (!fcAlready)        toPrepend.push(NEW_RELEASES[2]); // FC Purple T-Shirts
    return [...toPrepend, ...result];
  };

  useEffect(() => {
    const raw = [];
    categories.forEach(cat => {
      cat.products?.forEach(p => raw.push({ ...p, category: cat.name }));
    });
    const all = injectExtras(raw);

    const map = {
      'new-products': 'New Products',
      't-shirts':     'T-Shirts',
      'shorts':       'Shorts',
      'jackets':      'Jackets',
      'hats':         'Hats',
      'jerseys':      'Jerseys',
      'tracksuits':   'Tracksuits',
    };

    let result = all;

    if (categoryParam) {
      const catName = map[categoryParam];
      if (catName) { result = all.filter(p => p.category === catName); setCurrentCategory(catName); }
    } else if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = all.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      setCurrentCategory(null);
    } else {
      setCurrentCategory(null);
    }

    setFilteredProducts(result);

    const grouped = {};
    result.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    setGroupedProducts(grouped);
  }, [categoryParam, searchQuery]);

  // Scroll to Stripe Snapback section if navigated from banner
  useEffect(() => {
    if (state?.scrollTo === 'stripe-snapback' && snapbackRef.current) {
      setTimeout(() => {
        snapbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    }
  }, [state, filteredProducts]);

  const showGrouped = !currentCategory && !searchQuery;

  const pageLabel = currentCategory
    ? 'Collection'
    : searchQuery
      ? 'Search Results'
      : 'All Collections';

  const pageHeading = currentCategory === 'New Products'
    ? 'New ScottyUzi Drops'
    : currentCategory
      ? currentCategory
      : searchQuery
        ? `"${searchQuery}"`
        : 'Everything';

  const visibleProducts = filteredProducts;

  // Any single-category view: new drops lead, everything else follows as before
  const newDropItems = visibleProducts.filter(p => p.isNew);
  const restItems    = visibleProducts.filter(p => !p.isNew);
  const isSplitView  = !!currentCategory && newDropItems.length > 0;

  return (
    <section className="cl-root">

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <div className="cl-header">
        <div className="cl-header__inner">
          <p className="cl-label">{pageLabel}</p>
          <h1 className="cl-heading">{pageHeading}</h1>
          {!showGrouped && (
            <p className="cl-count">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="cl-container">

        {/* ── SINGLE CATEGORY — new drops lead, then the collection ── */}
        {isSplitView ? (
          <div className="cl-grouped">

            {/* New drops — clearly marked */}
            <div className="cl-group" ref={snapbackRef}>
              <div className="cl-group__header">
                <div>
                  <p className="cl-label">New Drop · Limited Release</p>
                  <h2 className="cl-group__heading">New Drops</h2>
                </div>
                <span className="cl-new-badge">Just Dropped</span>
              </div>
              <div className="cl-grid">
                {newDropItems.map((p, i) => (
                  <CollectionCard key={i} product={p} onClick={() => navigate('/product', { state: { product: p } })} />
                ))}
              </div>
            </div>

            {/* Everything that was there before */}
            {restItems.length > 0 && (
              <div className="cl-group">
                <div className="cl-group__header">
                  <div>
                    <p className="cl-label">Collection</p>
                    <h2 className="cl-group__heading">{currentCategory}</h2>
                  </div>
                </div>
                <div className="cl-grid">
                  {restItems.map((p, i) => (
                    <CollectionCard key={i} product={p} onClick={() => navigate('/product', { state: { product: p } })} />
                  ))}
                </div>
              </div>
            )}

          </div>

        ) : showGrouped ? (
          /* ALL COLLECTIONS — grouped by category */
          <div className="cl-grouped">
            {Object.keys(groupedProducts).map(catName => (
              <div key={catName} className="cl-group">
                <div className="cl-group__header">
                  <div>
                    <p className="cl-label">Category</p>
                    <h2 className="cl-group__heading">{catName}</h2>
                  </div>
                  <button
                    className="cl-group__link"
                    onClick={() => {
                      const slug = Object.entries({
                        'New Products': 'new-products', 'T-Shirts': 't-shirts',
                        'Shorts': 'shorts', 'Jackets': 'jackets', 'Hats': 'hats',
                        'Jerseys': 'jerseys', 'Tracksuits': 'tracksuits',
                      }).find(([k]) => k === catName)?.[1];
                      if (slug) navigate(`/collections?category=${slug}`);
                    }}
                  >
                    View All →
                  </button>
                </div>
                <div className="cl-grid">
                  {groupedProducts[catName].map((p, i) => (
                    <CollectionCard key={i} product={p} onClick={() => navigate('/product', { state: { product: p } })} />
                  ))}
                </div>
              </div>
            ))}
          </div>

        ) : (
          /* SINGLE CATEGORY OR SEARCH */
          visibleProducts.length > 0 ? (
            <div className="cl-grid cl-grid--single">
              {visibleProducts.map((p, i) => (
                <CollectionCard key={i} product={p} onClick={() => navigate('/product', { state: { product: p } })} />
              ))}
            </div>
          ) : (
            <div className="cl-empty">
              <p className="cl-empty__text">No products found.</p>
              <button className="btn-standard" onClick={() => navigate('/collections')}>Browse All</button>
            </div>
          )
        )}

        <div className="cl-footer">
          <button className="btn-standard" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>

      <style jsx>{`
        /* TOKENS */
        .cl-root {
          --ink:#1A1A1A; --ink-mid:#5B5854; --ink-soft:#9A948C;
          --paper:#F7F5F2; --well:#FBFAF8; --paper-dark:#EDEAE5; --border:#E0DBD5;
          --white:#FFFFFF; --accent:#C8972E; --ease:cubic-bezier(.22,1,.36,1);
          background:var(--paper); min-height:100vh; overflow-x:hidden; max-width:100%;
        }

        /* HEADER */
        .cl-header { border-bottom:1px solid var(--border); background:var(--paper); padding:56px 0 40px; }
        .cl-header__inner { max-width:1380px; margin:0 auto; padding:0 40px; }
        @media (max-width:768px) { .cl-header__inner { padding:0 20px; } .cl-header { padding:40px 0 32px; } }

        /* TYPOGRAPHY */
        .cl-label {
          display:inline-block; font-family:'Helvetica Neue',Arial,sans-serif;
          font-size:10px; font-weight:600; letter-spacing:.24em; text-transform:uppercase;
          color:var(--accent); margin-bottom:14px;
        }
        .cl-heading { font-family:'Georgia','Times New Roman',serif; font-size:clamp(28px,4vw,56px); font-weight:400; letter-spacing:-.02em; line-height:1.05; color:var(--ink); margin:0 0 10px; }
        .cl-count { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; color:var(--ink-soft); letter-spacing:.08em; margin:0; }

        /* CONTAINER */
        .cl-container { max-width:1380px; margin:0 auto; padding:64px 40px 88px; }
        @media (max-width:768px) { .cl-container { padding:44px 20px 64px; } }

        /* GROUPED VIEW */
        .cl-grouped { display:flex; flex-direction:column; gap:80px; }
        .cl-group__header {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:36px; padding-top:20px;
          border-top:1px solid var(--border);
        }
        .cl-group__heading { font-family:'Georgia',serif; font-size:clamp(22px,2.5vw,34px); font-weight:400; letter-spacing:-.01em; color:var(--ink); margin:0; }
        .cl-group__link {
          font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:700; letter-spacing:.16em;
          text-transform:uppercase; color:var(--ink); background:none; border:none; cursor:pointer; padding:0 0 4px;
          border-bottom:1px solid var(--ink); transition:color .2s, border-color .2s; white-space:nowrap; flex-shrink:0; margin-left:20px;
        }
        .cl-group__link:hover { color:var(--accent); border-color:var(--accent); }

        /* PRODUCT GRID */
        .cl-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:34px 24px; }
        .cl-grid--single { margin-top:0; }
        @media (max-width:1100px) { .cl-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
        @media (max-width:768px)  { .cl-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:24px 14px; } }

        /* PRODUCT CARD — borderless well, gold underline (matches homepage) */
        .cl-card {
          cursor:pointer; background:none; border:none; overflow:visible;
          min-width:0; max-width:100%;
          animation:cl-rise .7s var(--ease) both;
        }
        .cl-card:nth-child(1){animation-delay:.02s;} .cl-card:nth-child(2){animation-delay:.06s;}
        .cl-card:nth-child(3){animation-delay:.10s;} .cl-card:nth-child(4){animation-delay:.14s;}
        .cl-card:nth-child(5){animation-delay:.18s;} .cl-card:nth-child(6){animation-delay:.22s;}
        .cl-card:nth-child(7){animation-delay:.26s;} .cl-card:nth-child(8){animation-delay:.30s;}
        @keyframes cl-rise { from { opacity:0; transform:translateY(34px); } to { opacity:1; transform:none; } }

        .cl-card__img-wrap {
          position:relative; aspect-ratio:4/5; overflow:hidden;
          background:var(--well); border:1px solid var(--border);
          transition:box-shadow .5s var(--ease);
        }
        .cl-card:hover .cl-card__img-wrap { box-shadow:0 30px 60px -28px rgba(26,26,26,.4); }
        .cl-card__badge {
          position:absolute; top:12px; left:12px; z-index:2; padding:5px 11px;
          background:var(--ink); color:var(--white); font-family:'Helvetica Neue',Arial,sans-serif;
          font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
        }
        .cl-new-badge {
          font-family:'Helvetica Neue',Arial,sans-serif; font-size:9px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; color:var(--ink); background:transparent; border:1px solid var(--accent);
          padding:6px 14px; white-space:nowrap; flex-shrink:0; align-self:flex-end; margin-left:20px; color:var(--accent);
        }
        .cl-card__img {
          width:100%; height:100%; object-fit:cover; object-position:center; padding:0; display:block;
          transition:transform .7s var(--ease);
        }
        .cl-card:hover .cl-card__img { transform:scale(1.05); }
        .cl-card__overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.10), transparent 60%); opacity:0; transition:opacity .35s; }
        .cl-card:hover .cl-card__overlay { opacity:1; }
        .cl-card__info { padding:15px 2px 0; display:flex; align-items:baseline; justify-content:space-between; gap:10px; }
        .cl-card__name {
          position:relative; font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:500;
          letter-spacing:.06em; text-transform:uppercase; color:var(--ink);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0; text-align:left;
        }
        .cl-card__name::after { content:''; position:absolute; left:0; bottom:-3px; width:100%; height:1px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .4s var(--ease); }
        .cl-card:hover .cl-card__name::after { transform:scaleX(1); }
        .cl-card__price { font-family:'Georgia',serif; font-size:13px; color:var(--ink-mid); margin:0; text-align:right; white-space:nowrap; }

        /* EMPTY */
        .cl-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:40vh; gap:20px; text-align:center; }
        .cl-empty__text { font-family:'Georgia',serif; font-size:18px; color:var(--ink-soft); }

        /* FOOTER */
        .cl-footer { text-align:center; margin-top:80px; padding-top:40px; border-top:1px solid var(--border); }

        @media (prefers-reduced-motion: reduce) { .cl-card { animation:none!important; opacity:1!important; transform:none!important; } }
      `}</style>
    </section>
  );
};

export default Collections;