// AnalysisLive.jsx
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import Panel from '../components/Panel';
import MetricBox from '../components/MetricBox';
import FeedbackRow from '../components/FeedbackRow';
import { useSpeechMetrics } from '../hooks/useSpeechMetrics';

export default function AnalysisLive() {
  const { wpm, fillerWords, clarity } = useSpeechMetrics();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Panel>
            <h2 className="font-semibold mb-4">Speech Metrics</h2>
            <MetricBox label="Words Per Minute" value={`${wpm} WPM`} good />
            <MetricBox label="Filler Words" value={fillerWords} warn />
            <MetricBox label="Clarity" value={`${clarity}%`} good />
          </Panel>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Panel>
            <h2 className="font-semibold mb-4">Behavior Metrics</h2>
            <MetricBox label="Eye Contact" value="Good" good />
            <MetricBox label="Facial Expression" value="Neutral" />
            <MetricBox label="Hand Movement" value="Moderate" warn />
          </Panel>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Panel>
            <h2 className="font-semibold mb-4">Analysis Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Processing</p>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full w-3/4 bg-gradient-to-r from-cyan-400 to-blue-600"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
              <p className="text-slate-300">Analyzing interview...</p>
            </div>
          </Panel>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
        <Panel>
          <h2 className="font-semibold mb-4">Real-Time Feedback</h2>
          <FeedbackRow text="Good interview structure" type="success" />
          <FeedbackRow text="Try to minimize filler words" type="warn" />
          <FeedbackRow text="Great use of examples" type="success" />
        </Panel>
      </motion.div>
    </motion.div>
  );
}
