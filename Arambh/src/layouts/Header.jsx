// Header.jsx
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-[#0f1b2e]/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      
      <div className="flex items-center gap-2 ml-auto">
        {/* Notification Bell */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition"
        >
          <Bell size={20} className="text-slate-400 hover:text-slate-300" />
        </motion.button>

        {/* Profile Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition"
          title="View Profile"
        >
          <User size={20} className="text-slate-400 hover:text-cyan-400" />
        </motion.button>

        {/* Logout Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-900/30 transition"
          title="Logout"
        >
          <LogOut size={20} className="text-slate-400 hover:text-red-400" />
        </motion.button>
      </div>
    </div>
  );
}
