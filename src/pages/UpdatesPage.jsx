// src/pages/UpdatesPage.jsx
import React from 'react';
import Title from '../components/Title';
import { categories } from '../assets/data';

const UpdatesPage = () => {
  const updates = categories.find(cat => cat.name === "Updates & Events");

  return (
    <section className="max-padd-container py-20">
      <Title title1="Updates" title2="& Events" titleStyles="mb-12 text-center" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {updates?.images?.map((img, i) => (
          <div
            key={i}
            className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg fly-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <img
              src={img.src}
              alt={`Update ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpdatesPage;