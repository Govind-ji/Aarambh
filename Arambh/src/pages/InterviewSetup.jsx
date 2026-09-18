// InterviewSetup.jsx
import { Play, Video, Mic, Volume2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Panel from '../components/Panel';
import { sessionAPI } from '../services/endpoints';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [allReady, setAllReady] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const requirements = [
    { icon: Video, label: 'Webcam Access', status: 'ready' },
    { icon: Mic, label: 'Microphone', status: 'ready' },
    { icon: Volume2, label: 'Speakers', status: 'ready' },
  ];

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
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Panel>
          <h2 className="text-xl font-semibold mb-6">Pre-Interview Checklist</h2>

          <motion.div
            className="space-y-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {requirements.map((req, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition"
              >
                <req.icon className="text-cyan-400" size={24} />
                <span className="flex-1">{req.label}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <CheckCircle className="text-green-400" size={24} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <h3 className="text-lg font-semibold mb-4 mt-6">Interview Details</h3>
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm text-slate-400 mb-2">Interview Type</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500">
                <option>Technical Interview</option>
                <option>Behavioral Interview</option>
                <option>Mixed Interview</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm text-slate-400 mb-2">Duration</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={async () => {
                setIsStarting(true);
                try {
                  const response = await sessionAPI.createSession({
                    title: 'Live Interview',
                    category: 'technical',
                    difficulty: 'medium',
                  });
                  const sessionId = response.data?.data?._id;
                  if (sessionId) {
                    await sessionAPI.startSession(sessionId);
                  }
                  navigate('/interview-live', { state: { sessionId } });
                } catch (error) {
                  console.error('[Session] Could not create backend session:', error);
                  navigate('/interview-live');
                } finally {
                  setIsStarting(false);
                }
              }}
              disabled={isStarting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition mt-6"
            >
              <Play size={20} />
              {isStarting ? 'Starting...' : 'Start Interview'}
            </motion.button>
          </motion.div>
        </Panel>
      </motion.div>
    </motion.div>
  );
}
