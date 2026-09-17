// src/hooks/usePageLoader.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageLoader = (duration = 900) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // true on first visit

  useEffect(() => {
    setLoading(true);
    // Keep loading=true for the full duration + fade-out time
    // so PageLoader isn't unmounted before it finishes
    const id = setTimeout(() => setLoading(false), duration + 600);
    return () => clearTimeout(id);
  }, [location.pathname]);

  return loading;
};

export default usePageLoader;