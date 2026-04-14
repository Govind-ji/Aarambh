// Login.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-[#0f1b2e]/80 border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6 max-w-md mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-center gap-3 mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          A
        </motion.div>
        <h1 className="text-2xl font-semibold">ARAMBH</h1>
      </motion.div>

      <motion.h2
        className="text-xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Welcome Back
      </motion.h2>

      {(error || authError) && (
        <motion.div
          variants={itemVariants}
          className="flex gap-3 bg-red-500/10 border border-red-500/50 rounded-lg p-4"
        >
          <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
          <p className="text-red-400 text-sm">{error || authError}</p>
        </motion.div>
      )}

      <motion.form
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              whileHover={{ scale: 1.1 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          variants={itemVariants}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>
      </motion.form>

      <motion.div
        className="relative"
        variants={itemVariants}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0f1b2e] text-slate-400">Or continue with</span>
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full border border-slate-700 rounded-lg py-2 hover:bg-slate-900/50 transition"
      >
        Google
      </motion.button>

      <motion.p
        className="text-center text-sm text-slate-400"
        variants={itemVariants}
      >
        Don't have an account?{' '}
        <motion.button
          type="button"
          onClick={() => navigate('/signup')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          Sign Up
        </motion.button>
      </motion.p>

      <motion.p
        className="text-center text-sm text-slate-400"
        variants={itemVariants}
      >
        <motion.button
          type="button"
          onClick={() => navigate('/reset-password')}
          className="text-cyan-400 hover:text-cyan-300"
          whileHover={{ scale: 1.05 }}
        >
          Forgot password?
        </motion.button>
      </motion.p>
    </motion.div>
  );
}
