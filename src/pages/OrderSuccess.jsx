// src/pages/OrderSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <section className="max-padd-container py-32 text-center">
      <h1 className="text-6xl font-black tracking-widest mb-8">THANK YOU</h1>
      <p className="text-2xl mb-12">Your order has been received</p>
      <p className="text-gray-600 mb-12">
        A confirmation email has been sent. We'll notify you when your order ships.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-black text-white px-20 py-5 rounded-md text-lg font-medium hover:bg-gray-900 transition"
      >
        CONTINUE SHOPPING
      </button>
    </section>
  );
};

export default OrderSuccess;