// src/pages/Checkout.jsx — POLISHED EDITION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { asset } from '../utils/assets';

const toteImg = asset('tote.png');
const slouchyBeanie = asset('Final Selection SCOT/SU Slouchy Beanies/SU Slouchy Beanies Black1.png');

const Checkout = () => {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', phone: '',
    address: '', apartment: '', city: '', province: 'Gauteng',
    postalCode: '', shippingMethod: 'courier', collectionStore: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    if (saved.length === 0) { navigate('/cart'); return; }
    setCart(saved);
    if (user) {
      setFormData(prev => ({
        ...prev,
        email:     user.email || '',
        firstName: user.user_metadata?.name    || '',
        lastName:  user.user_metadata?.surname || '',
        phone:     user.user_metadata?.phone   || '',
      }));
    }
  }, [navigate, user]);

  const provinces = ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Limpopo','Mpumalanga','Northern Cape','North West'];

  const shippingOptions = [
    { id: 'courier', name: 'Courier Delivery',    price: 180, description: 'Delivery to your door — 3 to 5 business days' },
    { id: 'instore', name: 'In-Store Collection', price: 0,   description: 'Pick up from your selected store — Free' },
  ];

  const collectionStores = [
    { id: 'hatfield',  name: 'Hatfield',     address: 'Hatfield, Pretoria',         hours: 'Mon–Sat 9AM–6PM · Sun 10AM–4PM' },
    { id: 'katlehong', name: 'Katlehong',    address: 'Katlehong, Ekurhuleni',      hours: 'Mon–Sat 9AM–6PM · Sun 10AM–4PM' },
    { id: 'braam',     name: 'Braamfontein', address: 'Braamfontein, Johannesburg', hours: 'Mon–Sat 9AM–6PM · Sun 10AM–4PM' },
  ];

  const selectedShipping = shippingOptions.find(o => o.id === formData.shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const subtotal     = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const total        = subtotal + shippingCost;

  // Tote: black edition only (isSaleItem=true and NOT includesBeanie)
  const hasTote = cart.some(item => item.isSaleItem === true && !item.includesBeanie);
const hasFreeSlouchy = cart.some(item => item.includesFreeBeanie === true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'shippingMethod' && value === 'instore') {
      setFormData({ ...formData, shippingMethod: value, collectionStore: '', address: '', apartment: '', city: '', postalCode: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const e = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.firstName.trim()) e.firstName = 'First name required';
    if (!formData.lastName.trim())  e.lastName  = 'Last name required';
    if (!formData.phone || formData.phone.length < 9) e.phone = 'Valid phone number required';
    if (formData.shippingMethod === 'courier') {
      if (!formData.address.trim())    e.address    = 'Address required';
      if (!formData.city.trim())       e.city       = 'City required';
      if (!formData.postalCode.trim()) e.postalCode = 'Postal code required';
    }
    if (formData.shippingMethod === 'instore' && !formData.collectionStore) e.collectionStore = 'Please select a collection store';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setLoading(true);
    try {
      const orderData = {
        customer: formData, items: cart,
        subtotal: subtotal.toFixed(2), shipping: shippingCost.toFixed(2), total: total.toFixed(2),
        timestamp: new Date().toISOString(), shippingMethod: formData.shippingMethod,
        ...(formData.shippingMethod === 'instore' && {
          collectionStore: formData.collectionStore,
          collectionStoreName: collectionStores.find(s => s.id === formData.collectionStore)?.name || '',
        }),
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      const res = await fetch('/api/payfast-exact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const { paymentUrl, formData: pf } = await res.json();
      const form = document.createElement('form');
      form.method = 'POST'; form.action = paymentUrl;
      Object.keys(pf).forEach(key => { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = pf[key]; form.appendChild(input); });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <section className="co-root">

      <div className="co-page-header">
        <p className="co-label">Secure Checkout</p>
        <h1 className="co-page-heading">Complete Your Order</h1>
      </div>

      <div className="co-layout">

        {/* ── FORM ── */}
        <div className="co-form-col">
          <form onSubmit={handleSubmit} noValidate>

            <div className="co-block">
              <p className="co-block__label">Contact Information</p>
              <div className="co-fields">
                <div className="co-field">
                  <label className="co-field__label">Email Address <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!!user} placeholder="your@email.com" className={`co-input ${errors.email ? 'co-input--error' : ''} ${user ? 'co-input--disabled' : ''}`} />
                  {errors.email && <p className="co-field__error">{errors.email}</p>}
                </div>
                <div className="co-field">
                  <label className="co-field__label">Phone Number <span>*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!!user} placeholder="0821234567" className={`co-input ${errors.phone ? 'co-input--error' : ''} ${user ? 'co-input--disabled' : ''}`} />
                  {errors.phone && <p className="co-field__error">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="co-block">
              <p className="co-block__label">Personal Details</p>
              <div className="co-fields co-fields--2col">
                <div className="co-field">
                  <label className="co-field__label">First Name <span>*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!!user} className={`co-input ${errors.firstName ? 'co-input--error' : ''} ${user ? 'co-input--disabled' : ''}`} />
                  {errors.firstName && <p className="co-field__error">{errors.firstName}</p>}
                </div>
                <div className="co-field">
                  <label className="co-field__label">Last Name <span>*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!!user} className={`co-input ${errors.lastName ? 'co-input--error' : ''} ${user ? 'co-input--disabled' : ''}`} />
                  {errors.lastName && <p className="co-field__error">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            <div className="co-block">
              <p className="co-block__label">Delivery Option</p>
              <div className="co-shipping-opts">
                {shippingOptions.map(opt => (
                  <label key={opt.id} className={`co-shipping-opt ${formData.shippingMethod === opt.id ? 'co-shipping-opt--active' : ''}`}>
                    <input type="radio" name="shippingMethod" value={opt.id} checked={formData.shippingMethod === opt.id} onChange={handleChange} className="co-shipping-opt__radio" />
                    <div className="co-shipping-opt__body">
                      <div className="co-shipping-opt__top">
                        <span className="co-shipping-opt__name">{opt.name}</span>
                        <span className="co-shipping-opt__price">{opt.price === 0 ? 'Free' : `R ${opt.price.toFixed(2)}`}</span>
                      </div>
                      <p className="co-shipping-opt__desc">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.shippingMethod === 'instore' && (
              <div className="co-block">
                <p className="co-block__label">Select Collection Store <span className="co-block__req">*</span></p>
                <div className="co-stores">
                  {collectionStores.map(store => (
                    <label key={store.id} className={`co-store ${formData.collectionStore === store.id ? 'co-store--active' : ''}`}>
                      <input type="radio" name="collectionStore" value={store.id} checked={formData.collectionStore === store.id} onChange={handleChange} className="co-store__radio" />
                      <div className="co-store__body">
                        <p className="co-store__name">{store.name}</p>
                        <p className="co-store__address">{store.address}</p>
                        <p className="co-store__hours">{store.hours}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.collectionStore && <p className="co-field__error">{errors.collectionStore}</p>}
              </div>
            )}

            {formData.shippingMethod === 'courier' && (
              <div className="co-block">
                <p className="co-block__label">Shipping Address</p>
                <div className="co-fields">
                  <div className="co-field">
                    <label className="co-field__label">Street Address <span>*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" className={`co-input ${errors.address ? 'co-input--error' : ''}`} />
                    {errors.address && <p className="co-field__error">{errors.address}</p>}
                  </div>
                  <div className="co-field">
                    <label className="co-field__label">Apartment, suite, etc. <span className="co-field__opt">(optional)</span></label>
                    <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} placeholder="Apt 4B" className="co-input" />
                  </div>
                  <div className="co-fields co-fields--3col">
                    <div className="co-field">
                      <label className="co-field__label">City <span>*</span></label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className={`co-input ${errors.city ? 'co-input--error' : ''}`} />
                      {errors.city && <p className="co-field__error">{errors.city}</p>}
                    </div>
                    <div className="co-field">
                      <label className="co-field__label">Province <span>*</span></label>
                      <div className="co-select-wrap">
                        <select name="province" value={formData.province} onChange={handleChange} className="co-select">
                          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <svg className="co-select__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <div className="co-field">
                      <label className="co-field__label">Postal Code <span>*</span></label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`co-input ${errors.postalCode ? 'co-input--error' : ''}`} />
                      {errors.postalCode && <p className="co-field__error">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="co-submit">
              {loading ? 'Processing…' : 'Continue to Payment'}
            </button>
            <p className="co-legal">By completing your order you agree to our <a href="#">Terms & Privacy Policy</a>. Payments processed securely via Payfast.</p>

          </form>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div className="co-summary-col">
          <div className="co-summary">
            <p className="co-summary__label">Order Summary</p>

            <div className="co-summary__items">
              {cart.map((item, i) => (
                <div key={i} className="co-summary__item">
                  <div className="co-summary__item-img">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <span className="co-summary__item-qty">{item.quantity}</span>
                  </div>
                  <div className="co-summary__item-detail">
                    <p className="co-summary__item-name">{item.name}</p>
                    {item.tagline && <p className="co-summary__item-tagline">{item.tagline}</p>}
                    {item.selectedSleeve && <p className="co-summary__item-meta">{item.selectedSleeve}</p>}
                    <p className="co-summary__item-meta">Size: {item.selectedSize}</p>
                    {item.selectedColour && <p className="co-summary__item-meta">Colour: {item.selectedColour}</p>}
                    {item.stickerColours && <p className="co-summary__item-meta">Sticker colours: {item.stickerColours.join(' · ')}</p>}
                    {item.customization  && <p className="co-summary__item-custom">{item.customization.name} #{item.customization.number}</p>}
                    {/* Beanie — green edition */}
                    {item.freeBeanie && (
                      <div className="co-summary__beanie">
                        <span className="co-summary__beanie-dot" style={{ background: item.beanieColourHex || '#1A1A1A' }} />
                        Free Beanie: {item.freeBeanie}
                      </div>
                    )}
                    {/* Tote note on item — black edition */}
{item.includesTote && (
  <p className="co-summary__tote-note">+ Free SU Tote Bag</p>
)}
{item.includesFreeBeanie && (
  <p className="co-summary__tote-note">+ Free SU Slouchy Beanie</p>
)}
{item.freeStickerColour && (
  <p className="co-summary__tote-note">+ Free sticker: {item.freeStickerColour}</p>
)}
                  </div>
                  <p className="co-summary__item-price">R {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              {/* Free tote row — black edition only */}
              {hasTote && (
  <div className="co-summary__item co-summary__item--tote">
    {/* existing tote row — unchanged */}
  </div>
  
)}
{hasFreeSlouchy && (
  <div className="co-summary__item co-summary__item--tote">
    <div className="co-summary__item-img co-summary__item-img--tote">
      <img src={slouchyBeanie} alt="Free SU Slouchy Beanie" loading="lazy" />
    </div>
    <div className="co-summary__item-detail">
      <p className="co-summary__item-name">Free SU Slouchy Beanie</p>
      <p className="co-summary__item-meta">One For One Thursday • Women's Day Edition</p>
      <p className="co-summary__item-free">Complimentary gift</p>
    </div>
    <p className="co-summary__item-price co-summary__item-price--free">R 0.00</p>
  </div>
)}
             
            </div>

            <div className="co-summary__divider" />

            <div className="co-summary__row"><span>Subtotal</span><span>R {subtotal.toFixed(2)}</span></div>
            {hasTote && (
  <div className="co-summary__row co-summary__row--gift"><span>SU Tote Bag (gift)</span><span>R 0.00</span></div>
)}
{hasFreeSlouchy && (
  <div className="co-summary__row co-summary__row--gift"><span>SU Slouchy Beanie (gift)</span><span>R 0.00</span></div>
)}
            <div className="co-summary__row co-summary__row--soft">
              <span>{formData.shippingMethod === 'instore' ? 'Collection' : 'Shipping'}</span>
              <span>{shippingCost === 0 ? 'Free' : `R ${shippingCost.toFixed(2)}`}</span>
            </div>

            {formData.shippingMethod === 'instore' && formData.collectionStore && (
              <div className="co-summary__store">
                <p className="co-summary__store-label">Collecting from</p>
                <p className="co-summary__store-name">{collectionStores.find(s => s.id === formData.collectionStore)?.name}</p>
                <p className="co-summary__store-addr">{collectionStores.find(s => s.id === formData.collectionStore)?.address}</p>
              </div>
            )}

            <div className="co-summary__divider" />
            <div className="co-summary__row co-summary__row--total"><span>Total</span><span>R {total.toFixed(2)}</span></div>
          </div>
        </div>

      </div>

      <style jsx>{`
        *,*::before,*::after{box-sizing:border-box;}
        .co-root{--ink:#1A1A1A;--ink-mid:#555555;--ink-soft:#999999;--paper:#F7F5F2;--paper-dark:#EDEAE5;--border:#E0DBD5;--white:#FFFFFF;--error:#B91C1C;background:var(--paper);min-height:100vh;overflow-x:hidden;max-width:100%;}
        .co-page-header{background:var(--white);border-bottom:1px solid var(--border);padding:40px 40px 32px;max-width:100%;}
        @media(max-width:768px){.co-page-header{padding:28px 20px 22px;}}
        .co-label{display:inline-block;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;margin-bottom:12px;}
        .co-page-heading{font-family:'Georgia',serif;font-size:clamp(24px,3vw,42px);font-weight:400;letter-spacing:-0.02em;color:var(--ink);margin:0;}
        .co-layout{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 400px;gap:0;align-items:start;padding:0;width:100%;}
        @media(max-width:1024px){.co-layout{grid-template-columns:1fr;}}
        .co-form-col{padding:48px 56px 80px 40px;border-right:1px solid var(--border);}
        @media(max-width:1024px){.co-form-col{border-right:none;padding:32px 20px 48px;}}
        .co-block{padding-bottom:36px;margin-bottom:36px;border-bottom:1px solid var(--border);}
        .co-block:last-of-type{border-bottom:none;}
        .co-block__label{font-family:'Georgia',serif;font-size:16px;font-weight:400;color:var(--ink);margin:0 0 20px;}
        .co-block__req{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);}
        .co-fields{display:flex;flex-direction:column;gap:16px;}
        .co-fields--2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .co-fields--3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
        @media(max-width:600px){.co-fields--2col,.co-fields--3col{grid-template-columns:1fr;}}
        .co-field{display:flex;flex-direction:column;gap:6px;}
        .co-field__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-mid);}
        .co-field__label span{color:var(--ink-soft);font-weight:400;}
        .co-field__opt{font-weight:400;text-transform:none;letter-spacing:0;}
        .co-field__error{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--error);border-left:2px solid var(--error);padding-left:8px;}
        .co-input{width:100%;padding:12px 14px;border:1px solid var(--border);background:var(--white);font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:var(--ink);outline:none;transition:border-color .2s;-webkit-appearance:none;} /* 16px = no iOS auto-zoom */
        .co-input:focus{border-color:var(--ink);}
        .co-input--error{border-color:var(--error);}
        .co-input--disabled{background:var(--paper-dark);color:var(--ink-mid);cursor:not-allowed;}
        .co-select-wrap{position:relative;}
        .co-select{width:100%;padding:12px 40px 12px 14px;border:1px solid var(--border);background:var(--white);font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:var(--ink);outline:none;appearance:none;cursor:pointer;transition:border-color .2s;}
        .co-select:focus{border-color:var(--ink);}
        .co-select__arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--ink-soft);pointer-events:none;}
        .co-shipping-opts{display:flex;flex-direction:column;gap:10px;}
        .co-shipping-opt{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border:1px solid var(--border);background:var(--white);cursor:pointer;transition:border-color .2s,background .2s;}
        .co-shipping-opt--active{border-color:var(--ink);background:var(--paper);}
        .co-shipping-opt:not(.co-shipping-opt--active):hover{border-color:var(--ink-mid);}
        .co-shipping-opt__radio{margin-top:3px;flex-shrink:0;accent-color:var(--ink);}
        .co-shipping-opt__body{flex:1;}
        .co-shipping-opt__top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;}
        .co-shipping-opt__name{font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:var(--ink);}
        .co-shipping-opt__price{font-family:'Georgia',serif;font-size:14px;color:var(--ink);}
        .co-shipping-opt__desc{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);margin:0;}
        .co-stores{display:flex;flex-direction:column;gap:10px;}
        .co-store{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border:1px solid var(--border);background:var(--white);cursor:pointer;transition:border-color .2s,background .2s;}
        .co-store--active{border-color:var(--ink);background:var(--paper);}
        .co-store:not(.co-store--active):hover{border-color:var(--ink-mid);}
        .co-store__radio{margin-top:3px;flex-shrink:0;accent-color:var(--ink);}
        .co-store__body{flex:1;}
        .co-store__name{font-family:'Georgia',serif;font-size:15px;font-weight:400;color:var(--ink);margin:0 0 4px;}
        .co-store__address{font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:var(--ink-mid);margin:0 0 3px;}
        .co-store__hours{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-soft);margin:0;}
        .co-submit{width:100%;padding:17px;background:var(--ink);color:var(--white);border:none;cursor:pointer;margin-top:8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;transition:background .25s;}
        .co-submit:hover:not(:disabled){background:#333;}
        .co-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .co-legal{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);line-height:1.7;margin-top:16px;text-align:center;}
        .co-legal a{color:var(--ink-mid);text-decoration:underline;}

        .co-summary-col{padding:48px 40px 80px 48px;background:var(--white);border-left:1px solid var(--border);position:sticky;top:0;min-height:calc(100vh - 120px);}
        @media(max-width:1024px){.co-summary-col{position:static;min-height:auto;border-left:none;border-top:1px solid var(--border);padding:32px 20px 40px;order:-1;}}
        .co-summary__label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-soft);border-bottom:1px solid var(--border);padding-bottom:6px;display:block;margin-bottom:24px;}
        .co-summary__items{display:flex;flex-direction:column;gap:20px;}
        .co-summary__item{display:grid;grid-template-columns:68px 1fr auto;gap:14px;align-items:start;}
        .co-summary__item-img{position:relative;background:var(--paper-dark);border:1px solid var(--border);aspect-ratio:1;overflow:hidden;}
        .co-summary__item-img img{width:100%;height:100%;object-fit:cover;display:block;}
        .co-summary__item-qty{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:var(--ink);color:var(--white);display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;}
        .co-summary__item-name{font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.04em;color:var(--ink);margin:0 0 4px;text-transform:uppercase;}
        .co-summary__item-tagline{font-family:'Georgia',serif;font-style:italic;font-size:11px;color:var(--ink-mid);margin:0 0 3px;}
        .co-summary__item-meta{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-soft);letter-spacing:0.08em;text-transform:uppercase;margin:0;}
        .co-summary__item-custom{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:var(--ink-mid);margin:3px 0 0;letter-spacing:0.06em;}
        .co-summary__beanie{display:flex;align-items:center;gap:6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8a6800;margin:3px 0 0;}
        .co-summary__beanie-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;border:1px solid rgba(0,0,0,0.15);}
        .co-summary__tote-note{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8a6800;margin:3px 0 0;}
        .co-summary__item-price{font-family:'Georgia',serif;font-size:14px;color:var(--ink);white-space:nowrap;}
        .co-summary__item--tote{border-top:1px dashed var(--border);padding-top:16px;margin-top:4px;}
        .co-summary__item-img--tote{background:#FFFBEA;border-color:rgba(212,160,23,0.3);}
        .co-summary__item-free{font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#8a6800;margin:3px 0 0;}
        .co-summary__item-price--free{color:#8a6800;}
        .co-summary__row--gift{color:#8a6800;font-size:12px;}
        .co-summary__divider{height:1px;background:var(--border);margin:20px 0;}
        .co-summary__row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:var(--ink);}
        .co-summary__row--soft{color:var(--ink-soft);font-size:12px;}
        .co-summary__row--total{font-family:'Georgia',serif;font-size:18px;color:var(--ink);margin-bottom:0;}
        .co-summary__store{background:var(--paper-dark);border:1px solid var(--border);padding:12px 14px;margin:12px 0;}
        .co-summary__store-label{font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 4px;}
        .co-summary__store-name{font-family:'Georgia',serif;font-size:14px;color:var(--ink);margin:0 0 3px;}
        .co-summary__store-addr{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:var(--ink-mid);margin:0;}
      `}</style>
    </section>
  );
};

export default Checkout;