// src/pages/ProductDetail.jsx — POLISHED EDITION + WORLD CUP DUAL
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories, never2Fly2PrayCatalogue } from '../assets/data';
import Toast from '../components/Toast';
import { asset } from '../utils/assets';

const whiteSuAngle1 = asset('whiteSuAngle1.png');
const whiteSuAngle2 = asset('whiteSuAngle2.png');
const suWingBlack = asset('Wing/suWingBlack.png');
const suWingBlack1 = asset('Wing/suWingBlack1.png');
const swimshortsangle1 = asset('swimshortsangle1.png');
const swimshortsangle2 = asset('swimshortsangle2.png');
const shortspreview = asset('shortspreview.png');
const greenflannelangle2 = asset('greenflannelangle2.png');
const greenflannelangle3 = asset('greenflannelangle3.png');
const peeloffangle1 = asset('peeloffangle1.png');
const peeloffangle2 = asset('peeloffangle2.png');
const est2020angle1 = asset('est2020angle1.png');
const est2020angle2 = asset('est2020angle2.png');
const essentialangle1 = asset('essentialangle1.png');
const essentialangle2 = asset('essentialangle2.png');
const mafiaAngle1 = asset('mafia2.0angle1.png');
const mafiaAngle2 = asset('mafia2.0angle2.png');
const redFlannelThumb = asset('vday/thumb1.png');
const blackMan = asset('MandelaDay/blackMan.png');
const redMan = asset('MandelaDay/redMan.png');
const scXwc1 = asset('worldcup/scXwc1.png');
const scXwc2 = asset('worldcup/scXwc2.png');
const bafanaBlack = asset('worldcup/BafanaBlack.png');
const bafanaBlack2 = asset('worldcup/BafanaBlack2.png');
const hoverGreenShort = asset('worldcup/short sleeve green.png');
const hoverGreenLong = asset('worldcup/long sleeve green.png');
const hoverBlackShort = asset('worldcup/long sleeve black.png');
const hoverBlackLong = asset('worldcup/short sleeve black .png');

// World Cup — original product images (displayed in gallery)

// World Cup — hover thumbnails (appear on hover / in thumb strip)
// Green: short sleeve hover = short sleeve green.png, long sleeve hover = long sleeve green.png
// Black: short sleeve hover = long sleeve black.png,  long sleeve hover = short sleeve black .png

const BEANIE_COLOURS = [
  { label: 'Black',        hex: '#1A1A1A' },
  { label: 'White',        hex: '#F7F5F2' },
  { label: 'Forest Green', hex: '#1B4332' },
  { label: 'Navy',         hex: '#1B2A4A' },
  { label: 'Red',          hex: '#B91C1C' },
  { label: 'Yellow',       hex: '#D4A017' },
];

