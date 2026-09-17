// src/components/PopupPoster.jsx - FULLY RESPONSIVE
import React, { useState, useEffect } from 'react';
import { asset } from '../utils/assets';

const popupImage = asset('popup/pop.png');

const PopupPoster = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('popupDismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('popupDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-[9998] animate-fade-in"
        onClick={handleClose}
      />

      {/* POPUP - RESPONSIVE FOR ALL SCREENS */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 pointer-events-none">
        <div className="relative w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-3xl pointer-events-auto animate-zoom-in">
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-black text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl font-bold hover:bg-gray-800 transition shadow-2xl hover:rotate-90 duration-300 z-10 border-2 border-white"
          >
            ×
          </button>

          {/* POPUP IMAGE */}
          <img 
            src={popupImage} 
            alt="ScottyUzi Promo" 
            className="w-full h-auto rounded-lg md:rounded-xl shadow-2xl cursor-pointer"
            onClick={() => {
              handleClose();
              window.location.href = '/collections?category=new-products';
            }}
          />
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-zoom-in {
          animation: zoomIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default PopupPoster;