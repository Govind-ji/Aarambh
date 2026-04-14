// TimerDisplay.jsx
import { motion } from 'framer-motion';

export default function TimerDisplay({ seconds = 0, isPaused = false, isSessionEnded = false }) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <motion.div
      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700"
      animate={isPaused && !isSessionEnded ? { opacity: [1, 0.4] } : { opacity: 1 }}
      transition={isPaused && !isSessionEnded ? { duration: 1, repeat: Infinity } : { duration: 0 }}
    >
      Timer: <span className="font-semibold text-cyan-400">{formattedTime}</span>
    </motion.div>
  );
}
