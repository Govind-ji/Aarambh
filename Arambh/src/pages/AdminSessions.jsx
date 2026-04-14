// AdminSessions.jsx
import { Eye, Download, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Panel from '../components/Panel';

export default function AdminSessions() {
  const sessions = [
    { id: 1, user: 'John Doe', type: 'Technical', score: 82, date: '2024-02-15', duration: '5m 32s' },
    { id: 2, user: 'Jane Smith', type: 'Behavioral', score: 78, date: '2024-02-14', duration: '6m 15s' },
    { id: 3, user: 'Mike Johnson', type: 'Mixed', score: 85, date: '2024-02-13', duration: '7m 05s' },
    { id: 4, user: 'Sarah Davis', type: 'Technical', score: 80, date: '2024-02-12', duration: '5m 50s' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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
      <motion.h1
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Session Management
      </motion.h1>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">User</th>
                  <th className="text-left py-3 px-4 text-slate-400">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400">Score</th>
                  <th className="text-left py-3 px-4 text-slate-400">Date</th>
                  <th className="text-left py-3 px-4 text-slate-400">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  {sessions.map(session => (
                    <motion.tr
                      key={session.id}
                      variants={itemVariants}
                      className="border-b border-slate-700/50 hover:bg-slate-900/30 transition"
                      whileHover={{ x: 5 }}
                    >
                      <td className="py-3 px-4 font-semibold">{session.user}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-cyan-900/30 text-cyan-400 text-xs">
                          {session.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-cyan-400">{session.score}</td>
                      <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {session.date}
                      </td>
                      <td className="py-3 px-4">{session.duration}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-blue-900/30 rounded transition"
                        >
                          <Eye size={16} className="text-blue-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-green-900/30 rounded transition"
                        >
                          <Download size={16} className="text-green-400" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-red-900/30 rounded transition"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </tbody>
            </table>
          </div>
        </Panel>
      </motion.div>
    </motion.div>
  );
}
