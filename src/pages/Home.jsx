import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import PopularProducts from '../components/PopularProducts';
import ProductDetails from '../components/ProductDetails';
import Blog from '../components/Blog';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
  console.log("Home.jsx rendering");
  return (
    <>
      <Hero />
      <ErrorBoundary>
        <Categories />
      </ErrorBoundary>
      {/* <Features /> */}
      {/* <Blog /> */}
    </>
  );
};

export default Home;