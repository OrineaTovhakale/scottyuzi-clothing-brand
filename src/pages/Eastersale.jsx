// src/pages/EasterSale.jsx — ONE FOR ONE THURSDAY
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/data';
import Toast from '../components/Toast';
import { asset } from '../utils/assets';

const blanco1 = asset('blancoX/blanco1.png');
const scXbl1 = asset('blancoX/scXbl1.png');
const scXbl2 = asset('blancoX/scXbl2.png');
const scXbl3 = asset('blancoX/scXbl3.png');
const scXbl4 = asset('blancoX/scXbl4.png');
const bonnie = asset('vday/bonnie.png');
const clyde = asset('vday/clyde.png');
const iLuvMe = asset('iluvme.png');
const propertySU = asset('propertySU.png');
const hoodie = asset('hoodie.png');
const never2Fly = asset('vday/2pray.png');
const stripeGreen = asset('newCaps/StripeGreen.png');
const stripeYellow = asset('newCaps/StripeYellow.png');
const stripeBrown = asset('newCaps/StripeBrown.png');
const stripeRed = asset('newCaps/StripeRed.png');
const redFlannel = asset('vday/red flannel.png');

// ─── Sale product images ──────────────────────────────────────────────────────

// ─── Sale catalogue ───────────────────────────────────────────────────────────
const SALE_ITEMS = [
  {
    id: 'blanco',
    name: 'ScottyUzi × Blanco Tee',
    image: blanco1,
    images: [blanco1, scXbl1, scXbl2, scXbl3, scXbl4],
    originalPrice: 450,
    salePrice: 350,
    category: 'T-Shirts',
    customizable: false,
  },
  {
    id: 'bonnie-clyde',
    name: 'ScottyUzi FC — Bonnie & Clyde Edition',
    image: bonnie,
    images: [bonnie, clyde],
    originalPrice: 550,
    salePrice: 400,
    category: 'T-Shirts',
    customizable: true,
    customLabel: 'Bundle or Individual — name & number on back',
  },
  {
    id: 'iluvme',
    name: 'I ❤️ Me Tee',
    image: iLuvMe,
    images: [iLuvMe],
    originalPrice: 550,
    salePrice: 400,
    category: 'T-Shirts',
    customizable: false,
  },
  {
    id: 'propertysu',
    name: 'Property of SU',
    image: propertySU,
    images: [propertySU],
    originalPrice: 500,
    salePrice: 350,
    category: 'T-Shirts',
    customizable: false,
  },
  {
    id: 'hoodie',
    name: 'Limited Edition Hoodie',
    image: hoodie,
    images: [hoodie],
    originalPrice: 500,
    salePrice: 350,
    category: 'Jackets',
    customizable: false,
  },
  {
    id: 'never2fly',
    name: 'Never 2Fly 2Pray',
    image: never2Fly,
    images: [never2Fly],
    originalPrice: 550,
    salePrice: 350,
    category: 'T-Shirts',
    customizable: false,
  },
  {
    id: 'snapback',
    name: 'Stripe 5-Panel Snapback',
    image: stripeGreen,
    images: [stripeGreen, stripeYellow, stripeBrown, stripeRed],
    originalPrice: 200,
    salePrice: 100,
    category: 'Hats',
    customizable: false,
    isSnapback: true,
    colours: [
      { label: 'Green',  image: stripeGreen,  hex: '#4A7C59' },
      { label: 'Yellow', image: stripeYellow, hex: '#D4B44A' },
      { label: 'Brown',  image: stripeBrown,  hex: '#6B4F3A' },
      { label: 'Red',    image: stripeRed,    hex: '#B03A2E' },
    ],
  },
  {
    id: 'redflannel',
    name: 'ScottyUzi Red Flannel Shirt',
    image: redFlannel,
    images: [redFlannel],
    originalPrice: 550,
    salePrice: 350,
    category: 'Jackets',
    customizable: false,
  },
];

