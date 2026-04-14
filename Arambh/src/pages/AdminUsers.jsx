// AdminUsers.jsx
import { Trash2, Edit, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Panel from '../components/Panel';

export default function AdminUsers() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', interviews: 5, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', interviews: 12, status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', interviews: 3, status: 'Inactive' },
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', role: 'User', interviews: 8, status: 'Active' },
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
        User Management
      </motion.h1>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400">Interviews</th>
                  <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  {users.map(user => (
                    <motion.tr
                      key={user.id}
                      variants={itemVariants}
                      className="border-b border-slate-700/50 hover:bg-slate-900/30 transition"
                      whileHover={{ x: 5 }}
                    >
                      <td className="py-3 px-4 font-semibold">{user.name}</td>
                      <td className="py-3 px-4 text-slate-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.interviews}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'Active' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-slate-900/30 text-slate-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-slate-700 rounded transition"
                        >
                          <Edit size={16} className="text-slate-400" />
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
