// WebcamPanel.jsx
import { useCamera } from '../hooks/useCamera';
import { CheckCircle } from 'lucide-react';

export default function WebcamPanel({ isEnabled = true, isSessionEnded = false, isPaused = false }) {
  const { videoRef, isActive, error } = useCamera(isEnabled && !isSessionEnded);

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      <BadgeBlue>
        {error ? '⚠ Camera Access Denied' : isSessionEnded ? '✓ Session Ended' : !isEnabled || isPaused ? '⏸ Camera Paused' : isActive ? '✓ Camera Active' : 'Initializing...'}
      </BadgeBlue>

      <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#0b1220] to-[#101a30] border border-slate-800 overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ display: isActive && isEnabled && !isSessionEnded ? 'block' : 'none' }}
        />
        
        {isSessionEnded && (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-gradient-to-br from-[#0b1220] to-[#101a30]">
            <CheckCircle className="text-green-400 mb-4" size={80} />
            <p className="text-green-400 text-lg font-semibold">Session Completed</p>
          </div>
        )}

        {(!isActive && !isSessionEnded) || ((!isEnabled || isPaused) && !isSessionEnded && (
          <div className="flex flex-col items-center justify-center absolute inset-0 bg-gradient-to-br from-[#0b1220] to-[#101a30]">
            {!isEnabled || isPaused ? (
              <>
                <div className="text-6xl mb-4">⏸</div>
                <p className="text-slate-400 text-sm">Camera Paused</p>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 text-slate-600 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-400 text-sm">Initializing camera...</p>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm font-semibold">Live Webcam Feed</p>

      <BadgeGreen>● Live Behavioral Analysis {isSessionEnded ? 'Completed' : isEnabled && !isPaused ? 'Active' : 'Paused'}</BadgeGreen>
    </div>
  );
}

const BadgeBlue = ({children}) =>
  <div className="px-4 py-1 rounded-full border border-blue-700 bg-blue-900/60 text-blue-300 text-sm">{children}</div>;

const BadgeGreen = ({children}) =>
  <div className="px-4 py-2 rounded-xl border border-green-700 bg-green-900/40 text-green-400 text-sm">{children}</div>;
