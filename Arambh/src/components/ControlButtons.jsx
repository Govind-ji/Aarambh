// ControlButtons.jsx
import { Play, Pause, Square, FileText } from "lucide-react";

export default function ControlButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <BtnBlue><Play size={18}/> Start Interview</BtnBlue>
      <BtnGray><Pause size={18}/> Pause</BtnGray>
      <BtnGray><Square size={18}/> End Session</BtnGray>
      <BtnCyan><FileText size={18}/> Generate Report</BtnCyan>
    </div>
  );
}

const BtnBlue = ({children}) =>
  <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;

const BtnGray = ({children}) =>
  <button className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;

const BtnCyan = ({children}) =>
  <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;
