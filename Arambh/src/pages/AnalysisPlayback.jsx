// AnalysisPlayback.jsx
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Panel from '../components/Panel';
import MetricBox from '../components/MetricBox';

export default function AnalysisPlayback() {
  const [playbackTime, setPlaybackTime] = useState(45);
  const totalDuration = 300;

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
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Panel>
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Video Player */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800 rounded-lg aspect-video flex items-center justify-center mb-4 overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="text-cyan-400" size={64} />
              </motion.div>
            </motion.div>

            {/* Playback Controls */}
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {/* Timeline */}
              <motion.div variants={itemVariants}>
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  value={playbackTime}
                  onChange={(e) => setPlaybackTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-sm text-slate-400 mt-2">
                  <span>{Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')}</span>
                  <span>{Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}</span>
                </div>
              </motion.div>

              {/* Control Buttons */}
              <motion.div className="flex gap-4 justify-center" variants={containerVariants} initial="hidden" animate="visible">
                {[
                  { icon: Play, label: 'Play' },
                  { icon: Pause, label: 'Pause' },
                  { icon: SkipForward, label: 'Skip' },
                  { icon: Volume2, label: 'Volume' },
                ].map((btn, idx) => (
                  <motion.button
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={idx < 2 ? 'bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition' : 'bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition'}
                  >
                    <btn.icon size={20} />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </Panel>
      </motion.div>

      {/* Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        {[
          { items: [{ label: 'Average WPM', value: '145', good: true }, { label: 'Clarity Score', value: '88%', good: true }] },
          { items: [{ label: 'Filler Count', value: '7', warn: true }, { label: 'Pacing', value: 'Good', good: true }] },
          { items: [{ label: 'Overall Score', value: '82/100', good: true }, { label: 'Confidence', value: '79%', good: true }] },
        ].map((panelData, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Panel>
              {panelData.items.map((item, i) => (
                <MetricBox key={i} label={item.label} value={item.value} good={item.good} warn={item.warn} />
              ))}
            </Panel>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