// ─── Sale Card ────────────────────────────────────────────────────────────────
const SaleCard = ({ item, onSelect }) => {
  const [activeColour, setActiveColour] = useState(
    item.isSnapback ? item.colours[0] : null
  );
  const displayImage = activeColour ? activeColour.image : item.image;

  return (
    <div className="sc-card" onClick={() => onSelect(item, activeColour)}>
      <div className="sc-card__img-wrap">
        <img src={displayImage} alt={item.name} className="sc-card__img" />
        <div className="sc-card__overlay" />
      </div>

      {/* Colour swatches — snapback only */}
      {item.isSnapback && (
        <div className="sc-card__swatches" onClick={e => e.stopPropagation()}>
          {item.colours.map(c => (
            <button
              key={c.label}
              className={`sc-card__swatch ${activeColour?.label === c.label ? 'sc-card__swatch--active' : ''}`}
              style={{ background: c.hex }}
              title={c.label}
              onClick={e => { e.stopPropagation(); setActiveColour(c); }}
            />
          ))}
        </div>
      )}

      <div className="sc-card__info">
        <p className="sc-card__name">{item.name}</p>
        <div className="sc-card__prices">
          <span className="sc-card__original">R {item.originalPrice.toFixed(2)}</span>
          <span className="sc-card__sale">R {item.salePrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Product Detail Modal / inline PDP ───────────────────────────────────────
const SaleProductDetail = ({ item, activeColour, onClose, onAddToCart }) => {
  const [selectedColour, setSelectedColour] = useState(activeColour || (item.isSnapback ? item.colours[0] : null));
  const [selectedSize, setSelectedSize]     = useState('M');
  const [quantity, setQuantity]             = useState(1);
  const [imgIdx, setImgIdx]                 = useState(0);
  const [customization, setCustomization]   = useState({ name: '', number: '' });
  const [customError, setCustomError]       = useState('');

  const displayImage = selectedColour ? selectedColour.image : item.image;
  const thumbImages  = selectedColour
    ? [selectedColour.image]
    : item.images;

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const validateCustom = () => {
    const { name, number } = customization;
    if (!name.trim() || !number.trim()) { setCustomError('Please provide both name and number.'); return false; }
    if (name.length > 15) { setCustomError('Name must be 15 characters or less.'); return false; }
    if (!/^\d{1,2}$/.test(number)) { setCustomError('Number must be 1–2 digits.'); return false; }
    setCustomError('');
    return true;
  };

  const handleAdd = () => {
    if (item.customizable && !validateCustom()) return;
    onAddToCart({
      ...item,
      price: item.salePrice,
      image: displayImage,
      selectedSize: item.isSnapback ? 'One Size' : selectedSize,
      selectedColour: selectedColour?.label || null,
      quantity,
      isSaleItem: true,
      ...(item.customizable && { customization: { name: customization.name.trim(), number: customization.number.trim() } }),
    });
  };

  return (
    <div className="spd-backdrop" onClick={onClose}>
      <div className="spd-panel" onClick={e => e.stopPropagation()}>

        <button className="spd-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="spd-grid">

          {/* Gallery */}
          <div className="spd-gallery">
            <div className="spd-gallery__main">
              <img src={selectedColour ? selectedColour.image : thumbImages[imgIdx]} alt={item.name} className="spd-gallery__img" />
            </div>
            {!item.isSnapback && thumbImages.length > 1 && (
              <div className="spd-gallery__thumbs">
                {thumbImages.map((img, i) => (
                  <button key={i} className={`spd-thumb ${i === imgIdx ? 'spd-thumb--active' : ''}`} onClick={() => setImgIdx(i)}>
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="spd-info">
            <p className="spd-label">ScottyUzi — Easter Sale</p>
            <h2 className="spd-title">{item.name}</h2>

            {/* Price */}
            <div className="spd-prices">
              <span className="spd-original">R {item.originalPrice.toFixed(2)}</span>
              <span className="spd-sale">R {item.salePrice.toFixed(2)}</span>
            </div>

            {/* Tote bag callout */}
            <div className="spd-tote">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <div>
                <p className="spd-tote__heading">Free with this order</p>
                <p className="spd-tote__sub">Exclusive ScottyUzi SU Tote Bag — included automatically</p>
              </div>
            </div>

            <div className="spd-divider" />

            {/* Colour picker — snapback */}
            {item.isSnapback && (
              <div className="spd-section">
                <p className="spd-section__label">Colour — {selectedColour?.label}</p>
                <div className="spd-colours">
                  {item.colours.map(c => (
                    <button
                      key={c.label}
                      className={`spd-colour ${selectedColour?.label === c.label ? 'spd-colour--active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.label}
                      onClick={() => setSelectedColour(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size — not for snapback */}
            {!item.isSnapback && (
              <div className="spd-section">
                <p className="spd-section__label">Size</p>
                <div className="spd-sizes">
                  {sizes.map(s => (
                    <button key={s} className={`spd-size ${selectedSize === s ? 'spd-size--active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Customisation — Bonnie & Clyde */}
            {item.customizable && (
              <div className="spd-custom">
                <p className="spd-custom__heading">Customise</p>
                <p className="spd-custom__sub">{item.customLabel}</p>
                <div className="spd-custom__field">
                  <label className="spd-custom__label">Name <span>(max 15 chars)</span></label>
                  <input type="text" maxLength="15" value={customization.name} placeholder="e.g. BONNIE"
                    className="spd-custom__input"
                    onChange={e => { setCustomization({ ...customization, name: e.target.value.toUpperCase() }); setCustomError(''); }} />
                  <span className="spd-custom__count">{customization.name.length}/15</span>
                </div>
                <div className="spd-custom__field">
                  <label className="spd-custom__label">Number <span>(0–99)</span></label>
                  <input type="number" min="0" max="99" value={customization.number} placeholder="e.g. 10"
                    className="spd-custom__input"
                    onChange={e => { const v = e.target.value; if (v === '' || (parseInt(v) >= 0 && parseInt(v) <= 99)) { setCustomization({ ...customization, number: v }); setCustomError(''); } }} />
                </div>
                {customError && <p className="spd-custom__error">{customError}</p>}
                {customization.name && customization.number && (
                  <div className="spd-custom__preview">
                    <span className="spd-custom__preview-name">{customization.name}</span>
                    <span className="spd-custom__preview-num">{customization.number}</span>
                  </div>
                )}
                <p className="spd-custom__note">Customised items cannot be returned.</p>
              </div>
            )}

            {/* Quantity */}
            <div className="spd-section">
              <p className="spd-section__label">Quantity</p>
              <div className="spd-qty">
                <button className="spd-qty__btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="spd-qty__val">{quantity}</span>
                <button className="spd-qty__btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="spd-cta">
              <button className="spd-cta__primary" onClick={handleAdd}>Add to Cart</button>
            </div>

            <p className="spd-legal">By purchasing you agree to our terms & privacy policy. Sale price applied at checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const EasterSale = () => {
  const navigate = useNavigate();
  const [selected, setSelected]       = useState(null);
  const [activeColour, setActiveColour] = useState(null);
  const [showToast, setShowToast]     = useState(false);
  const [toastMsg, setToastMsg]       = useState('');
  const [youMayAlsoLike, setYouMayAlsoLike] = useState([]);
  const [pairsWellWith, setPairsWellWith]   = useState([]);

  useEffect(() => {
    const all = [];
    categories.forEach(cat => cat.products?.forEach(p => all.push(p)));
    const shuffled = all.sort(() => 0.5 - Math.random());
    setYouMayAlsoLike(shuffled.slice(0, 4));
    setPairsWellWith(shuffled.slice(4, 8));
  }, []);

  const handleSelect = (item, colour) => {
    setSelected(item);
    setActiveColour(colour);
  };

  const handleAddToCart = (cartItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    const colourLabel = cartItem.selectedColour ? ` (${cartItem.selectedColour})` : '';
    const sizeLabel   = cartItem.isSnapback ? '' : ` (${cartItem.selectedSize})`;
    setToastMsg(`${cartItem.name}${colourLabel}${sizeLabel} added + free tote bag!`);
    setShowToast(true);
    setSelected(null);
  };

  return (
    <section className="es-root">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <div className="es-header">
        <div className="es-header__inner">
          <p className="es-label">One For One Thursday · Easter Edition</p>
          <h1 className="es-heading">The Easter Sale</h1>
          <p className="es-header__sub">
            All first quarter drops on sale. Every purchase includes a free exclusive SU Tote Bag.
            Some items will never be seen again after this.
          </p>
          {/* Tote bag strip */}
          <div className="es-tote-strip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>Free Exclusive SU Tote Bag included with every purchase — no code needed</span>
          </div>
        </div>
      </div>

      {/* ── SALE GRID ────────────────────────────────────────────────── */}
      <div className="es-container">
        <div className="es-grid">
          {SALE_ITEMS.map(item => (
            <SaleCard key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>

        {/* ── PAIRS WELL WITH ──────────────────────────────────────── */}
        {pairsWellWith.length > 0 && (
          <div className="es-rec-section">
            <p className="es-rec__label">Complete the Look</p>
            <h2 className="es-rec__heading">Pairs Well With</h2>
            <div className="es-rec__grid">
              {pairsWellWith.map((item, i) => (
                <div key={i} className="es-rec-card" onClick={() => navigate('/product', { state: { product: item } })}>
                  <div className="es-rec-card__img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <p className="es-rec-card__name">{item.name}</p>
                  <p className="es-rec-card__price">R {item.price?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── YOU MAY ALSO LIKE ────────────────────────────────────── */}
        {youMayAlsoLike.length > 0 && (
          <div className="es-rec-section">
            <p className="es-rec__label">Discover More</p>
            <h2 className="es-rec__heading">You May Also Like</h2>
            <div className="es-rec__grid">
              {youMayAlsoLike.map((item, i) => (
                <div key={i} className="es-rec-card" onClick={() => navigate('/product', { state: { product: item } })}>
                  <div className="es-rec-card__img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <p className="es-rec-card__name">{item.name}</p>
                  <p className="es-rec-card__price">R {item.price?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── PRODUCT DETAIL MODAL ─────────────────────────────────────── */}
      {selected && (
        <SaleProductDetail
          item={selected}
          activeColour={activeColour}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}

      <style jsx>{`
        /* TOKENS */
        .es-root {
          --ink:        #1A1A1A;
          --ink-mid:    #555555;
          --ink-soft:   #999999;
          --paper:      #F7F5F2;
          --paper-dark: #EDEAE5;
          --border:     #E0DBD5;
          --white:      #FFFFFF;
          --gold:       #D4A017;
          --lime:       #E8F0A0;
          background: var(--paper);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── PAGE HEADER ──────────────────── */
        .es-header {
          background: var(--ink);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .es-header__inner {
          max-width: 1380px; margin: 0 auto;
          padding: 56px 40px 48px;
        }
        @media (max-width: 768px) { .es-header__inner { padding: 40px 20px 36px; } }

        .es-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: var(--gold) !important;
          border-bottom: 1px solid rgba(212,160,23,0.25); padding-bottom: 6px;
          display: inline-block; margin-bottom: 14px;
        }
        .es-heading {
          font-family: 'Georgia', serif;
          font-size: clamp(32px, 5vw, 72px); font-weight: 400;
          letter-spacing: -0.02em; line-height: 1;
          color: var(--lime); margin: 0 0 14px;
        }
        .es-header__sub {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px !important; color: rgba(232,240,160,0.5) !important;
          line-height: 1.7 !important; max-width: 520px; margin: 0 0 24px !important;
        }

        .es-tote-strip {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 10px 18px;
          border: 1px solid rgba(212,160,23,0.3);
          background: rgba(212,160,23,0.07);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--gold);
        }

        /* ── CONTAINER ────────────────────── */
        .es-container {
          max-width: 1380px; margin: 0 auto;
          padding: 56px 40px 80px;
        }
        @media (max-width: 768px) { .es-container { padding: 40px 20px 60px; } }

        /* ── SALE GRID ────────────────────── */
        .es-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 80px;
        }
        @media (max-width: 1100px) { .es-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .es-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

        /* ── SALE CARD ────────────────────── */
        .sc-card {
          cursor: pointer;
          background: var(--white);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: box-shadow .4s ease, transform .4s ease;
        }
        .sc-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.09); transform: translateY(-4px); }

        .sc-card__img-wrap {
          position: relative; aspect-ratio: 1;
          overflow: hidden; background: var(--paper-dark);
        }
        .sc-card__img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .6s cubic-bezier(.22,1,.36,1);
        }
        .sc-card:hover .sc-card__img { transform: scale(1.05); }
        .sc-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.12), transparent);
          opacity: 0; transition: opacity .3s;
        }
        .sc-card:hover .sc-card__overlay { opacity: 1; }

        /* Colour swatches */
        .sc-card__swatches {
          display: flex; gap: 6px; padding: 10px 12px 6px;
          border-bottom: 1px solid var(--border);
          background: var(--white);
        }
        .sc-card__swatch {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid transparent; cursor: pointer;
          transition: border-color .2s, transform .2s;
          padding: 0;
        }
        .sc-card__swatch--active {
          border-color: var(--ink);
          transform: scale(1.2);
        }

        .sc-card__info { padding: 12px 14px 14px; border-top: 1px solid var(--border); }
        .sc-card__name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 0 0 6px;
        }
        .sc-card__prices { display: flex; align-items: baseline; gap: 8px; }
        .sc-card__original {
          font-family: 'Georgia', serif; font-size: 13px;
          color: var(--ink-soft); text-decoration: line-through;
        }
        .sc-card__sale {
          font-family: 'Georgia', serif; font-size: 16px;
          color: var(--ink); font-weight: 400;
        }

        /* ── RECS ─────────────────────────── */
        .es-rec-section {
          margin-top: 72px;
          padding-top: 56px;
          border-top: 1px solid var(--border);
        }
        .es-rec__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft) !important;
          border-bottom: 1px solid var(--border); padding-bottom: 6px;
          display: inline-block; margin-bottom: 12px;
        }
        .es-rec__heading {
          font-family: 'Georgia', serif;
          font-size: clamp(22px, 2.5vw, 36px); font-weight: 400;
          letter-spacing: -0.02em; color: var(--ink); margin: 0 0 32px;
        }
        .es-rec__grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        @media (max-width: 900px) { .es-rec__grid { grid-template-columns: repeat(2, 1fr); } }

        .es-rec-card { cursor: pointer; }
        .es-rec-card__img {
          aspect-ratio: 1; overflow: hidden;
          background: var(--paper-dark); border: 1px solid var(--border);
        }
        .es-rec-card__img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .55s cubic-bezier(.22,1,.36,1);
        }
        .es-rec-card:hover .es-rec-card__img img { transform: scale(1.05); }
        .es-rec-card__name {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--ink);
          margin: 10px 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          text-align: center;
        }
        .es-rec-card__price {
          font-family: 'Georgia', serif; font-size: 13px;
          color: var(--ink-mid); text-align: center;
        }

        /* ── PRODUCT DETAIL MODAL ─────────── */
        .spd-backdrop {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .spd-panel {
          position: relative;
          background: var(--white);
          width: 100%; max-width: 960px;
          max-height: 90vh; overflow-y: auto;
          animation: spd-in .35s cubic-bezier(.22,1,.36,1);
        }
        @keyframes spd-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

        .spd-close {
          position: absolute; top: 16px; right: 16px; z-index: 2;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid var(--border); background: var(--white);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--ink-mid); transition: border-color .2s;
        }
        .spd-close:hover { border-color: var(--ink); }

        .spd-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: start;
        }
        @media (max-width: 768px) { .spd-grid { grid-template-columns: 1fr; } }

        .spd-gallery { padding: 24px; }
        .spd-gallery__main {
          aspect-ratio: 1; overflow: hidden;
          background: var(--paper-dark); border: 1px solid var(--border);
        }
        .spd-gallery__img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .spd-gallery__thumbs { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-top: 10px; }
        .spd-thumb {
          border: 1px solid var(--border); background: none; cursor: pointer; padding: 0; overflow: hidden;
        }
        .spd-thumb img { width: 100%; height: 70px; object-fit: cover; display: block; }
        .spd-thumb--active { border-color: var(--ink); border-width: 2px; }

        .spd-info { padding: 24px 28px 28px; border-left: 1px solid var(--border); }
        @media (max-width: 768px) { .spd-info { border-left: none; border-top: 1px solid var(--border); } }

        .spd-label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink-soft) !important;
          border-bottom: 1px solid var(--border); padding-bottom: 6px;
          display: inline-block; margin-bottom: 10px;
        }
        .spd-title {
          font-family: 'Georgia', serif;
          font-size: clamp(20px, 2.5vw, 32px); font-weight: 400;
          letter-spacing: -0.02em; color: var(--ink); margin: 0 0 16px;
        }
        .spd-prices { display: flex; align-items: baseline; gap: 10px; margin-bottom: 20px; }
        .spd-original {
          font-family: 'Georgia', serif; font-size: 16px;
          color: var(--ink-soft); text-decoration: line-through;
        }
        .spd-sale {
          font-family: 'Georgia', serif; font-size: 24px; color: var(--ink);
        }

        /* Tote callout */
        .spd-tote {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px;
          background: #FFFBEA; border: 1px solid rgba(212,160,23,0.3);
          margin-bottom: 20px; color: var(--gold);
        }
        .spd-tote__heading {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px !important; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #8a6800 !important; margin: 0 0 3px !important;
        }
        .spd-tote__sub {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px !important; color: #8a6800 !important;
          line-height: 1.5 !important; margin: 0 !important;
        }

        .spd-divider { height: 1px; background: var(--border); margin: 0 0 20px; }

        .spd-section { margin-bottom: 20px; }
        .spd-section__label {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--ink-soft) !important;
          margin: 0 0 10px !important;
        }

        .spd-colours { display: flex; gap: 10px; }
        .spd-colour {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid transparent; cursor: pointer; padding: 0;
          transition: border-color .2s, transform .2s;
        }
        .spd-colour--active { border-color: var(--ink); transform: scale(1.15); }

        .spd-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
        .spd-size {
          width: 44px; height: 44px;
          border: 1px solid var(--border); background: var(--white); color: var(--ink);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 500; cursor: pointer; transition: all .2s;
        }
        .spd-size:hover { border-color: var(--ink); }
        .spd-size--active { background: var(--ink); color: var(--white); border-color: var(--ink); }

        /* Customisation */
        .spd-custom {
          border: 1px solid var(--border); padding: 16px; margin-bottom: 20px;
          background: var(--paper);
        }
        .spd-custom__heading {
          font-family: 'Georgia', serif;
          font-size: 15px !important; font-weight: 400; color: var(--ink); margin: 0 0 4px !important;
        }
        .spd-custom__sub {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px !important; color: var(--ink-soft) !important; margin: 0 0 14px !important;
        }
        .spd-custom__field { margin-bottom: 12px; }
        .spd-custom__label {
          display: block; font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--ink-mid) !important; margin-bottom: 5px !important;
        }
        .spd-custom__label span { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--ink-soft); }
        .spd-custom__input {
          width: 100%; padding: 9px 12px;
          border: 1px solid var(--border); background: var(--white);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px; color: var(--ink); outline: none; transition: border-color .2s;
        }
        .spd-custom__input:focus { border-color: var(--ink); }
        .spd-custom__count {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; color: var(--ink-soft) !important;
          display: block; margin-top: 3px; text-align: right;
        }
        .spd-custom__error {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px !important; color: #B91C1C !important;
          border-left: 2px solid #B91C1C; padding-left: 8px; margin-bottom: 10px;
        }
        .spd-custom__preview {
          display: flex; gap: 24px; padding: 12px 14px;
          border: 1px solid var(--border); margin: 10px 0; align-items: center;
        }
        .spd-custom__preview-name {
          font-family: 'Georgia', serif; font-size: 18px; color: var(--ink);
        }
        .spd-custom__preview-num {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 24px; font-weight: 900; color: var(--ink);
        }
        .spd-custom__note {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; color: var(--ink-soft) !important; margin-top: 8px !important;
        }

        .spd-qty {
          display: inline-flex; align-items: center;
          border: 1px solid var(--border); background: var(--white);
        }
        .spd-qty__btn {
          width: 42px; height: 42px; background: none; border: none; cursor: pointer;
          font-size: 18px; color: var(--ink); display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .spd-qty__btn:hover { background: var(--paper-dark); }
        .spd-qty__val {
          width: 48px; text-align: center;
          font-family: 'Georgia', serif; font-size: 15px; color: var(--ink);
          border-left: 1px solid var(--border); border-right: 1px solid var(--border);
          line-height: 42px;
        }

        .spd-cta { margin-bottom: 16px; }
        .spd-cta__primary {
          width: 100%; padding: 15px;
          background: var(--ink); color: var(--white); border: none; cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          transition: background .25s;
        }
        .spd-cta__primary:hover { background: #333; }

        .spd-legal {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px !important; color: var(--ink-soft) !important;
          line-height: 1.6 !important; margin: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default EasterSale;