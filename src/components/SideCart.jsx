// src/components/SideCart.jsx — POLISHED EDITION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const SideCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(saved);
    }
  }, [isOpen]);

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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => { onClose(); navigate('/checkout'); };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="sc-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="sc-panel">

        {/* Header */}
        <div className="sc-header">
          <div>
            <p className="sc-header__label">Your Cart</p>
            <p className="sc-header__count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button className="sc-close" onClick={onClose} aria-label="Close cart">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sc-body">
          {cart.length === 0 ? (
            <div className="sc-empty">
              <p className="sc-empty__text">Your cart is empty.</p>
              <button
                className="sc-empty__cta"
                onClick={() => { onClose(); navigate('/collections'); }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="sc-items">
                {cart.map((item, i) => (
                  <div key={i} className="sc-item">
                    <div className="sc-item__img-wrap">
                      <img src={item.image} alt={item.name} className="sc-item__img" />
                    </div>
                    <div className="sc-item__detail">
                      <p className="sc-item__name">{item.name}</p>
                      {item.selectedSize && <p className="sc-item__meta">Size: {item.selectedSize}</p>}
                      {item.stickerColours && <p className="sc-item__meta">Colours: {item.stickerColours.join(' · ')}</p>}
                      {item.customization && (
                        <p className="sc-item__meta">
                          {item.customization.name} #{item.customization.number}
                        </p>
                      )}
                      <p className="sc-item__price">R {(item.price * item.quantity).toFixed(2)}</p>
                      <div className="sc-item__qty">
                        <button className="sc-item__qty-btn" onClick={() => updateQuantity(i, -1)} disabled={item.quantity <= 1}>−</button>
                        <span className="sc-item__qty-val">{item.quantity}</span>
                        <button className="sc-item__qty-btn" onClick={() => updateQuantity(i, 1)}>+</button>
                      </div>
                      <button className="sc-item__remove" onClick={() => removeItem(i)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="sc-footer">
                <div className="sc-footer__total">
                  <span>Total</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
                <p className="sc-footer__shipping">Shipping calculated at checkout</p>
                <button className="sc-footer__checkout" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <button className="sc-footer__continue" onClick={() => { onClose(); navigate('/collections'); }}>
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* TOKENS */
        :root {
          --ink:        #1A1A1A;
          --ink-mid:    #555555;
          --ink-soft:   #999999;
          --paper:      #F7F5F2;
          --paper-dark: #EDEAE5;
          --border:     #E0DBD5;
          --white:      #FFFFFF;
        }

        /* BACKDROP */
        .sc-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(2px);
          animation: sc-fade-in .25s ease;
        }
        @keyframes sc-fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* PANEL */
        .sc-panel {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 1001;
          width: 420px; max-width: 100vw;
          background: var(--white);
          display: flex; flex-direction: column;
          animation: sc-slide-in .3s cubic-bezier(.22,1,.36,1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.08);
        }
        @keyframes sc-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (max-width: 480px) { .sc-panel { width: 100vw; } }

        /* HEADER */
        .sc-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 28px 28px 24px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .sc-header__label {
          font-family: 'Georgia', serif;
          font-size: 20px; font-weight: 400; color: var(--ink); margin: 0 0 2px;
        }
        .sc-header__count {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; color: var(--ink-soft); letter-spacing: 0.08em; margin: 0;
        }
        .sc-close {
          background: none; border: none; cursor: pointer;
          color: var(--ink-soft); font-size: 16px; padding: 4px;
          transition: color .2s; margin-top: 4px;
        }
        .sc-close:hover { color: var(--ink); }

        /* BODY */
        .sc-body {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column;
        }

        /* EMPTY */
        .sc-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 28px; text-align: center; gap: 20px;
        }
        .sc-empty__text {
          font-family: 'Georgia', serif;
          font-size: 16px; color: var(--ink-soft); margin: 0;
        }
        .sc-empty__cta {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          background: var(--ink); color: var(--white);
          border: none; padding: 14px 32px; cursor: pointer;
          transition: background .25s;
        }
        .sc-empty__cta:hover { background: var(--accent); }

        /* ITEMS */
        .sc-items {
          flex: 1;
          padding: 8px 28px;
        }
        .sc-item {
          display: grid; grid-template-columns: 88px 1fr; gap: 16px;
          padding: 22px 0;
          border-bottom: 1px solid var(--border);
        }
        .sc-item__img-wrap {
          background: var(--well); border: 1px solid var(--border);
          aspect-ratio: 1; overflow: hidden;
        }
        .sc-item__img { width: 100%; height: 100%; object-fit: contain; padding: 8%; display: block; }

        .sc-item__detail { display: flex; flex-direction: column; gap: 4px; }
        .sc-item__name {
          font-family: 'Georgia', serif;
          font-size: 14px; font-weight: 400; color: var(--ink); margin: 0;
          line-height: 1.3;
        }
        .sc-item__meta {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink-soft); margin: 0;
        }
        .sc-item__price {
          font-family: 'Georgia', serif;
          font-size: 14px; color: var(--ink); margin: 4px 0 0;
        }
        .sc-item__qty {
          display: inline-flex; align-items: center;
          border: 1px solid var(--border); margin-top: 10px; width: fit-content;
        }
        .sc-item__qty-btn {
          width: 32px; height: 32px;
          background: none; border: none; cursor: pointer;
          font-size: 15px; color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .sc-item__qty-btn:hover:not(:disabled) { background: var(--paper-dark); }
        .sc-item__qty-btn:disabled { color: var(--ink-soft); cursor: default; }
        .sc-item__qty-val {
          width: 36px; text-align: center;
          font-family: 'Georgia', serif; font-size: 13px; color: var(--ink);
          border-left: 1px solid var(--border); border-right: 1px solid var(--border);
          line-height: 32px;
        }
        .sc-item__remove {
          display: inline-block; margin-top: 8px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink-soft); background: none; border: none; cursor: pointer;
          padding: 0; text-decoration: underline; transition: color .2s;
        }
        .sc-item__remove:hover { color: var(--ink); }

        /* FOOTER */
        .sc-footer {
          padding: 24px 28px 32px;
          border-top: 1px solid var(--border);
          background: var(--white);
          flex-shrink: 0;
        }
        .sc-footer__total {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 6px;
          font-family: 'Georgia', serif;
          font-size: 18px; color: var(--ink);
        }
        .sc-footer__shipping {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; color: var(--ink-soft); margin: 0 0 20px;
        }
        .sc-footer__checkout {
          width: 100%; padding: 15px;
          background: var(--ink); color: var(--white); border: none; cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          transition: background .25s; margin-bottom: 10px;
          display: block;
        }
        .sc-footer__checkout:hover { background: var(--accent); }
        .sc-footer__continue {
          width: 100%; padding: 14px;
          background: transparent; color: var(--ink-mid);
          border: 1px solid var(--border); cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          transition: border-color .2s, color .2s; display: block;
        }
        .sc-footer__continue:hover { border-color: var(--ink); color: var(--ink); }
      `}</style>
    </>
  );
};

export default SideCart;