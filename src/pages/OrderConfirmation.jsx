// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }

    // Clear cart after successful order
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  }, []);

  if (!orderData) {
    return (
      <section className="max-padd-container py-32 text-center">
        <p className="text-lg mb-6">Loading order details...</p>
        <button
          onClick={() => navigate('/collections')}
          className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-900 transition"
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  const orderNumber = searchParams.get('m_payment_id') || `ORD-${Date.now()}`;

  return (
    <section className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS MESSAGE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase, {orderData.customer.firstName}!
          </p>

          <p className="text-gray-600 mb-8">
            We've sent a confirmation email to <strong>{orderData.customer.email}</strong>
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          {/* ORDER DETAILS */}
          <div className="border-t border-gray-200 pt-8 text-left">
            <h2 className="text-xl font-semibold mb-6 uppercase tracking-wide">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {orderData.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">R {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>R {orderData.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>R {orderData.shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>R {orderData.total}</span>
              </div>
            </div>
          </div>

          {/* SHIPPING INFO */}
          <div className="border-t border-gray-200 pt-8 mt-8 text-left">
            <h2 className="text-xl font-semibold mb-4 uppercase tracking-wide">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-medium">{orderData.customer.firstName} {orderData.customer.lastName}</p>
              <p>{orderData.customer.address}</p>
              {orderData.customer.apartment && <p>{orderData.customer.apartment}</p>}
              <p>{orderData.customer.city}, {orderData.customer.province} {orderData.customer.postalCode}</p>
              <p className="mt-2">Phone: {orderData.customer.phone}</p>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Shipping Method:</strong> {orderData.customer.shippingMethod === 'paxi' ? 'Paxi Collection Point' : 'Paxi Home Delivery'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Expected delivery: {orderData.customer.shippingMethod === 'paxi' ? '2-3 business days' : '3-5 business days'}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 space-y-4">
            <button
              onClick={() => navigate('/collections')}
              className="w-full bg-black text-white py-4 rounded-md font-medium text-lg tracking-widest hover:bg-gray-900 transition"
            >
              CONTINUE SHOPPING
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full border-2 border-black text-black py-4 rounded-md font-medium text-lg tracking-widest hover:bg-black hover:text-white transition"
            >
              PRINT ORDER
            </button>
          </div>

          {/* HELP */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Questions about your order? Contact us at{' '}
              <a href="mailto:kabelomohlabeng364@gmail.com" className="text-black underline font-medium">
                                kabelomohlabeng364@gmail.com

              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              We'll send you tracking information once your order ships!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OrderConfirmation;