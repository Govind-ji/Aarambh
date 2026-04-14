// InterviewPaused.jsx
import { Play, Square, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';

export default function InterviewPaused() {
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1b2e] to-[#0b1220] text-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Panel>
          <motion.div
            className="text-center space-y-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Interview Paused
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-6"
            >
              <p className="text-slate-300 mb-4">
                You can resume your interview or end it completely.
              </p>
              <motion.div
                className="space-y-2 text-sm text-slate-400"
                variants={itemVariants}
              >
                <p>• Time elapsed: 5 minutes 23 seconds</p>
                <p>• Questions answered: 2/5</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex gap-3"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate('/interview-live')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <Play size={18}/>
                Resume
              </motion.button>
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <Square size={18}/>
                End
              </motion.button>
            </motion.div>

            <motion.button
              onClick={() => navigate('/interview-live')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"
            >
              <RotateCw size={16}/>
              Start Over
            </motion.button>
          </motion.div>
        </Panel>
      </motion.div>
    </div>
  );
}
