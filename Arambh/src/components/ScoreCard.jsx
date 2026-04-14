// ScoreCard.jsx
import { motion } from "framer-motion";

export default function ScoreCard({ title, score, maxScore = 100, color = "cyan" }) {
  const percentage = (score / maxScore) * 100;
  
  const colorMap = {
    cyan: { bar: "bg-cyan-400", text: "text-cyan-400" },
    green: { bar: "bg-green-400", text: "text-green-400" },
    yellow: { bar: "bg-yellow-400", text: "text-yellow-400" },
    blue: { bar: "bg-blue-400", text: "text-blue-400" },
  };

  const { bar, text } = colorMap[color];

  return (
    <div className="bg-[#0f1b2e]/80 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-slate-300 text-sm mb-4">{title}</h3>
      <div className="text-3xl font-bold mb-4">
        <span className={text}>{score}</span>
        <span className="text-slate-400 text-lg">/{maxScore}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${bar}`}
        />
      </div>
    </div>
  );
}
