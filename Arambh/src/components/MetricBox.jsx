// MetricBox.jsx
export default function MetricBox({ label, value, good, warn }) {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${
        good ? "text-green-400" :
        warn ? "text-yellow-400" :
        "text-slate-200"
      }`}>
        {value}
      </p>
    </div>
  );
}
