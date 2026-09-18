// InterviewLive.jsx - Live Interview Session
import { Play, Pause, Square, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Panel from "../components/Panel";
import MetricBox from "../components/MetricBox";
import FeedbackRow from "../components/FeedbackRow";
import SpeechMeter from "../components/SpeechMeter";
import ConfidenceMeter from "../components/ConfidenceMeter";
import TimerDisplay from "../components/TimerDisplay";
import WebcamPanel from "../components/WebcamPanel";
import { useSpeechMetrics } from "../hooks/useSpeechMetrics";
import { useConfidenceScore } from "../hooks/useConfidenceScore";
import { reportAPI, sessionAPI } from "../services/endpoints";

export default function InterviewLive() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sessionId = state?.sessionId || null;
  const [isPaused, setIsPaused] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const {
    wpm,
    fillerWords,
    clarity,
    isListening: isSpeechListening,
    isSupported: isSpeechSupported,
    error: speechError,
    startListening,
    isStarting: isSpeechStarting,
    isWaitingForSpeech,
    hasSpeechData,
  } = useSpeechMetrics(!isPaused && !isSessionEnded);
  const {
    eyeContact,
    blinkScore,
    headStability,
    overallConfidence,
    isConnected: isCvConnected,
    warnings,
  } = useConfidenceScore(sessionId);
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
    navigate('/interview-setup');
  };

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await sessionAPI.completeSession(sessionId, {
          duration: elapsedSeconds,
          speechMetrics: { pace: wpm, fillers: fillerWords, clarity },
        });
      } catch (error) {
        console.warn('[Session] Could not complete backend session:', error.message);
      }
    }
    setIsSessionEnded(true);
  };

  const handleGenerateReport = async () => {
    if (!sessionId) {
      setReportError('This interview is not linked to a saved session');
      return;
    }
    try {
      setIsGeneratingReport(true);
      setReportError(null);
      const response = await reportAPI.generateReport(sessionId);
      const reportId = response.data.data?._id;
      if (reportId) navigate(`/report-view/${reportId}`);
    } catch (error) {
      setReportError(error.response?.data?.message || 'Could not generate the report');
    } finally {
      setIsGeneratingReport(false);
    }
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
              <MetricBox label="Words Per Minute" value={wpm ? `${wpm} WPM` : 'Waiting for speech'} good={wpm > 0} />
              <MetricBox label="Filler Words Count" value={fillerWords} warn />
              <MetricBox label="Clarity Score" value={clarity ? `${clarity}%` : 'Waiting for speech'} good={clarity > 0} />
            </div>
          </Panel>
        </div>

        {/* CENTER - Webcam Panel (Larger) */}
        <div className="lg:col-span-8">
          <Panel className="h-full">
            <WebcamPanel isEnabled={!isPaused && !isSessionEnded} isSessionEnded={isSessionEnded} isPaused={isPaused} isCvConnected={isCvConnected} />
          </Panel>

          <Panel className="mt-6">
            <h3 className="text-slate-300 mb-4">Real-Time Feedback</h3>
            {speechError && (
              <div className="rounded-xl border border-yellow-700 bg-yellow-900/30 px-4 py-3 text-yellow-400 flex items-center justify-between gap-4">
                <span>{speechError}</span>
                <button type="button" onClick={startListening} disabled={isSpeechStarting} className="rounded-lg bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-500 disabled:cursor-wait disabled:opacity-60">
                  {isSpeechStarting ? 'Starting...' : 'Enable Speech'}
                </button>
              </div>
            )}
            {!isSpeechSupported && !speechError && <FeedbackRow text="Speech recognition is unavailable in this browser" type="warn" />}
            {isSpeechSupported && !isSpeechListening && !isSessionEnded && !speechError && (
              <div className="rounded-xl border border-blue-700 bg-blue-900/30 px-4 py-3 text-blue-300 flex items-center justify-between gap-4">
                <span>Start speech measurement to calculate WPM from your words</span>
                <button type="button" onClick={startListening} disabled={isSpeechStarting} className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60">
                  {isSpeechStarting ? 'Starting...' : 'Start Speech'}
                </button>
              </div>
            )}
            {isSpeechSupported && !speechError && !isSpeechListening && !isSessionEnded && (
              <FeedbackRow text="Waiting for speech input" type="info" />
            )}
            {isSpeechListening && !hasSpeechData && <FeedbackRow text={isWaitingForSpeech ? 'Listening. Speak now to calculate WPM...' : 'Listening for speech input...'} type="info" />}
            {isSpeechListening && hasSpeechData && <FeedbackRow text="Speech is being measured" type="info" />}
            {!isCvConnected && <FeedbackRow text="CV analysis is connecting..." type="info" />}
            {isCvConnected && warnings.length === 0 && (
              <FeedbackRow text="Behavioral indicators are steady" type="success" />
            )}
            {warnings.map((warning) => (
              <FeedbackRow key={warning} text={warning} type="warn" />
            ))}
          </Panel>
        </div>

        {/* RIGHT PANEL - Confidence Meter */}
        <div className="lg:col-span-2">
          <Panel>
            <h2 className="text-slate-300 text-sm mb-4">Confidence Level</h2>
            <ConfidenceMeter percent={overallConfidence} available={isCvConnected} />
            <div className="space-y-4">
              <MetricBox label="Eye Contact" value={isCvConnected ? `${eyeContact}%` : '--'} good={isCvConnected} />
              <MetricBox label="Blink Behavior" value={isCvConnected ? `${blinkScore}%` : '--'} good={isCvConnected} />
              <MetricBox label="Head Stability" value={isCvConnected ? `${headStability}%` : '--'} good={isCvConnected} />
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
              <BtnRed onClick={handleEndSession}>
                <Square size={18}/> End Session
              </BtnRed>
            </>
          )}
          {isSessionEnded && (
            <>
              <BtnGreen onClick={handleStartNewSession}>
                <Play size={18}/> Start New Session
              </BtnGreen>
              <BtnCyan onClick={handleGenerateReport} disabled={isGeneratingReport}>
                <FileText size={18}/> Generate Report
              </BtnCyan>
              {reportError && <p className="basis-full text-sm text-red-400">{reportError}</p>}
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

const BtnCyan = ({children, onClick, disabled}) =>
  <button onClick={onClick} disabled={disabled} className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl flex gap-2 transition disabled:cursor-wait disabled:opacity-60">{children}</button>;