const ProductDetail = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const product    = state?.product;

  const isSnapback     = product?.name?.includes('Stripe 5-Panel Snapback');
  const isBlanco       = product?.name?.includes('Blanco') || product?.name?.includes('blanco');
  const isWorldCup     = product?.isWorldCup === true;
  // ScottyUzi FC tees (incl. Mandela Day) — sleeve toggle, R399 short / R450 long
  const isFC           = product?.isFC === true || /\bFC\b/.test(product?.name || '');
  // Every ScottyUzi jersey — FC, Mandela Day and Bafana Bafana — is in the
  // Mandela Day sale: R399 short / R450 long, and all qualify for MANDELA2.
  const isJersey       = isWorldCup || isFC;
  const isMandela      = product?.isMandela === true;
  // Both editions now treated the same — no free item flags needed
  const isBlackEdition = isWorldCup && product?.name?.includes('Black');
  const isGreenEdition = isWorldCup && !product?.name?.includes('Black');
  const isSticker = product?.isSticker === true;
  const hasColourOptions = product?.hasColourOptions === true;
  const includesFreeSticker = product?.includesFreeSticker === true;

  // ── ALL HOOKS FIRST ───────────────────────────────────────────────────────
  const [sleeve,         setSleeve]         = useState('short');
  const [mandelaColour,  setMandelaColour]  = useState('black');
  const [selectedSize,   setSelectedSize]   = useState('M');
  const [quantity,       setQuantity]       = useState(1);
  const [pairsWellWith,  setPairsWellWith]  = useState([]);
  const [youMayAlsoLike, setYouMayAlsoLike] = useState([]);
  const [showToast,      setShowToast]      = useState(false);
  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [customization,  setCustomization]  = useState({ name: '', number: '' });
  const [customError,    setCustomError]    = useState('');
  const [beanieColour,   setBeanieColour]   = useState(BEANIE_COLOURS[0]);
  const [selectedStickerOffer, setSelectedStickerOffer] = useState(product?.stickerOffers?.[0]);
  const [selectedStickerColours, setSelectedStickerColours] = useState(() =>
    Array.from({ length: product?.stickerOffers?.[0]?.quantity || 0 }, () => product?.stickerColours?.[0] || '')
  );
  // Colour picker for multi-colour tees (e.g. Never 2Fly 2Pray)
  const [selectedColour, setSelectedColour] = useState(
    product?.colourOptions?.[0] || ''
  );
  // Free sticker colour choice when product includes a free sticker
  const [freeStickerColour, setFreeStickerColour] = useState(
    product?.freeStickerColours?.[0] || ''
  );

  // ── PRICES — sale pricing, original struck through, applies to both editions ──
  const WC_PRICES = {
    short: { sale: 450, original: 650 },
    long:  { sale: 550, original: 750 },
  };

  // FC tees — Mandela Day pricing
  const FC_PRICES = { short: 550, long: 750 };

  const displayPrice  = isSticker
    ? (selectedStickerOffer?.price || product?.price || 0)
    : (isWorldCup ? FC_PRICES[sleeve] : (product?.price || 0));
  const originalPrice = product?.originalPrice || null;   // drives the strikethrough
  const stickerColours = product?.stickerColours || [];

  useEffect(() => {
    if (!isSticker) return;
    setSelectedStickerColours(currentColours =>
      Array.from(
        { length: selectedStickerOffer?.quantity || 0 },
        (_, index) => currentColours[index] || stickerColours[0] || ''
      )
    );
  }, [isSticker, selectedStickerOffer?.quantity, stickerColours]);

  // ── GALLERY ───────────────────────────────────────────────────────────────
  const getGalleryImages = () => {
    if (isMandela) {
      const map = product?.colourImages || { black: blackMan, red: redMan };
      return [ mandelaColour === 'red' ? map.red : map.black ];
    }
    const name = product?.name || '';
    const img  = product?.image || '';
    // Green edition: short sleeve → scXwc1 + hoverGreenShort, long sleeve → scXwc2 + hoverGreenLong
    if (isGreenEdition) return sleeve === 'short'
      ? [scXwc1, hoverGreenShort]
      : [scXwc2, hoverGreenLong];
    // Black edition: short sleeve → bafanaBlack + hoverBlackShort, long sleeve → bafanaBlack2 + hoverBlackLong
    if (isBlackEdition) return sleeve === 'short'
      ? [bafanaBlack,  hoverBlackShort]
      : [bafanaBlack2, hoverBlackLong];
    if (isBlanco && product?.images?.length) return [img, ...product.images];
    // Generic: any product carrying an images[] gets main + thumbnails
    if (product?.images?.length) return [img, ...product.images];
    if (name.includes('SU Wing')) {
      const isBlk = img.includes('tshirt') && !img.includes('tshirt2');
      return isBlk ? [img, suWingBlack, suWingBlack1] : [img, whiteSuAngle1, whiteSuAngle2];
    }
    if (name === 'SU Swim Trunks')      return [img, swimshortsangle1, swimshortsangle2, shortspreview];
    if (name === 'Flannel Green Shirt') return [img, greenflannelangle2, greenflannelangle3];
    if (name === 'Red Flannel Shirt')   return [img, redFlannelThumb];
    if (name === 'Peel Off Tee')        return [img, peeloffangle1, peeloffangle2];
    if (name === 'Est. 2020 Tee')       return [img, est2020angle1, est2020angle2];
    if (name === 'Essential Tee')       return [img, essentialangle1, essentialangle2];
    if (name === 'Mafia 2.0 Tee')       return [img, mafiaAngle1, mafiaAngle2];
    return [img];
  };

  const images = getGalleryImages();

  useEffect(() => { setCurrentIndex(0); }, [sleeve]);

  useEffect(() => {
    const all = [];
    categories.forEach(cat => cat.products?.forEach(p => { if (p.name !== product?.name) all.push(p); }));
    const shuffled = all.sort(() => 0.5 - Math.random());
    setPairsWellWith(shuffled.slice(0, 4));
    setYouMayAlsoLike(shuffled.slice(4, 8));
  }, [product]);

  const validateCustomization = () => {
    const { name, number } = customization;
    if (!name.trim() || !number.trim()) { setCustomError('Please provide both name and number.'); return false; }
    if (name.length > 15)               { setCustomError('Name must be 15 characters or less.'); return false; }
    if (!/^\d{1,2}$/.test(number))      { setCustomError('Number must be 1–2 digits (0–99).'); return false; }
    setCustomError('');
    return true;
  };

  const handleAddToCart = () => {
    if ((product.customizable || isJersey) && !validateCustomization()) return;
    const cartItem = {
      ...product,
      price:          displayPrice,
      originalPrice:  originalPrice || undefined,
      ...(product?.includesFreeBeanie && { includesFreeBeanie: true }),
      image:          images[0],
      selectedSize:   isSnapback ? 'One Size' : selectedSize,
      selectedSleeve: isWorldCup ? (sleeve === 'short' ? 'Short Sleeve' : 'Long Sleeve') : undefined,
      ...(isMandela && {
        name: `Mandela Day FC Tee — ${mandelaColour === 'red' ? 'Red' : 'Black'}`,
        image: mandelaColour === 'red' ? redMan : blackMan,
        selectedColour: mandelaColour === 'red' ? 'Red' : 'Black',
      }),
      ...(hasColourOptions && selectedColour && {
        selectedColour,
        name: `${product.name} — ${selectedColour}`,
      }),
      ...(includesFreeSticker && freeStickerColour && {
        includesFreeSticker: true,
        freeStickerColour,
      }),
      ...(isJersey && { isFCJersey: true }),
      quantity,
      ...(isSticker && { stickerQuantity: selectedStickerOffer.quantity }),
      ...(isSticker && { stickerColours: selectedStickerColours }),
      ...(isBlackEdition && { }),
      ...(isGreenEdition && { }),
      ...((product.customizable || isJersey) && {
        customization: { name: customization.name.trim(), number: customization.number.trim() }
      }),
    };
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowToast(true);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  if (!product) {
    return (
      <div className="pd-empty">
        <p>Product not found.</p>
        <button onClick={() => navigate('/collections')} className="btn-standard">Back to Collections</button>
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  return (
    <section className="pd-root">

      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="pd-container pd-main">

        {/* ── GALLERY ── */}
        <div className="pd-gallery">

          {isMandela && (
            <div className="pd-sleeve-toggle" style={{ marginBottom: 12 }}>
              <button className={`pd-sleeve-btn ${mandelaColour === 'black' ? 'pd-sleeve-btn--active' : ''}`} onClick={() => setMandelaColour('black')}>
                Black
              </button>
              <button className={`pd-sleeve-btn ${mandelaColour === 'red' ? 'pd-sleeve-btn--active' : ''}`} onClick={() => setMandelaColour('red')}>
                Red
              </button>
            </div>
          )}

          {isWorldCup && (
            <div className="pd-sleeve-toggle">
              <button className={`pd-sleeve-btn ${sleeve === 'short' ? 'pd-sleeve-btn--active' : ''}`} onClick={() => setSleeve('short')}>
                <span>Short Sleeve</span>
                <span className="pd-sleeve-btn__price">R {FC_PRICES.short}</span>
              </button>
              <button className={`pd-sleeve-btn ${sleeve === 'long' ? 'pd-sleeve-btn--active' : ''}`} onClick={() => setSleeve('long')}>
                <span>Long Sleeve</span>
                <span className="pd-sleeve-btn__price">R {FC_PRICES.long}</span>
              </button>
            </div>
          )}

          <div className="pd-gallery__main">
            <img src={images[currentIndex]} alt={`${product.name} view ${currentIndex + 1}`} className="pd-gallery__img" />
            {images.length > 1 && (
              <>
                <button className="pd-gallery__arrow pd-gallery__arrow--prev" onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}>←</button>
                <button className="pd-gallery__arrow pd-gallery__arrow--next" onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}>→</button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="pd-gallery__thumbs">
              {images.map((img, i) => (
                <button key={i} className={`pd-gallery__thumb ${i === currentIndex ? 'pd-gallery__thumb--active' : ''}`} onClick={() => setCurrentIndex(i)}>
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="pd-info">

          <p className="pd-info__label">ScottyUzi Merchandise</p>
          <h1 className="pd-info__title">{product.name}</h1>
          {product.tagline && <p className="pd-info__tagline">{product.tagline}</p>}

          {isWorldCup && (
            <div className="pd-wc-badge">
              <span className="pd-wc-badge__dot" />
              FIFA 2026 × ScottyUzi — Bafana Bafana {isBlackEdition ? 'Black' : 'Green'} Edition · First 100 Players
            </div>
          )}

          {isBlanco && (
            <div className="pd-collab-badge">
              <span className="pd-collab-badge__dot" />
              ScottyUzi × Blanco — Limited Collaboration
            </div>
          )}

          {/* Price */}
          <div className="pd-info__price-wrap">
            {originalPrice && (
              <span className="pd-info__price-original">R {originalPrice.toFixed(2)}</span>
            )}
            <span className="pd-info__price-sale">R {displayPrice.toFixed(2)}</span>
            {originalPrice && <span className="pd-info__badge">Sale</span>}
          </div>

          <div className="pd-info__divider" />

          {/* Customisation */}
          {(product.customizable || isJersey) && (
            <div className="pd-custom">
              <p className="pd-custom__heading">{isJersey ? 'Customise Your Jersey' : 'Customise Your T-Shirt'}</p>
              <p className="pd-custom__sub">Your name and number printed on the back.</p>
              <div className="pd-custom__field">
                <label className="pd-custom__label">Name on back <span>(max 15 characters)</span></label>
                <input type="text" maxLength="15" value={customization.name}
                  placeholder={isWorldCup ? 'e.g. SCOTTY UZI' : 'e.g. SCOTT'}
                  className="pd-custom__input"
                  onChange={e => { setCustomization({ ...customization, name: e.target.value.toUpperCase() }); setCustomError(''); }} />
                <span className="pd-custom__count">{customization.name.length}/15</span>
              </div>
              <div className="pd-custom__field">
                <label className="pd-custom__label">Number on back <span>(0–99)</span></label>
                <input type="number" min="0" max="99" value={customization.number} placeholder="e.g. 10"
                  className="pd-custom__input"
                  onChange={e => { const v = e.target.value; if (v === '' || (parseInt(v) >= 0 && parseInt(v) <= 99)) { setCustomization({ ...customization, number: v }); setCustomError(''); } }} />
              </div>
              {customError && <p className="pd-custom__error">{customError}</p>}
              {customization.name && customization.number && (
                <div className="pd-custom__preview">
                  <p className="pd-custom__preview-label">Preview</p>
                  <div className="pd-custom__preview-display">
                    <div>
                      <p className="pd-custom__preview-name">{customization.name}</p>
                      <p className="pd-custom__preview-sub">Name</p>
                    </div>
                    <div>
                      <p className="pd-custom__preview-number">{customization.number}</p>
                      <p className="pd-custom__preview-sub">Number</p>
                    </div>
                  </div>
                </div>
              )}
              <p className="pd-custom__note">Customised items cannot be returned.</p>
            </div>
          )}

          {/* Size */}
          {!isSnapback && !isSticker && (
            <div className="pd-info__section">
              <p className="pd-info__section-label">Size</p>
              <div className="pd-sizes">
                {sizes.map(s => (
                  <button key={s} className={`pd-size ${selectedSize === s ? 'pd-size--active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {isSticker && (
            <div className="pd-info__section">
              <p className="pd-info__tagline">Stick with the culture. Choose 1 sticker for R20, 3 for R50, or 5 for R80.</p>
              <p className="pd-info__section-label">Sticker offer</p>
              <div className="pd-sizes" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                {product.stickerOffers.map(offer => (
                  <button
                    key={offer.quantity}
                    className={`pd-size ${selectedStickerOffer.quantity === offer.quantity ? 'pd-size--active' : ''}`}
                    style={{ width: 'auto', minHeight: 56, height: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}
                    onClick={() => setSelectedStickerOffer(offer)}
                  >
                    <span>{offer.quantity} sticker{offer.quantity > 1 ? 's' : ''}</span>
                    <span>R {offer.price}</span>
                  </button>
                ))}
              </div>
              <p className="pd-info__section-label" style={{ marginTop: 20 }}>Choose sticker colour{selectedStickerOffer.quantity > 1 ? 's' : ''}</p>
              <div className="pd-sticker-colours">
                {selectedStickerColours.map((colour, index) => (
                  <label key={`${selectedStickerOffer.quantity}-${index}`} className="pd-sticker-colour">
                    <span className="pd-sticker-colour__number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="pd-sticker-colour__label">Sticker {index + 1}</span>
                    <span className="pd-sticker-select">
                      <span className={`pd-sticker-select__swatch pd-sticker-select__swatch--${stickerColours.indexOf(colour)}`} />
                      <select
                        value={colour}
                        aria-label={`Choose colour for sticker ${index + 1}`}
                        onChange={event => setSelectedStickerColours(currentColours => currentColours.map((currentColour, colourIndex) =>
                          colourIndex === index ? event.target.value : currentColour
                        ))}
                      >
                        {stickerColours.map(stickerColour => (
                          <option key={stickerColour} value={stickerColour}>{stickerColour}</option>
                        ))}
                      </select>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Colour options — Never 2Fly 2Pray multi-colour tees */}
          {hasColourOptions && product.colourOptions?.length > 0 && (
            <div className="pd-info__section">
              <p className="pd-info__section-label">Colour</p>
              <div className="pd-colour-full">
                <span className="pd-sticker-select pd-sticker-select--full">
                  <select
                    value={selectedColour}
                    aria-label="Choose product colour"
                    onChange={e => setSelectedColour(e.target.value)}
                  >
                    {product.colourOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </span>
              </div>
            </div>
          )}

          {/* Free sticker with this purchase */}
          {includesFreeSticker && product.freeStickerColours?.length > 0 && (
            <div className="pd-info__section">
              <p className="pd-info__tagline">Free sticker with this purchase — choose your colour.</p>
              <p className="pd-info__section-label">Free sticker colour</p>
              <div className="pd-sticker-colours">
                <label className="pd-sticker-colour">
                  <span className="pd-sticker-colour__number">01</span>
                  <span className="pd-sticker-colour__label">Sticker</span>
                  <span className="pd-sticker-select">
                    <select
                      value={freeStickerColour}
                      aria-label="Choose free sticker colour"
                      onChange={e => setFreeStickerColour(e.target.value)}
                    >
                      {product.freeStickerColours.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="pd-info__section">
            <p className="pd-info__section-label">Quantity</p>
            <div className="pd-qty">
              <button className="pd-qty__btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span className="pd-qty__val">{quantity}</span>
              <button className="pd-qty__btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="pd-cta">
            <button className="pd-cta__primary" onClick={handleAddToCart}>Add to Cart</button>
            <button className="pd-cta__secondary" onClick={handleBuyNow}>Buy with Payfast</button>
          </div>

          <p className="pd-info__legal">By purchasing, you agree to the <a href="#">terms and privacy policy</a> of Global-e.</p>

          <div className="pd-pairs">
            <p className="pd-pairs__label">{isSticker ? 'Never2Fly2Pray' : 'Fan Picks'}</p>
            <h3 className="pd-pairs__heading">{isSticker ? 'Catalogue' : 'Pairs Well With'}</h3>
            <div className="pd-pairs__grid">
              {(isSticker ? never2Fly2PrayCatalogue : pairsWellWith).map((item, i) => (
                <div key={i} className="pd-rec-card" onClick={() => navigate('/product', { state: { product: item } })}>
                  <div className="pd-rec-card__img-wrap"><img src={item.image} alt={item.name} className="pd-rec-card__img" loading="lazy" /></div>
                  <p className="pd-rec-card__name">{item.name}</p>
                  <p className="pd-rec-card__price">R {item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="pd-also">
        <div className="pd-container">
          <p className="pd-also__label">Discover More</p>
          <h2 className="pd-also__heading">You May Also Like</h2>
          <div className="pd-also__grid">
            {youMayAlsoLike.map((item, i) => (
              <div key={i} className="pd-rec-card" onClick={() => navigate('/product', { state: { product: item } })}>
                <div className="pd-rec-card__img-wrap"><img src={item.image} alt={item.name} className="pd-rec-card__img" loading="lazy" /></div>
                <p className="pd-rec-card__name">{item.name}</p>
                <p className="pd-rec-card__price">R {item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={isJersey
            ? `${product.name}${isWorldCup ? ` (${sleeve === 'short' ? 'Short' : 'Long'} Sleeve)` : ''} (${selectedSize}) added to cart!`
            : `${product.name}${isSnapback ? '' : ` (${selectedSize})`} added to cart!`}
          onClose={() => setShowToast(false)}
        />
      )}

      <style jsx>{`
        .pd-root {
          --ink:#1A1A1A;--ink-mid:#555555;--ink-soft:#999999;
          --paper:#F7F5F2;--paper-dark:#EDEAE5;--border:#E0DBD5;
          --white:#FFFFFF;--wc-gold:#C8A84B;
          background:var(--paper);min-height:100vh;padding-bottom:0;
          overflow-x:hidden;max-width:100%;box-sizing:border-box;
        }
        *,*::before,*::after{box-sizing:border-box;}
        .pd-container{max-width:1380px;margin:0 auto;padding:0 40px;}
        @media(max-width:768px){.pd-container{padding:0 20px;}}
        .pd-back{display:inline-block;padding:32px 0 20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);background:none;border:none;cursor:pointer;transition:color .2s;}
        .pd-back:hover{color:var(--ink);}
        .pd-main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;padding-top:8px;padding-bottom:80px;align-items:start;}
        @media(max-width:1024px){.pd-main{grid-template-columns:1fr;gap:40px;}}

        /* SLEEVE TOGGLE */
        .pd-sleeve-toggle{display:flex;gap:0;border:1px solid var(--border);margin-bottom:12px;width:fit-content;}
        .pd-sleeve-btn{display:flex;flex-direction:column;align-items:center;padding:10px 24px;background:var(--white);color:var(--ink-soft);border:none;cursor:pointer;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;transition:all .2s;gap:3px;}
        .pd-sleeve-btn+.pd-sleeve-btn{border-left:1px solid var(--border);}
        .pd-sleeve-btn--active{background:var(--ink);color:var(--white);}
        .pd-sleeve-btn__price{font-family:'Georgia',serif;font-size:13px;font-weight:400;letter-spacing:0;text-transform:none;color:inherit;opacity:0.75;}

        /* GALLERY */
        .pd-gallery__main{position:relative;background:var(--white);border:1px solid var(--border);overflow:hidden;aspect-ratio:1;}
        .pd-gallery__img{width:100%;height:100%;object-fit:cover;display:block;}
        .pd-gallery__arrow{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;background:rgba(255,255,255,0.9);color:var(--ink);border:1px solid var(--border);border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .2s;z-index:2;}
        .pd-gallery__arrow:hover{background:var(--white);transform:translateY(-50%) scale(1.05);}
        .pd-gallery__arrow--prev{left:16px;}.pd-gallery__arrow--next{right:16px;}
        .pd-gallery__thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px;}
        .pd-gallery__thumb{border:1px solid var(--border);overflow:hidden;background:none;cursor:pointer;padding:0;transition:border-color .2s;}
        .pd-gallery__thumb img{width:100%;height:100px;object-fit:cover;display:block;}
        .pd-gallery__thumb--active{border-color:var(--ink);border-width:2px;}

        /* INFO */
        .pd-info__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;margin:0 0 12px;display:inline-block;}
        .pd-info__tagline{font-family:'Georgia',serif;font-style:italic;font-size:14px;color:var(--ink-mid);letter-spacing:0.04em;margin:-8px 0 16px;}
        .pd-info__title{font-family:'Georgia',serif;font-size:clamp(24px,3vw,40px);font-weight:400;letter-spacing:-0.02em;line-height:1.1;color:var(--ink);margin:0 0 16px;}

        .pd-wc-badge{display:inline-flex;align-items:center;gap:8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--wc-gold);border:1px solid rgba(200,168,75,0.3);padding:6px 12px;margin-bottom:16px;background:rgba(200,168,75,0.06);}
        .pd-wc-badge__dot{width:6px;height:6px;border-radius:50%;background:var(--wc-gold);flex-shrink:0;}
        .pd-collab-badge{display:inline-flex;align-items:center;gap:8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-mid);border:1px solid var(--border);padding:6px 12px;margin-bottom:16px;background:var(--paper-dark);}
        .pd-collab-badge__dot{width:6px;height:6px;border-radius:50%;background:#F5C518;flex-shrink:0;}

        /* PRICE — plain */
        .pd-info__price-wrap{display:flex;align-items:baseline;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
        .pd-info__price{font-family:'Georgia',serif;font-size:26px;color:var(--ink);}
        .pd-info__price-original{font-family:'Georgia',serif;font-size:16px;color:var(--ink-soft);text-decoration:line-through;}
        .pd-info__price-sale{font-family:'Georgia',serif;font-size:28px;color:var(--ink);}
        .pd-info__badge{font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;background:var(--ink);color:var(--white);padding:4px 10px;align-self:center;}

        .pd-info__divider{height:1px;background:var(--border);margin:0 0 28px;}
        .pd-info__section{margin-bottom:28px;}
        .pd-info__section-label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 10px;}

        /* FREE TOTE */
        .pd-tote{border:1px solid rgba(200,168,75,0.35);background:rgba(200,168,75,0.05);padding:20px;margin-bottom:28px;}
        .pd-tote__row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;}
        .pd-tote__heading{font-family:'Georgia',serif;font-size:16px;font-weight:400;color:var(--wc-gold);margin:0;}
        .pd-tote__free{font-family:'Georgia',serif;font-size:14px;color:var(--wc-gold);}
        .pd-tote__sub{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);margin:0;}

        /* FREE BEANIE */
        .pd-beanie{border:1px solid rgba(200,168,75,0.35);background:rgba(13,59,31,0.04);padding:20px;margin-bottom:28px;}
        .pd-beanie__row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px;}
        .pd-beanie__heading{font-family:'Georgia',serif;font-size:16px;font-weight:400;color:var(--wc-gold);margin:0;}
        .pd-beanie__free{font-family:'Georgia',serif;font-size:14px;color:var(--wc-gold);}
        .pd-beanie__sub{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);margin:0 0 16px;}
        .pd-beanie__swatches{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;}
        .pd-beanie__swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;padding:0;outline:none;transition:transform .2s,box-shadow .2s;}
        .pd-beanie__swatch:hover{transform:scale(1.1);}
        .pd-beanie__swatch--active{box-shadow:0 0 0 3px var(--white),0 0 0 5px var(--ink);transform:scale(1.1);}
        .pd-beanie__selected{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-mid);margin:0;}
        .pd-beanie__selected strong{color:var(--ink);}

        /* CUSTOMISATION */
        .pd-custom{border:1px solid var(--border);background:var(--white);padding:24px;margin-bottom:28px;}
        .pd-custom__heading{font-family:'Georgia',serif;font-size:16px;font-weight:400;color:var(--ink);margin:0 0 4px;}
        .pd-custom__sub{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);margin:0 0 20px;}
        .pd-custom__field{margin-bottom:16px;}
        .pd-custom__label{display:block;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-mid);margin-bottom:6px;}
        .pd-custom__label span{font-weight:400;text-transform:none;letter-spacing:0;color:var(--ink-soft);}
        .pd-custom__input{width:100%;padding:10px 14px;border:1px solid var(--border);background:var(--paper);font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:var(--ink);outline:none;transition:border-color .2s;} /* 16px = no iOS auto-zoom on focus */
        .pd-custom__input:focus{border-color:var(--ink);}
        .pd-custom__count{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);display:block;margin-top:4px;text-align:right;}
        .pd-custom__error{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#B91C1C;border-left:2px solid #B91C1C;padding-left:10px;margin-bottom:14px;}
        .pd-custom__preview{border:1px solid var(--border);padding:16px;margin:12px 0;}
        .pd-custom__preview-label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 12px;}
        .pd-custom__preview-display{display:flex;justify-content:center;gap:40px;text-align:center;}
        .pd-custom__preview-name{font-family:'Georgia',serif;font-size:20px;color:var(--ink);margin:0;}
        .pd-custom__preview-number{font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:900;color:var(--ink);margin:0;}
        .pd-custom__preview-sub{font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;color:var(--ink-soft);letter-spacing:0.1em;text-transform:uppercase;margin:4px 0 0;}
        .pd-custom__note{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);margin-top:12px;}

        /* SIZES */
        .pd-sizes{display:flex;gap:8px;flex-wrap:wrap;}
        .pd-size{width:46px;height:46px;border:1px solid var(--border);background:var(--white);color:var(--ink);font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;}
        .pd-size:hover{border-color:var(--ink);}
        .pd-size--active{background:var(--ink);color:var(--white);border-color:var(--ink);}
        .pd-sticker-colours{display:grid;gap:12px;width:100%;}
        .pd-sticker-colour{display:grid;grid-template-columns:32px 80px minmax(0,1fr);align-items:center;gap:12px;width:100%;}
        .pd-sticker-colour__number{font-family:'Georgia',serif;font-size:14px;color:var(--ink-soft);}
        .pd-sticker-colour__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mid);}
        .pd-sticker-select{position:relative;display:flex;align-items:center;min-width:0;width:100%;border:1px solid var(--border);background:var(--white);transition:border-color .2s,box-shadow .2s;min-height:52px;}
        .pd-sticker-select:hover,.pd-sticker-select:focus-within{border-color:var(--ink);box-shadow:0 3px 12px rgba(26,26,26,.06);}
        .pd-sticker-select::after{content:'⌄';position:absolute;right:16px;top:50%;transform:translateY(-55%);font-size:18px;color:var(--ink-mid);pointer-events:none;}
        .pd-sticker-select__swatch{width:22px;height:22px;margin-left:14px;border:1px solid rgba(26,26,26,.2);border-radius:50%;flex:0 0 auto;}
        .pd-sticker-select__swatch--0{background:linear-gradient(135deg,#f97316 0 50%,#111 50%);}
        .pd-sticker-select__swatch--1{background:linear-gradient(135deg,#dc2626 0 50%,#111 50%);}
        .pd-sticker-select__swatch--2{background:conic-gradient(#16a34a 0 33%,#dc2626 33% 66%,#111 66%);}
        .pd-sticker-select__swatch--3{background:conic-gradient(#9333ea 0 33%,#dc2626 33% 66%,#111 66%);}
        .pd-sticker-select__swatch--4{background:conic-gradient(#2563eb 0 33%,#dc2626 33% 66%,#111 66%);}
        .pd-sticker-select__swatch--5{background:linear-gradient(135deg,#fff 0 50%,#111 50%);}
        .pd-sticker-select select{width:100%;min-width:0;min-height:52px;padding:16px 44px 16px 14px;border:0;background:transparent;appearance:none;-webkit-appearance:none;color:var(--ink);font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.3;outline:none;cursor:pointer;}
        .pd-colour-full{width:100%;}
        .pd-sticker-select--full{width:100%;display:flex;}
        @media(max-width:768px){
          .pd-sticker-colour{grid-template-columns:1fr;gap:8px;}
          .pd-sticker-colour__number,.pd-sticker-colour__label{display:none;}
          .pd-sticker-select{min-height:56px;}
          .pd-sticker-select select{min-height:56px;padding:18px 48px 18px 16px;font-size:16px;}
        }

        /* QTY */
        .pd-qty{display:inline-flex;align-items:center;border:1px solid var(--border);background:var(--white);}
        .pd-qty__btn{width:44px;height:44px;background:none;border:none;cursor:pointer;font-size:18px;color:var(--ink);display:flex;align-items:center;justify-content:center;transition:background .2s;}
        .pd-qty__btn:hover{background:var(--paper-dark);}
        .pd-qty__val{width:52px;text-align:center;font-family:'Georgia',serif;font-size:16px;color:var(--ink);border-left:1px solid var(--border);border-right:1px solid var(--border);line-height:44px;}

        /* CTA */
        .pd-cta{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
        .pd-cta__primary{width:100%;padding:16px;background:var(--ink);color:var(--white);border:none;cursor:pointer;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;transition:background .25s;}
        .pd-cta__primary:hover{background:#333;}
        .pd-cta__secondary{width:100%;padding:16px;background:var(--white);color:var(--ink);border:1px solid var(--border);cursor:pointer;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;transition:border-color .25s,background .25s;}
        .pd-cta__secondary:hover{border-color:var(--ink);background:var(--paper);}
        .pd-info__legal{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);line-height:1.7;margin-bottom:48px;}
        .pd-info__legal a{color:var(--ink-mid);text-decoration:underline;}

        /* PAIRS */
        .pd-pairs{border-top:1px solid var(--border);padding-top:40px;}
        .pd-pairs__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:inline-block;margin-bottom:12px;}
        .pd-pairs__heading{font-family:'Georgia',serif;font-size:clamp(20px,2vw,30px);font-weight:400;letter-spacing:-0.02em;color:var(--ink);margin:0 0 28px;}
        .pd-pairs__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}

        /* REC CARD */
        .pd-rec-card{cursor:pointer;}
        .pd-rec-card__img-wrap{overflow:hidden;background:var(--paper-dark);border:1px solid var(--border);aspect-ratio:1;}
        .pd-rec-card__img{width:100%;height:100%;object-fit:cover;transition:transform .55s cubic-bezier(.22,1,.36,1);display:block;}
        .pd-rec-card:hover .pd-rec-card__img{transform:scale(1.05);}
        .pd-rec-card__name{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);margin:10px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;}
        .pd-rec-card__price{font-family:'Georgia',serif;font-size:13px;color:var(--ink-mid);text-align:center;}

        /* YOU MAY ALSO LIKE */
        .pd-also{background:var(--white);border-top:1px solid var(--border);padding:80px 0;}
        .pd-also__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:inline-block;margin-bottom:12px;}
        .pd-also__heading{font-family:'Georgia',serif;font-size:clamp(22px,2.5vw,36px);font-weight:400;letter-spacing:-0.02em;color:var(--ink);margin:0 0 40px;}
        .pd-also__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}
        @media(max-width:900px){.pd-also__grid{grid-template-columns:repeat(2,1fr);}}
        .pd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:20px;font-family:'Georgia',serif;font-size:18px;color:#555;}
      `}</style>
    </section>
  );
};

export default ProductDetail;