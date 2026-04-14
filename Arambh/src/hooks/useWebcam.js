// useWebcam.js
import { useState, useEffect } from 'react';

export function useWebcam() {
  const [isActive, setIsActive] = useState(true);
  const [brightness, setBrightness] = useState(0.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrightness(0.7 + Math.random() * 0.3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return { isActive, setIsActive, brightness };
}
