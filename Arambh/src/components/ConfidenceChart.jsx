// ConfidenceChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConfidenceChart() {
  const data = [
    { name: 'Body Language', value: 78 },
    { name: 'Eye Contact', value: 82 },
    { name: 'Voice Tone', value: 75 },
    { name: 'Pace', value: 88 },
    { name: 'Grammar', value: 91 },
  ];

  return (
    <div className="bg-[#0f1b2e]/80 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-slate-300 mb-6">Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
