import React, { useState } from 'react';
import { categories } from '../assets/data';

const Blog = () => {
  console.log("Blog.jsx rendering");
  const [selectedPost, setSelectedPost] = useState(null);

  // Get Instagram posts from data.js
  const instagramPosts = categories.find(cat => cat.name === "Instagram")?.posts || [];

  console.log("Blog.jsx instagramPosts:", instagramPosts.map(p => p.media));

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const isVideo = (media) => media && media.endsWith('.mp4');

  return (
    <section className="max-padd-container py-16">
      <h2 className="text-3xl md:text-4xl font-bold uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 shadow-text">
        ScottyUzi Instagram Feed
      </h2>
      {instagramPosts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-8">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="relative cursor-pointer"
              onClick={() => openModal(post)}
            >
              {isVideo(post.media) ? (
                <video
                  src={post.media}
                  className="w-full h-[200px] object-cover rounded-none hover:scale-105 transition duration-300"
                  onError={() => console.error(`Failed to load Instagram video: ${post.media}`)}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={post.media}
                  alt={`Instagram post ${post.id}`}
                  className="w-full h-[200px] object-cover rounded-none hover:scale-105 transition duration-300"
                  onError={() => console.error(`Failed to load Instagram image: ${post.media}`)}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition duration-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No Instagram posts available</p>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-5xl w-full mx-4 flex flex-col md:flex-row gap-8 relative">
            {isVideo(selectedPost.media) ? (
              <video
                src={selectedPost.media}
                className="w-full md:w-3/5 h-[400px] md:h-[500px] object-contain rounded-lg shadow-lg"
                autoPlay
                controls
                muted
                loop
                playsInline
                onError={() => console.error(`Failed to load modal video: ${selectedPost.media}`)}
              />
            ) : (
              <img
                src={selectedPost.media}
                alt={`Instagram post ${selectedPost.id}`}
                className="w-full md:w-3/5 h-[400px] md:h-[500px] object-contain rounded-lg shadow-lg"
                onError={() => console.error(`Failed to load modal image: ${selectedPost.media}`)}
              />
            )}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-black">scottyuzi.merchandise</h3>
                <hr className="border-t border-gray-200 my-4" />
                <p className="regular-16 font-normal text-black mb-4">{selectedPost.caption}</p>
                <p className="regular-14 text-gray-600 mb-2">{selectedPost.likes} likes</p>
                <p className="regular-14 text-gray-600">{selectedPost.timestamp}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-8 right-4 text-black text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;