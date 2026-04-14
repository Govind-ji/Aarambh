// useSpeechMetrics.js
import { useState, useEffect } from 'react';

export function useSpeechMetrics() {
  const [wpm, setWpm] = useState(142);
  const [fillerWords, setFillerWords] = useState(8);
  const [clarity, setClarity] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setWpm(prev => prev + Math.floor(Math.random() * 10 - 5));
      setFillerWords(prev => Math.max(0, prev + Math.floor(Math.random() * 3 - 1)));
      setClarity(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { wpm, fillerWords, clarity };
}
