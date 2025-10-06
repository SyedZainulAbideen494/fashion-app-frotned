import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // optional: you can also use 'auto'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
