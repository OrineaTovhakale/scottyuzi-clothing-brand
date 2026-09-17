// src/components/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-5 rounded-full shadow-2xl z-50 animate-bounce-in flex items-center gap-3">
      <span className="text-green-400 text-xl">✓</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;