// Panel.jsx
export default function Panel({ children }) {
  return (
    <div className="bg-[#0f1b2e]/80 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
      {children}
    </div>
  );
}
