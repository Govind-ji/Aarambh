// useCamera.js
import { useState, useEffect, useRef } from 'react';

export function useCamera(isEnabled = true) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        // Request camera with audio
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });

        streamRef.current = stream;

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (isEnabled) {
              videoRef.current.play().catch(err => {
                console.error('Autoplay failed:', err);
                setError('Autoplay failed');
              });
            }
          };
          setIsActive(true);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Camera error:', err);
          setError(err.name === 'NotAllowedError' ? 'Camera permission denied' : err.message);
          setIsActive(false);
        }
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log('Track stopped:', track.kind);
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsActive(false);
    };

    if (isEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isEnabled]);

  return { videoRef, isActive, error };
}
