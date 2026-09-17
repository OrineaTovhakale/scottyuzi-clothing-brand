// src/pages/Cart.jsx — POLISHED EDITION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/data';
import { asset } from '../utils/assets';

const toteImg = asset('tote.png');
const freeBeanie = asset('worldcup/freeBeanie.png');

const Cart = () => {
const navigate = useNavigate();
const [cart, setCart] = useState([]);
const [relatedProducts, setRelatedProducts] = useState([]);

useEffect(() => {
const saved = JSON.parse(localStorage.getItem('cart') || '[]');
setCart(saved);
const all = [];
categories.forEach(cat => cat.products?.forEach(p => all.push(p)));
setRelatedProducts(all.sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

const updateQuantity = (index, delta) => {
const updated = [...cart];
updated[index].quantity = Math.max(1, updated[index].quantity + delta);
setCart(updated);
localStorage.setItem('cart', JSON.stringify(updated));
window.dispatchEvent(new Event('cartUpdated'));
  };

const removeItem = (index) => {
const updated = cart.filter((_, i) => i !== index);
setCart(updated);
localStorage.setItem('cart', JSON.stringify(updated));
window.dispatchEvent(new Event('cartUpdated'));
  };

const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Check for free items
const hasFreeTote = cart.some(item => item.includesTote === true);
const hasFreeSkullCap = cart.some(item => item.includesBeanie === true && item.freeItemChoice === 'skullcap');

if (cart.length === 0) {
return (
<div className="cart-empty">
<p className="cart-empty__label">Your Cart</p>
<h1 className="cart-empty__heading">Nothing here yet.</h1>
<p className="cart-empty__sub">Looks like you haven't added anything to your cart.</p>
<button onClick={() => navigate('/collections')} className="btn-standard">Continue Shopping</button>
<style jsx>{`
          .cart-empty { min-height:70vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#F7F5F2; gap:12px; padding:40px 20px; text-align:center; }
          .cart-empty__label { font-family:'Helvetica Neue',Arial,sans-serif; font-size:10px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:#999; border-bottom:1px solid #E0DBD5; padding-bottom:6px; display:inline-block; margin-bottom:8px; }
          .cart-empty__heading { font-family:'Georgia',serif; font-size:clamp(28px,4vw,48px); font-weight:400; color:#1A1A1A; margin:0 0 8px; }
          .cart-empty__sub { font-family:'Helvetica Neue',Arial,sans-serif; font-size:13px; color:#999; margin:0 0 28px; }
  
        /* — refined accents (added) — */

        /* — refined accent (added) — */
        .cart-summary__cta{transition:background .3s ease,transform .3s cubic-bezier(.22,1,.36,1);}
        .cart-summary__cta:hover{background:var(--accent);transform:translateY(-2px);}
      `}</style>
</div>
    );
  }

return (
<section className="cart-root">
<div className="cart-header">
<p className="cart-header__label">Review & Checkout</p>
<h1 className="cart-header__heading">Your Cart</h1>
<span className="cart-header__count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
</div>
<div className="cart-body">
<div className="cart-items">
{cart.map((item, i) => (
<div key={i} className="cart-item">
<div className="cart-item__img-wrap">
<img src={item.image} alt={item.name} className="cart-item__img" loading="lazy" />
</div>
<div className="cart-item__detail">
<p className="cart-item__name">{item.name}</p>
{item.tagline && <p className="cart-item__tagline">{item.tagline}</p>}
{item.selectedSleeve && <p className="cart-item__meta">{item.selectedSleeve}</p>}
{item.selectedSize && <p className="cart-item__meta">Size: {item.selectedSize}</p>}
{item.stickerColours && <p className="cart-item__meta">Sticker colours: {item.stickerColours.join(' · ')}</p>}
{item.selectedColour && <p className="cart-item__meta">Colour: {item.selectedColour}</p>}
{item.freeStickerColour && <p className="cart-item__tote-note">+ Free sticker: {item.freeStickerColour}</p>}
{item.customization && <p className="cart-item__meta">Custom: {item.customization.name} #{item.customization.number}</p>}

{/* Show selected free item for Black Bafana */}
{item.freeItemChoice && (
<div className="cart-item__free">
  {item.freeItemChoice === 'tote' ? (
    <p className="cart-item__tote-note">+ Free SU Tote Bag</p>
  ) : (
    <p className="cart-item__beanie">
      Free Skull Cap: {item.freeBeanie}
    </p>
  )}
</div>
)}

{/* Green Edition Beanie */}
{item.includesBeanie && !item.freeItemChoice && (
<div className="cart-item__beanie">
<span className="cart-item__beanie-dot" style={{ background: item.beanieColourHex || '#1A1A1A' }} />
                    Free Skull Cap: {item.freeBeanie}
</div>
                )}

<div className="cart-item__qty">
<button className="cart-item__qty-btn" onClick={() => updateQuantity(i, -1)} disabled={item.quantity <= 1}>−</button>
<span className="cart-item__qty-val">{item.quantity}</span>
<button className="cart-item__qty-btn" onClick={() => updateQuantity(i, 1)}>+</button>
</div>
<button className="cart-item__remove" onClick={() => removeItem(i)}>Remove</button>
</div>
<p className="cart-item__price">R {(item.price * item.quantity).toFixed(2)}</p>
</div>
          ))}

{/* Free Tote Bag row */}
{hasFreeTote && (
<div className="cart-item cart-item--tote">
<div className="cart-item__img-wrap">
<img src={toteImg} alt="Exclusive SU Tote Bag" className="cart-item__img" loading="lazy" />
</div>
<div className="cart-item__detail">
<p className="cart-item__name">Exclusive SU Tote Bag</p>
<p className="cart-item__meta">One per order • Complimentary</p>
</div>
<p className="cart-item__price cart-item__price--free">R 0.00</p>
</div>
          )}

{/* Free Skull Cap row (if chosen) */}
{hasFreeSkullCap && (
<div className="cart-item cart-item--tote">
<div className="cart-item__img-wrap">
<img src={freeBeanie} alt="Skull Cap" className="cart-item__img" loading="lazy" />
</div>
<div className="cart-item__detail">
<p className="cart-item__name">Free Skull Cap</p>
<p className="cart-item__meta">Colour: {cart.find(item => item.freeItemChoice === 'skullcap')?.freeBeanie}</p>
</div>
<p className="cart-item__price cart-item__price--free">R 0.00</p>
</div>
          )}
</div>

<div className="cart-summary">
<p className="cart-summary__label">Order Summary</p>
<div className="cart-summary__row">
<span>Subtotal</span>
<span>R {subtotal.toFixed(2)}</span>
</div>
{(hasFreeTote || hasFreeSkullCap) && (
<div className="cart-summary__row cart-summary__row--gift">
<span>Free Gift</span>
<span>R 0.00</span>
</div>
          )}
<div className="cart-summary__row cart-summary__row--soft">
<span>Shipping</span>
<span>Calculated at checkout</span>
</div>
<div className="cart-summary__divider" />
<div className="cart-summary__row cart-summary__row--total">
<span>Total</span>
<span>R {subtotal.toFixed(2)}</span>
</div>
<button className="cart-summary__cta" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
<button className="cart-summary__continue" onClick={() => navigate('/collections')}>Continue Shopping</button>
</div>
</div>

<div className="cart-also">
<p className="cart-also__label">Discover More</p>
<h2 className="cart-also__heading">You May Also Like</h2>
<div className="cart-also__grid">
{relatedProducts.map((item, i) => (
<div key={i} className="cart-rec-card" onClick={() => navigate('/product', { state: { product: item } })}>
<div className="cart-rec-card__img-wrap">
<img src={item.image} alt={item.name} className="cart-rec-card__img" loading="lazy" />
</div>
<p className="cart-rec-card__name">{item.name}</p>
<p className="cart-rec-card__price">R {item.price.toFixed(2)}</p>
</div>
          ))}
</div>
</div>

<style jsx>{`
        *,*::before,*::after{box-sizing:border-box;}
        .cart-root{--ink:#1A1A1A;--ink-mid:#5B5854;--ink-soft:#9A948C;--paper:#F7F5F2;--paper-dark:#EDEAE5;--border:#E0DBD5;--white:#FFFFFF;--well:#FBFAF8;--accent:#C8972E;background:var(--paper);min-height:100vh;overflow-x:hidden;max-width:100%;}
        .cart-header{max-width:1380px;margin:0 auto;padding:48px 40px 32px;border-bottom:1px solid var(--border);}
        @media(max-width:768px){.cart-header{padding:32px 20px 24px;}}
        .cart-header__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:inline-block;margin-bottom:12px;}
        .cart-header__heading{font-family:'Georgia',serif;font-size:clamp(28px,4vw,52px);font-weight:400;letter-spacing:-0.02em;color:var(--ink);margin:0 0 8px;}
        .cart-header__count{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);letter-spacing:0.1em;}
        .cart-body{max-width:1380px;margin:0 auto;padding:40px 40px 80px;display:grid;grid-template-columns:1fr 340px;gap:60px;align-items:start;}
        @media(max-width:1024px){.cart-body{grid-template-columns:1fr;gap:40px;}}
        @media(max-width:768px){.cart-body{padding:24px 20px 60px;}}
        .cart-items{display:flex;flex-direction:column;gap:0;}
        .cart-item{display:grid;grid-template-columns:120px 1fr auto;gap:24px;align-items:start;padding:28px 0;border-bottom:1px solid var(--border);}
        @media(max-width:560px){.cart-item{grid-template-columns:90px 1fr;}}
        .cart-item__img-wrap{background:var(--white);border:1px solid var(--border);aspect-ratio:1;overflow:hidden;}
        .cart-item__img{width:100%;height:100%;object-fit:cover;display:block;}
        .cart-item__detail{display:flex;flex-direction:column;gap:5px;}
        .cart-item__name{font-family:'Georgia',serif;font-size:16px;font-weight:400;color:var(--ink);margin:0;}
        .cart-item__tagline{font-family:'Georgia',serif;font-style:italic;font-size:12px;color:var(--ink-mid);margin:0 0 2px;}
        .cart-item__meta{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);margin:0;}
        .cart-item__free{margin-top:6px;}
        .cart-item__tote-note{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8a6800;margin:0;}
        .cart-item__beanie{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8a6800;margin:4px 0 0;}
        .cart-item__qty{display:inline-flex;align-items:center;border:1px solid var(--border);margin-top:12px;width:fit-content;}
        .cart-item__qty-btn{width:38px;height:38px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--ink);display:flex;align-items:center;justify-content:center;transition:background .2s;}
        .cart-item__qty-btn:hover:not(:disabled){background:var(--paper-dark);}
        .cart-item__qty-btn:disabled{color:var(--ink-soft);cursor:default;}
        .cart-item__qty-val{width:44px;text-align:center;font-family:'Georgia',serif;font-size:15px;color:var(--ink);border-left:1px solid var(--border);border-right:1px solid var(--border);line-height:38px;}
        .cart-item__remove{display:inline-block;margin-top:10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);background:none;border:none;cursor:pointer;padding:0;text-decoration:underline;transition:color .2s;}
        .cart-item__remove:hover{color:var(--ink);}
        .cart-item__price{font-family:'Georgia',serif;font-size:16px;color:var(--ink);white-space:nowrap;padding-top:2px;}
        .cart-item__price--free{color:#8a6800 !important;}
        .cart-item--tote{background:#FFFBEA;border-color:rgba(212,160,23,0.25);}
        .cart-summary__row--gift{color:#8a6800;font-size:12px;}
        .cart-summary{position:sticky;top:100px;background:var(--white);border:1px solid var(--border);padding:28px;}
        .cart-summary__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:block;margin-bottom:20px;}
        .cart-summary__row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:var(--ink);}
        .cart-summary__row--soft{color:var(--ink-soft);font-size:12px;}
        .cart-summary__row--total{font-family:'Georgia',serif;font-size:18px;color:var(--ink);margin-bottom:0;}
        .cart-summary__divider{height:1px;background:var(--border);margin:16px 0;}
        .cart-summary__cta{width:100%;padding:15px;background:var(--ink);color:var(--white);border:none;cursor:pointer;margin-top:20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;transition:background .25s;}
        .cart-summary__cta:hover{background:#333;}
        .cart-summary__continue{width:100%;padding:14px;background:transparent;color:var(--ink-mid);border:1px solid var(--border);cursor:pointer;margin-top:10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;transition:border-color .2s,color .2s;}
        .cart-summary__continue:hover{border-color:var(--ink);color:var(--ink);}
        .cart-also{background:var(--white);border-top:1px solid var(--border);padding:72px 40px;}
        @media(max-width:768px){.cart-also{padding:56px 20px;}}
        .cart-also__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:inline-block;margin-bottom:12px;}
        .cart-also__heading{font-family:'Georgia',serif;font-size:clamp(22px,2.5vw,36px);font-weight:400;letter-spacing:-0.02em;color:var(--ink);margin:0 0 36px;max-width:1380px;}
        .cart-also__grid{max-width:1380px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        @media(max-width:900px){.cart-also__grid{grid-template-columns:repeat(2,1fr);}}
        .cart-rec-card{cursor:pointer;}
        .cart-rec-card__img-wrap{overflow:hidden;background:var(--paper-dark);border:1px solid var(--border);aspect-ratio:1;}
        .cart-rec-card__img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s cubic-bezier(.22,1,.36,1);}
        .cart-rec-card:hover .cart-rec-card__img{transform:scale(1.05);}
        .cart-rec-card__name{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);margin:10px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;}
        .cart-rec-card__price{font-family:'Georgia',serif;font-size:13px;color:var(--ink-mid);text-align:center;}
      `}</style>
</section>
  );
};
export default Cart;