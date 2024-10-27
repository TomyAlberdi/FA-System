import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    const removeHashCharacter = (str: string) => str.slice(1);
    const targetElement = document.getElementById(removeHashCharacter(hash));

    const scrollToElement = () => {
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'instant',
          inline: 'nearest',
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }
    };

    // Execute scrollToElement after the render
    setTimeout(scrollToElement, 0);
  }, [location]);

  return null;
};

export default ScrollToHashElement;