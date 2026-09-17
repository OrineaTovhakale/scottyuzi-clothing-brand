// src/components/ValentineBundle.jsx - VALENTINE'S COUPLE SET PAGE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';

const bonnieImg = asset('vday/bonnie.png');
const clydeImg = asset('vday/clyde.png');

// NOTE: Update these paths to match your actual image locations

const ValentineBundle = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('couple'); // 'couple' or 'single'
  const [selectedSingleShirt, setSelectedSingleShirt] = useState('bonnie'); // 'bonnie' or 'clyde' - for single option
  const [selectedSize, setSelectedSize] = useState({ bonnie: 'M', clyde: 'M' });
  const [customization, setCustomization] = useState({
    bonnie: { name: '', number: '' },
    clyde: { name: '', number: '' }
  });

  const handleAddToCart = () => {
    // Validation - make sure customization is filled
    if (selectedOption === 'couple') {
      if (!customization.bonnie.name || !customization.bonnie.number || 
          !customization.clyde.name || !customization.clyde.number) {
        alert('Please fill in all customization details (name and number) for both shirts!');
        return;
      }
    } else if (selectedOption === 'single') {
      const shirt = selectedSingleShirt;
      if (!customization[shirt].name || !customization[shirt].number) {
        alert('Please fill in all customization details (name and number)!');
        return;
      }
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (selectedOption === 'couple') {
      // Add both Bonnie and Clyde to cart
      const bonnieItem = {
        name: 'Bonnie T-Shirt (Valentine\'s Special)',
        price: 350, // 700 / 2 = 350 each for couple set
        image: bonnieImg,
        selectedSize: selectedSize.bonnie,
        quantity: 1,
        customization: {
          name: customization.bonnie.name,
          number: customization.bonnie.number
        },
        isValentineBundle: true
      };

      const clydeItem = {
        name: 'Clyde T-Shirt (Valentine\'s Special)',
        price: 350, // 700 / 2 = 350 each for couple set
        image: clydeImg,
        selectedSize: selectedSize.clyde,
        quantity: 1,
        customization: {
          name: customization.clyde.name,
          number: customization.clyde.number
        },
        isValentineBundle: true
      };

      existingCart.push(bonnieItem, clydeItem);
    } else {
      // Add single shirt (bonnie or clyde based on selectedSingleShirt)
      const shirt = selectedSingleShirt;
      const singleItem = {
        name: `${shirt.charAt(0).toUpperCase() + shirt.slice(1)} T-Shirt (Valentine\'s Special)`,
        price: 400,
        image: shirt === 'bonnie' ? bonnieImg : clydeImg,
        selectedSize: selectedSize[shirt],
        quantity: 1,
        customization: {
          name: customization[shirt].name,
          number: customization[shirt].number
        },
        isValentineBundle: true
      };

      existingCart.push(singleItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));

    // Show success message and redirect
    alert(`${selectedOption === 'couple' ? 'Couple Set' : 'T-Shirt'} added to cart!`);
    navigate('/cart');
  };

  return (
    <section className="min-h-screen bg-black py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-white">
              Bonnie & Clyde
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white font-light tracking-wide">
            Valentine's Exclusive Couple Set
          </p>
          <div className="mt-6 inline-block bg-gradient-to-r from-red-600 to-rose-500 px-8 py-3 rounded-full">
            <p className="text-white text-xl font-bold">
              SAVE 12.5% ON COUPLE SET
            </p>
          </div>
        </div>

        {/* PRICING OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* COUPLE SET OPTION */}
          <div
            onClick={() => setSelectedOption('couple')}
            className={`relative cursor-pointer rounded-2xl p-8 border-4 transition-all duration-300 ${
              selectedOption === 'couple'
                ? 'border-red-500 bg-gradient-to-br from-red-950/40 to-black shadow-[0_0_40px_rgba(239,68,68,0.5)]'
                : 'border-gray-700 bg-gradient-to-br from-gray-900 to-black hover:border-red-700'
            }`}
          >
            {selectedOption === 'couple' && (
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                BEST DEAL
              </div>
            )}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-wide">
                Couple Set
              </h3>
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">
                  R 700
                </span>
                <p className="text-gray-400 line-through text-xl mt-2">R 800</p>
              </div>
              <p className="text-white text-lg mb-6">
                Get both Bonnie & Clyde T-Shirts
              </p>
              <ul className="text-left text-gray-300 space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Save R 100 (12.5% OFF)
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Perfect for couples
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Limited Valentine's Edition
                </li>
              </ul>
            </div>
          </div>

          {/* SINGLE TSHIRT OPTION */}
          <div
            onClick={() => setSelectedOption('single')}
            className={`relative cursor-pointer rounded-2xl p-8 border-4 transition-all duration-300 ${
              selectedOption === 'single'
                ? 'border-red-500 bg-gradient-to-br from-red-950/40 to-black shadow-[0_0_40px_rgba(239,68,68,0.5)]'
                : 'border-gray-700 bg-gradient-to-br from-gray-900 to-black hover:border-red-700'
            }`}
          >
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-wide">
                Single T-Shirt
              </h3>
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-black text-white">
                  R 400
                </span>
              </div>
              <p className="text-white text-lg mb-6">
                Choose Bonnie or Clyde
              </p>
              <ul className="text-left text-gray-300 space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Individual purchase
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Regular pricing
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✓</span>
                  Valentine's Edition
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CUSTOMIZATION PREVIEW */}
        {(selectedOption === 'couple' || selectedOption === 'single') && (
          <div className="mb-12 bg-gradient-to-br from-red-950/40 to-gray-900/40 rounded-2xl p-8 border-2 border-red-900/50">
            <h3 className="text-2xl md:text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300 mb-6 uppercase tracking-wide">
              Your Customization Preview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedOption === 'couple' ? (
                <>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-red-800/30">
                    <h4 className="text-xl font-bold text-white mb-4 text-center">Bonnie's Back</h4>
                    <div className="bg-black rounded-lg p-8 text-center min-h-[120px] flex flex-col items-center justify-center">
                      {customization.bonnie.name || customization.bonnie.number ? (
                        <>
                          <p className="text-white text-3xl md:text-4xl font-black tracking-wider mb-2">
                            {customization.bonnie.name || '---'}
                          </p>
                          <p className="text-red-400 text-5xl md:text-6xl font-black">
                            {customization.bonnie.number || '--'}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">Enter customization below</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-red-800/30">
                    <h4 className="text-xl font-bold text-white mb-4 text-center">Clyde's Back</h4>
                    <div className="bg-black rounded-lg p-8 text-center min-h-[120px] flex flex-col items-center justify-center">
                      {customization.clyde.name || customization.clyde.number ? (
                        <>
                          <p className="text-white text-3xl md:text-4xl font-black tracking-wider mb-2">
                            {customization.clyde.name || '---'}
                          </p>
                          <p className="text-red-400 text-5xl md:text-6xl font-black">
                            {customization.clyde.number || '--'}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">Enter customization below</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-red-800/30 md:col-span-2 max-w-md mx-auto w-full">
                  <h4 className="text-xl font-bold text-white mb-4 text-center">
                    {selectedSingleShirt === 'bonnie' ? "Bonnie's" : "Clyde's"} Back
                  </h4>
                  <div className="bg-black rounded-lg p-8 text-center min-h-[120px] flex flex-col items-center justify-center">
                    {customization[selectedSingleShirt].name || customization[selectedSingleShirt].number ? (
                      <>
                        <p className="text-white text-3xl md:text-4xl font-black tracking-wider mb-2">
                          {customization[selectedSingleShirt].name || '---'}
                        </p>
                        <p className="text-red-400 text-5xl md:text-6xl font-black">
                          {customization[selectedSingleShirt].number || '--'}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">Enter customization below</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCT DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* BONNIE */}
          <div className="relative group">
            {/* Selection indicator for single option */}
            {selectedOption === 'single' && (
              <div className="absolute -top-4 -right-4 z-10">
                <button
                  onClick={() => setSelectedSingleShirt('bonnie')}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    selectedSingleShirt === 'bonnie'
                      ? 'bg-red-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {selectedSingleShirt === 'bonnie' ? '✓ Selected' : 'Select This'}
                </button>
              </div>
            )}
            
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
              <img
                src={bonnieImg}
                alt="Bonnie T-Shirt"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300 mb-4 uppercase tracking-wide">
                Bonnie
              </h3>
              {(selectedOption === 'couple' || (selectedOption === 'single' && selectedSingleShirt === 'bonnie')) && (
                <div>
                  <p className="text-white mb-3 font-semibold">Select Size:</p>
                  <div className="flex justify-center gap-3 mb-6">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize({ ...selectedSize, bonnie: size })}
                        className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                          selectedSize.bonnie === size
                            ? 'bg-red-500 text-white scale-110'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOMIZATION INPUTS */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2 font-semibold">
                        Name on Back:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name (e.g., BONNIE)"
                        value={customization.bonnie.name}
                        onChange={(e) => setCustomization({
                          ...customization,
                          bonnie: { ...customization.bonnie, name: e.target.value.toUpperCase() }
                        })}
                        maxLength={15}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors uppercase placeholder:normal-case"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-semibold">
                        Number on Back:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter number (e.g., 01)"
                        value={customization.bonnie.number}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 2) {
                            setCustomization({
                              ...customization,
                              bonnie: { ...customization.bonnie, number: value }
                            });
                          }
                        }}
                        maxLength={2}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                      />
                      <p className="text-gray-400 text-sm mt-1">Numbers only (max 2 digits)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CLYDE */}
          <div className="relative group">
            {/* Selection indicator for single option */}
            {selectedOption === 'single' && (
              <div className="absolute -top-4 -right-4 z-10">
                <button
                  onClick={() => setSelectedSingleShirt('clyde')}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    selectedSingleShirt === 'clyde'
                      ? 'bg-red-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {selectedSingleShirt === 'clyde' ? '✓ Selected' : 'Select This'}
                </button>
              </div>
            )}
            
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
              <img
                src={clydeImg}
                alt="Clyde T-Shirt"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300 mb-4 uppercase tracking-wide">
                Clyde
              </h3>
              {(selectedOption === 'couple' || (selectedOption === 'single' && selectedSingleShirt === 'clyde')) && (
                <div>
                  <p className="text-white mb-3 font-semibold">Select Size:</p>
                  <div className="flex justify-center gap-3 mb-6">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize({ ...selectedSize, clyde: size })}
                        className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                          selectedSize.clyde === size
                            ? 'bg-red-500 text-white scale-110'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOMIZATION INPUTS */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2 font-semibold">
                        Name on Back:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name (e.g., CLYDE)"
                        value={customization.clyde.name}
                        onChange={(e) => setCustomization({
                          ...customization,
                          clyde: { ...customization.clyde, name: e.target.value.toUpperCase() }
                        })}
                        maxLength={15}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors uppercase placeholder:normal-case"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-semibold">
                        Number on Back:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter number (e.g., 02)"
                        value={customization.clyde.number}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 2) {
                            setCustomization({
                              ...customization,
                              clyde: { ...customization.clyde, number: value }
                            });
                          }
                        }}
                        maxLength={2}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                      />
                      <p className="text-gray-400 text-sm mt-1">Numbers only (max 2 digits)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADD TO CART BUTTON */}
        <div className="mt-16 text-center">
          <button
            onClick={handleAddToCart}
            className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden border-4 border-red-500 text-white text-2xl md:text-3xl font-black uppercase tracking-widest transition-all duration-500 hover:border-white shadow-[0_0_40px_rgba(239,68,68,0.5)] hover:shadow-[0_0_60px_rgba(239,68,68,0.8)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-red-600/20 to-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
              ADD TO CART - R {selectedOption === 'couple' ? '700' : '400'}
            </span>
          </button>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white underline transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValentineBundle;