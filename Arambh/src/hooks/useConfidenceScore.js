// useConfidenceScore.js
import { useState, useEffect } from 'react';

export function useConfidenceScore() {
  const [eyeContact, setEyeContact] = useState(82);
  const [facialExpression, setFacialExpression] = useState(76);
  const [handMovement, setHandMovement] = useState(65);
  const [overallConfidence, setOverallConfidence] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setEyeContact(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 6 - 3))));
      setFacialExpression(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 6 - 3))));
      setHandMovement(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 6 - 3))));
      setOverallConfidence(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 4 - 2))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return { eyeContact, facialExpression, handMovement, overallConfidence };
}
