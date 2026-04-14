// Settings.jsx
import { Bell, Lock, Eye, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Panel from '../components/Panel';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    feedbackAlerts: true,
    dataCollection: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const categories = [
    {
      icon: Bell,
      title: 'Notifications',
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates' },
        { key: 'feedbackAlerts', label: 'Feedback Alerts', desc: 'Real-time interview alerts' },
      ]
    },
    {
      icon: Lock,
      title: 'Privacy & Security',
      items: [
        { key: 'dataCollection', label: 'Data Collection', desc: 'Allow usage analytics' },
      ]
    },
  ];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Panel>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <category.icon className="text-cyan-400" size={24} />
                <h2 className="text-lg font-semibold">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.items.map(item => (
                  <motion.div
                    key={item.key}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition"
                  >
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                    <motion.button
                      onClick={() => toggleSetting(item.key)}
                      className={`w-14 h-8 rounded-full transition ${
                        settings[item.key] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        className={`w-6 h-6 rounded-full bg-white transition ${
                          settings[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                        layout
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </Panel>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Panel>
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                <Eye className="text-red-400" size={24} />
                <h2 className="text-lg font-semibold">Danger Zone</h2>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-900/30 border border-red-700 hover:bg-red-900/50 text-red-400 px-4 py-3 rounded-lg transition"
              >
                Change Password
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-900/30 border border-red-700 hover:bg-red-900/50 text-red-400 px-4 py-3 rounded-lg transition"
              >
                Delete Account
              </motion.button>
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
