// src/pages/RefundPolicy.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '../components/Features';

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <section className="max-padd-container py-20">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-700 hover:text-black mb-10 inline-block"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-widest text-center mb-16">Refund Policy</h1>

        <div className="space-y-8 text-lg leading-relaxed">
          <div>
            <h2 className="text-2xl font-medium mb-4">Returns</h2>
            <p>We have a 7-day return policy, which means you have 7 days after receiving your item to request a return.</p>
            <p className="mt-4">To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4">Refunds</h2>
            <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days.</p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4">Exchanges</h2>
            <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4">Contact</h2>
            <p>If you have any questions, please contact us at: <strong>kabelomohlabeng364@gmail.com</strong></p>
          </div>
        </div>
      </div>
      <Features />
    </section>
  );
};

export default RefundPolicy;