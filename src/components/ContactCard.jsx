import React, { useState } from 'react';

const ContactCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const toggleForm = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '+27848857865'; 
    const message = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setFormData({ name: '', email: '', message: '' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Contact Button */}
      <button
        onClick={toggleForm}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition duration-300 z-50"
        aria-label="Open contact form"
      >
        <i className="fas fa-envelope text-xl"></i>
      </button>

      {/* Contact Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 animate-fadeIn relative">
            <button
              onClick={toggleForm}
              className="absolute top-4 right-4 text-black text-xl"
              aria-label="Close contact form"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-2xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 shadow-text">
              Contact ScottyUzi
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Message"
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 bg-transparent text-black py-2 rounded-lg hover:bg-opacity-90 transition duration-300 flex items-center justify-center gap-2 border border-gray-300 poi"
                >
                  <i className="fab fa-whatsapp"></i> Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;