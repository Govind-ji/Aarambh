// Signup.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(
        formData.firstName,
        formData.lastName || '',
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      // After successful signup, navigate to login
      navigate('/login', { state: { email: formData.email } });
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
        Create Account
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
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              disabled={loading}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              disabled={loading}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              disabled={loading}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              disabled={loading}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              whileHover={{ scale: 1.1 }}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-slate-400 mb-2">Confirm Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              disabled={loading}
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              whileHover={{ scale: 1.1 }}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </motion.button>
      </motion.form>

      <motion.p
        className="text-center text-sm text-slate-400"
        variants={itemVariants}
      >
        Already have an account?{' '}
        <motion.button
          onClick={() => navigate('/login')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          Sign in
        </motion.button>
      </motion.p>
    </motion.div>
  );
}
