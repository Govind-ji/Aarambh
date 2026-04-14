// ConfidenceMeter.jsx
import { motion } from "framer-motion";

export default function ConfidenceMeter({ percent = 53 }) {
  const getColor = (value) => {
    if (value < 40) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-400';
    return 'bg-cyan-400';
  };

  const getTextColor = (value) => {
    if (value < 40) return 'text-red-400';
    if (value < 70) return 'text-yellow-400';
    return 'text-cyan-400';
  };

  const barColor = getColor(percent);
  const textColor = getTextColor(percent);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-56 w-16 rounded-full bg-slate-800 border border-slate-700 relative overflow-hidden">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-0 w-full ${barColor}`}
        />
      </div>
      <div className={`text-4xl font-bold ${textColor}`}>{percent}%</div>
    </div>
  );
}
