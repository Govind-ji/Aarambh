// InterviewLive.jsx - Live Interview Session
import { Play, Pause, Square, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Panel from "../components/Panel";
import MetricBox from "../components/MetricBox";
import FeedbackRow from "../components/FeedbackRow";
import SpeechMeter from "../components/SpeechMeter";
import ConfidenceMeter from "../components/ConfidenceMeter";
import TimerDisplay from "../components/TimerDisplay";
import WebcamPanel from "../components/WebcamPanel";
import { useSpeechMetrics } from "../hooks/useSpeechMetrics";
import { useConfidenceScore } from "../hooks/useConfidenceScore";

export default function InterviewLive() {
  const { wpm, fillerWords, clarity } = useSpeechMetrics();
  const { eyeContact, facialExpression, handMovement, overallConfidence } = useConfidenceScore();
  const [isPaused, setIsPaused] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (!isPaused && !isSessionEnded) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isSessionEnded]);

  const handleStartNewSession = () => {
    setIsPaused(false);
    setIsSessionEnded(false);
    setElapsedSeconds(0);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1220] via-[#0f1b2e] to-[#0b1220] text-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">ARAMBH</h1>
            <p className="text-sm text-slate-400">
              Real-Time AI Interview Assessment
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700" />
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* LEFT PANEL - Speech Meter */}
        <div className="lg:col-span-2">
          <Panel>
            <h2 className="text-slate-300 text-sm mb-4">Speech Accuracy</h2>
            <SpeechMeter percent={clarity} />
            <div className="space-y-4">
              <MetricBox label="Words Per Minute" value={`${wpm} WPM`} good />
              <MetricBox label="Filler Words Count" value={fillerWords} warn />
              <MetricBox label="Clarity Score" value={`${clarity}%`} good />
            </div>
          </Panel>
        </div>

        {/* CENTER - Webcam Panel (Larger) */}
        <div className="lg:col-span-8">
          <Panel className="h-full">
            <WebcamPanel isEnabled={!isPaused && !isSessionEnded} isSessionEnded={isSessionEnded} isPaused={isPaused} />
          </Panel>

          <Panel className="mt-6">
            <h3 className="text-slate-300 mb-4">Real-Time Feedback</h3>
            <FeedbackRow text="Voice clarity detected" type="info" />
            <FeedbackRow text="Excellent posture maintained" type="success" />
            <FeedbackRow text="Maintain eye contact" type="warn" />
          </Panel>
        </div>

        {/* RIGHT PANEL - Confidence Meter */}
        <div className="lg:col-span-2">
          <Panel>
            <h2 className="text-slate-300 text-sm mb-4">Confidence Level</h2>
            <ConfidenceMeter percent={overallConfidence} />
            <div className="space-y-4">
              <MetricBox label="Eye Contact" value={`${eyeContact}%`} good />
              <MetricBox label="Facial Expression" value={`${facialExpression}%`} good />
              <MetricBox label="Hand Movement" value={`${handMovement}%`} warn />
            </div>
          </Panel>
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="mt-6 bg-[#0f1b2e]/90 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-wrap gap-4 justify-between">

        <div className="flex flex-wrap gap-4">
          {!isSessionEnded && (
            <>
              {!isPaused ? (
                <BtnBlue onClick={() => setIsPaused(true)}>
                  <Pause size={18}/> Pause
                </BtnBlue>
              ) : (
                <BtnGreen onClick={() => setIsPaused(false)}>
                  <Play size={18}/> Resume
                </BtnGreen>
              )}
              <BtnRed onClick={() => setIsSessionEnded(true)}>
                <Square size={18}/> End Session
              </BtnRed>
            </>
          )}
          {isSessionEnded && (
            <>
              <BtnGreen onClick={handleStartNewSession}>
                <Play size={18}/> Start New Session
              </BtnGreen>
              <BtnCyan>
                <FileText size={18}/> Generate Report
              </BtnCyan>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <TimerDisplay seconds={elapsedSeconds} isPaused={isPaused} isSessionEnded={isSessionEnded} />
          
          {isSessionEnded ? (
            <motion.div
              className="px-4 py-2 rounded-xl border border-red-700 bg-red-900/50 text-red-400 text-sm font-semibold flex items-center gap-2"
            >
              ●
              <span>ENDED</span>
            </motion.div>
          ) : isPaused ? (
            <motion.div
              className="px-4 py-2 rounded-xl border border-yellow-700 bg-yellow-900/50 text-yellow-400 text-sm font-semibold flex items-center gap-2"
            >
              ⏸
              <span>PAUSED</span>
            </motion.div>
          ) : (
            <motion.div
              className="px-4 py-2 rounded-xl border border-green-700 bg-green-900/50 text-green-400 text-sm font-semibold flex items-center gap-2"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ●
              </motion.span>
              <span>LIVE</span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}

const BtnBlue = ({children, onClick}) =>
  <button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;

const BtnGreen = ({children, onClick}) =>
  <button onClick={onClick} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;

const BtnRed = ({children, onClick}) =>
  <button onClick={onClick} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;

const BtnCyan = ({children}) =>
  <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl flex gap-2 transition">{children}</button>;
