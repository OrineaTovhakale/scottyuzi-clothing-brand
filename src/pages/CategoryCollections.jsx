import React, { useState } from 'react';
import { categories } from '../assets/data';
import { useParams, useLocation } from 'react-router-dom';

const CategoryCollections = () => {
  const { category } = useParams();
  const { state } = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(state?.selectedProduct || null);

  const categoryData = categories.find(cat => cat.name.toLowerCase().replace(' ', '-') === category) || {};
  const products = categoryData.products || [];
  const displayImage = categoryData.image || categoryData.images?.[0]?.src || categoryData.backgroundVideo;
  const isNewProducts = category === 'new-products';
  const video = categoryData.video;

  console.log(`CategoryCollections.jsx rendering for category: ${category}`);
  console.log("CategoryCollections.jsx products:", products.map(p => p.name));
  console.log("CategoryCollections.jsx selectedProduct:", selectedProduct);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <section className="max-padd-container py-16 min-h-screen">
      <h2 className="text-3xl font-serif tracking-tight md:text-4xl font-bold uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 shadow-text">
        {categoryData.name || category.replace('-', ' ')}
      </h2>
      {isNewProducts && video ? (
        <>
          <div className="mt-8 w-full max-w-full">
            <video
              src={video}
              className="w-full max-w-full h-[300px] md:h-[500px] object-contain rounded-lg shadow-lg animate-fadeIn"
              autoPlay
              muted
              loop
              playsInline
              onError={() => console.error(`Failed to load video for ${categoryData.name}: ${video}`)}
            />
          </div>
          <p className="regular-16 text-gray-600 mt-8 max-w-3xl mx-auto text-center animate-fadeIn">
            Drop into the future with ScottyUzi’s latest heat! Our new collection slaps with untamed street swagger, premium fits, and fearless designs that make you the king of the concrete jungle.
          </p>
        </>
      ) : (
        displayImage && (
          <div className="mt-8">
            {displayImage.endsWith('.mp4') ? (
              <video
                src={displayImage}
                className="w-full h-[300px] md:h-[500px] object-cover rounded-lg shadow-lg animate-fadeIn"
                autoPlay
                muted
                loop
                playsInline
                onError={() => console.error(`Failed to load video for ${categoryData.name}: ${displayImage}`)}
              />
            ) : (
              <img
                src={displayImage}
                alt={categoryData.name}
                className="w-full h-[300px] md:h-[500px] object-cover rounded-lg shadow-lg animate-fadeIn"
                onError={() => console.error(`Failed to load image for ${categoryData.name}: ${displayImage}`)}
              />
            )}
          </div>
        )
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {products.map((product, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => openModal(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[200px] object-cover rounded-lg hover:scale-105 transition duration-300 animate-fadeIn"
              onError={() => console.error(`Failed to load image for ${product.name}: ${product.image}`)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300"></div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-5xl w-full mx-4 flex flex-col md:flex-row gap-8 relative">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full md:w-1/2 h-[300px] md:h-[400px] object-contain rounded-lg shadow-lg"
              onError={() => console.error(`Failed to load modal image: ${selectedProduct.image}`)}
            />
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-black">{selectedProduct.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">{'★'.repeat(Math.floor(selectedProduct.rating))}</span>
                  <span className="text-gray-600 ml-2">{selectedProduct.rating}</span>
                </div>
                <p className="text-xl font-semibold text-black mt-2">R {selectedProduct.price.toFixed(2)}</p>
                <p className="regular-16 text-gray-600 mt-4">{selectedProduct.description || `Premium ${categoryData.name.toLowerCase()} designed for the bold.`}</p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">Size</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
                <button
                  className="mt-4 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                  onClick={() => console.log('Added to cart:', selectedProduct)}
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-6">
                <p className="regular-14 text-gray-600">
                  <strong>Delivery Info:</strong> Free shipping on orders over R100. Expect delivery within 3-5 business days.
                </p>
                <p className="regular-14 text-gray-600 mt-2">
                  Shop with confidence—our team is here to ensure your *ScottyUzi* experience is seamless and dope!
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-black text-xl"
              aria-label="Close product modal"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Other Products */}
      {selectedProduct && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-center text-black">More {categoryData.name} Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {products
              .filter(p => p.name !== selectedProduct.name)
              .map((product, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer"
                  onClick={() => openModal(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded-lg hover:scale-105 transition duration-300 animate-fadeIn"
                    onError={() => console.error(`Failed to load image for ${product.name}: ${product.image}`)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300"></div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryCollections;