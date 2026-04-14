// ResetPassword.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
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
      <motion.button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft size={20} />
        Back to Login
      </motion.button>

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

      {!sent ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.h2
            className="text-xl font-semibold text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Reset Password
          </motion.h2>
          <motion.p
            className="text-center text-slate-400 text-sm"
            variants={itemVariants}
          >
            Enter your email address and we'll send you a link to reset your password.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 rounded-lg font-semibold transition"
            >
              Send Reset Link
            </motion.button>
          </motion.form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          <motion.h2
            className="text-xl font-semibold text-center text-green-400"
            variants={itemVariants}
          >
            Check Your Email
          </motion.h2>
          <motion.p
            className="text-center text-slate-400 text-sm"
            variants={itemVariants}
          >
            We've sent a password reset link to <strong>{email}</strong>
          </motion.p>
          <motion.p
            className="text-center text-slate-500 text-sm"
            variants={itemVariants}
          >
            The link will expire in 24 hours. Please check your inbox and spam folder.
          </motion.p>

          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 rounded-lg font-semibold transition"
          >
            Back to Login
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
