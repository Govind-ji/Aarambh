// SystemTest.jsx
import { Cpu, Mic, Camera, Wifi, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Panel from '../components/Panel';

export default function SystemTest() {
  const [tests, setTests] = useState({
    microphone: { status: 'pending', message: 'Click to test' },
    camera: { status: 'pending', message: 'Click to test' },
    speakers: { status: 'pending', message: 'Click to test' },
    internet: { status: 'checking', message: 'Checking...' },
  });

  useEffect(() => {
    // Simulate internet check
    setTimeout(() => {
      setTests(prev => ({
        ...prev,
        internet: { status: 'success', message: 'Connected (25 Mbps)' }
      }));
    }, 2000);
  }, []);

  const testMicrophone = () => {
    setTests(prev => ({
      ...prev,
      microphone: { status: 'checking', message: 'Testing...' }
    }));
    setTimeout(() => {
      setTests(prev => ({
        ...prev,
        microphone: { status: 'success', message: 'Microphone working' }
      }));
    }, 1500);
  };

  const testCamera = () => {
    setTests(prev => ({
      ...prev,
      camera: { status: 'checking', message: 'Testing...' }
    }));
    setTimeout(() => {
      setTests(prev => ({
        ...prev,
        camera: { status: 'success', message: 'Camera working' }
      }));
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'checking': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="text-green-400" size={24} />;
      case 'error': return <AlertCircle className="text-red-400" size={24} />;
      default: return null;
    }
  };

  const testItems = [
    { id: 'microphone', icon: Mic, label: 'Microphone', action: testMicrophone },
    { id: 'camera', icon: Camera, label: 'Camera', action: testCamera },
    { id: 'speakers', icon: Cpu, label: 'Speakers', action: () => {} },
    { id: 'internet', icon: Wifi, label: 'Internet Connection', action: null },
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
      className="w-full max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Panel>
          <motion.p
            className="text-slate-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Before starting an interview, please check that all your devices are working properly.
          </motion.p>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {testItems.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ x: 5, backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/30 transition border border-slate-800 gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 10 }}
                  >
                    <item.icon className="text-cyan-400" size={24} />
                  </motion.div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className={`text-sm ${ tests[item.id].status === 'success' ? 'text-green-400' : tests[item.id].status === 'checking' ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {tests[item.id].message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusIcon(tests[item.id].status)}
                  {item.action && (
                    <motion.button
                      onClick={item.action}
                      disabled={tests[item.id].status === 'checking'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Test
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg font-semibold transition"
          >
            All Tests Passed - Start Interview
          </motion.button>
        </Panel>
      </motion.div>
    </motion.div>
  );
}
