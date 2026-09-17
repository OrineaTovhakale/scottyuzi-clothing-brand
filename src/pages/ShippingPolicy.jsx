// src/pages/ShippingPolicy.jsx
import React from 'react';

const ShippingPolicy = () => {
  return (
    <section className="max-padd-container py-20">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: February 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">1. Shipping Methods</h2>
            <p className="mb-3">
              We currently offer courier delivery to all provinces in South Africa. All orders are shipped via trusted 
              courier partners to ensure your items arrive safely and on time.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold">Standard Courier Delivery</p>
              <p className="text-sm mt-1">R155.00 flat rate | 3-5 business days</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">2. Processing Time</h2>
            <p>
              Orders are processed Monday through Friday (excluding public holidays). Orders placed after 2:00 PM on 
              Friday will be processed the following Monday.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li><strong>Order Processing:</strong> 1-2 business days</li>
              <li><strong>Delivery Time:</strong> 3-5 business days after dispatch</li>
              <li><strong>Total Estimated Time:</strong> 4-7 business days from order placement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">3. Delivery Locations</h2>
            <p className="mb-3">We deliver to all provinces in South Africa:</p>
            <ul className="grid grid-cols-2 gap-2 ml-4">
              <li>✓ Gauteng</li>
              <li>✓ Western Cape</li>
              <li>✓ KwaZulu-Natal</li>
              <li>✓ Eastern Cape</li>
              <li>✓ Free State</li>
              <li>✓ Limpopo</li>
              <li>✓ Mpumalanga</li>
              <li>✓ Northern Cape</li>
              <li>✓ North West</li>
            </ul>
            <p className="mt-3 text-sm italic">
              Please note: We do not currently offer international shipping.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">4. Order Tracking</h2>
            <p>
              Once your order has been dispatched, you will receive a tracking number via email. You can use this number 
              to track your package with our courier partner. If you don't receive your tracking information within 2 
              business days of placing your order, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">5. Delivery Issues</h2>
            <p className="mb-3"><strong>Lost or Damaged Packages:</strong></p>
            <p className="mb-3">
              If your package appears to be lost or arrives damaged, please contact us immediately at orders@scottyuzi.com 
              with your order number and photos (if damaged). We will work with our courier to resolve the issue.
            </p>
            
            <p className="mb-3 mt-4"><strong>Failed Delivery Attempts:</strong></p>
            <p>
              If the courier is unable to deliver your package after multiple attempts, the package will be returned to us. 
              You will be contacted to arrange redelivery (additional shipping charges may apply) or a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">6. Address Accuracy</h2>
            <p>
              Please ensure your shipping address is complete and accurate. We are not responsible for orders shipped to 
              incorrect addresses provided by the customer. If you need to change your shipping address, contact us 
              immediately after placing your order. We cannot guarantee address changes once the order has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">7. Delays</h2>
            <p className="mb-3">
              While we strive to meet our delivery timeframes, delays may occasionally occur due to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Public holidays</li>
              <li>Extreme weather conditions</li>
              <li>Courier service disruptions</li>
              <li>High order volumes during peak seasons</li>
              <li>Remote delivery locations</li>
            </ul>
            <p className="mt-3">
              We appreciate your patience and will keep you informed of any significant delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">8. Order Cancellation</h2>
            <p>
              You may cancel your order within 24 hours of placement for a full refund. Once an order has been dispatched, 
              it cannot be cancelled. Please refer to our Refund Policy for information on returns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-black">9. Contact Us</h2>
            <p>
              For shipping inquiries, please contact us:
            </p>
            <div className="mt-3 bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> orders@scottyuzi.com</p>
              <p><strong>Phone:</strong> Available on request</p>
              <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM SAST</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ShippingPolicy;