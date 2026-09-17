import React from 'react';

const ProductDetails = () => {
  console.log("ProductDetails.jsx rendering");

  const details = [
    {
      title: "Premium Fabrics",
      description: "ScottyUzi products are crafted with top-tier materials like soft cotton blends for T-Shirts, durable denim for Jackets, breathable polyester for Tracksuits, and sturdy fabrics for Hats and Jerseys, ensuring comfort and durability across our range."
    },
    {
      title: "Street Culture Inspiration",
      titleStyles: "uppercase",
      description: "Rooted in urban street vibes, our T-Shirts, Tracksuits, Shorts, Hats, Jerseys, and Jackets draw from bold self-expression, music, and global youth culture, designed to empower creators and trendsetters."
    },
    {
      title: "Unisex Design",
      description: "Every ScottyUzi piece—T-Shirts, Tracksuits, Shorts, Hats, Jerseys, and Jackets—is designed with versatile cuts to fit all genders, celebrating inclusivity and individual style."
    }
  ];

  return (
    <section className="max-padd-container mb-12">
      <h3 className="text-3xl md:text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 shadow-text fade-in-up text-center">
        Why ScottyUzi?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {details.map((detail, index) => (
          <div key={index} className="flex flex-col items-center fade-in-up">
            <h4 className={`h4 text-center ${detail.titleStyles || ''}`}>{detail.title}</h4>
            <p className="regular-16 mt-2 max-w-md font-extra-light text-black text-center">
              {detail.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDetails;