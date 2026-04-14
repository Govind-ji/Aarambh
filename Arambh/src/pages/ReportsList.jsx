// ReportsList.jsx
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel';

export default function ReportsList() {
  const navigate = useNavigate();
  const reports = [
    { id: 1, title: 'Technical Interview - Q1', date: '2024-02-15', score: 82 },
    { id: 2, title: 'Behavioral Interview', date: '2024-02-12', score: 78 },
    { id: 3, title: 'Mixed Interview', date: '2024-02-10', score: 85 },
    { id: 4, title: 'Follow-up Interview', date: '2024-02-08', score: 80 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
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
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                whileHover={{ x: 5, backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-slate-900/30 transition border border-slate-800 gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 10 }}
                  >
                    <FileText className="text-cyan-400" size={24} />
                  </motion.div>
                  <div>
                    <p className="font-semibold">{report.title}</p>
                    <p className="text-sm text-slate-400">{report.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="text-right mr-4">
                    <p className="text-2xl font-bold text-cyan-400">{report.score}</p>
                    <p className="text-sm text-slate-400">/100</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/report-view/${report.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"
                  >
                    <Eye size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition"
                  >
                    <Download size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-900/30 hover:bg-red-900/50 p-2 rounded-lg transition text-red-400"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Panel>
      </motion.div>
    </motion.div>
  );
}
