import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/data';

const PopularProducts = () => {
  const navigate = useNavigate();
  const jackets = categories.find(cat => cat.name === "Jackets")?.products || [];

  // Use first 6 jackets, fallback to new1.png
  const popularProducts = jackets.length > 0 ? jackets.slice(0, 6).map((jacket, index) => ({
    name: jacket.name || `Jacket ${index + 1}`,
    image: jacket.image || require('../assets/new1.png'),
    price: jacket.price || 450.00,
    rating: jacket.rating || 4.5
  })) : [
    {
      name: "Bold SU Jacket",
      image: require('../assets/new1.png'),
      price: 450.00,
      rating: 4.7
    },
    {
      name: "Urban Edge Jacket",
      image: require('../assets/new1.png'),
      price: 470.00,
      rating: 4.8
    },
    {
      name: "Street Pulse Jacket",
      image: require('../assets/new1.png'),
      price: 430.00,
      rating: 4.6
    },
    {
      name: "Mafia Denim Jacket",
      image: require('../assets/new1.png'),
      price: 490.00,
      rating: 4.9
    },
    {
      name: "Classic SU Bomber",
      image: require('../assets/new1.png'),
      price: 460.00,
      rating: 4.7
    },
    {
      name: "Rebel Zip Jacket",
      image: require('../assets/new1.png'),
      price: 440.00,
      rating: 4.5
    }
  ];

  // Debugging logs
  console.log("PopularProducts.jsx rendering");
  console.log("PopularProducts.jsx jackets:", jackets);
  console.log("PopularProducts.jsx popularProducts:", popularProducts);
  console.log("PopularProducts.jsx image paths:", popularProducts.map(p => p.image));
  popularProducts.forEach((product, index) => {
    console.log(`Product ${index + 1} image:`, product.image);
    console.log(`Product ${index + 1} type:`, typeof product.image);
  });

  const renderStars = (rating) => {
    if (!rating) return <span>No rating</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <span>
        {'★'.repeat(fullStars)}
        {halfStar ? '☆' : ''}
        {'☆'.repeat(emptyStars)} ({rating})
      </span>
    );
  };

  return (
    <div className="mb-12">
      <h3 className="text-3xl md:text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 shadow-text fade-in-up text-center">
        Most Loved Jackets
      </h3>
      <div className="max-padd-container mt-4">
        <div className="grid grid-flow-col auto-cols-[33.4%] gap-6 overflow-x-auto md:grid md:grid-cols-4 md:auto-cols-auto md:grid-flow-row md:overflow-visible scroll-snap-x">
          {popularProducts.map((product, index) => (
            <div key={index} className="flex flex-col items-center fade-in-up snap-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-cover rounded-lg hover:scale-105 transition duration-300"
                onError={() => console.error(`Failed to load image for ${product.name}: ${product.image}`)}
              />
              <p className="regular-16 mt-4 max-w-md font-extra-light text-black text-center">{product.name}</p>
              <p className="regular-14 text-tertiary mt-2">R {product.price.toFixed(2)}</p>
              <p className="regular-14 star-rating mt-2">{renderStars(product.rating)}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(`/collections/category/jackets`)}
            className="btn-secondary px-7 py-3.5 slide-right hover:bg-white hover:text-tertiary border-2 border-secondary"
          >
            Shop All Jackets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;