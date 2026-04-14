// Dashboard.jsx - Overall Performance Dashboard
import { TrendingUp, Award, CheckCircle, AlertCircle, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Panel from "../components/Panel";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.firstName || 'User';

  const stats = {
    totalInterviews: 12,
    avgScore: 78,
    improvement: 15,
    streakDays: 7,
  };

  const improvements = [
    { metric: "Eye Contact", previous: 65, current: 82, change: "+17%" },
    { metric: "Speech Clarity", previous: 72, current: 85, change: "+13%" },
    { metric: "Body Language", previous: 58, current: 74, change: "+16%" },
  ];

  const yetToImprove = [
    { metric: "Filler Words", target: "Reduce by 30%", progress: 45 },
    { metric: "Speaking Pace", target: "120-150 WPM", progress: 60 },
    { metric: "Hand Gestures", target: "More dynamic", progress: 35 },
  ];

  const recentSessions = [
    { id: 1, date: "Feb 21, 2026", score: 82, duration: "15:30" },
    { id: 2, date: "Feb 20, 2026", score: 78, duration: "14:45" },
    { id: 3, date: "Feb 19, 2026", score: 75, duration: "16:00" },
  ];

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1220] via-[#0f1b2e] to-[#0b1220] text-white p-6">
      
      {/* Animated Greeting Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          {/* Animated Emoji */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl"
          >
            👋
          </motion.div>

          {/* Greeting Text */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-baseline gap-2"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Hi, {firstName}! 
              </h2>
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="text-4xl"
              >
                🎉
              </motion.span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-slate-300 mt-2"
            >
              Welcome back! Ready to ace your next interview?
            </motion.p>
          </div>
        </div>

        {/* Decorative Animated Line */}
        <motion.div
          className="mt-6 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </motion.div>
      
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Performance Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Track your growth and improvements</p>
        </div>
        <motion.button
          onClick={() => navigate("/interview-setup")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition shadow-lg"
        >
          New Interview
        </motion.button>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { icon: BarChart3, label: "Total Interviews", value: stats.totalInterviews, color: "from-purple-500 to-pink-500" },
          { icon: Award, label: "Average Score", value: `${stats.avgScore}%`, color: "from-cyan-500 to-blue-500" },
          { icon: TrendingUp, label: "Improvement", value: `+${stats.improvement}%`, color: "from-green-500 to-emerald-500" },
          { icon: Zap, label: "Current Streak", value: `${stats.streakDays}d`, color: "from-yellow-500 to-orange-500" },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Panel className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Things Improved */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Panel>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-green-400" size={24} />
              <h2 className="text-xl font-semibold">Things Improved</h2>
            </div>
            <div className="space-y-4">
              {improvements.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-green-900/20 border border-green-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-300">{item.metric}</span>
                    <span className="text-green-400 font-bold">{item.change}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-slate-400">{item.previous}%</span>
                    <span className="text-green-400">→</span>
                    <span className="text-green-300 font-semibold">{item.current}%</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.current}%` }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Yet to Improve */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Panel>
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="text-amber-400" size={24} />
              <h2 className="text-xl font-semibold">Yet to Improve</h2>
            </div>
            <div className="space-y-4">
              {yetToImprove.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-amber-300">{item.metric}</span>
                    <span className="text-amber-400 text-sm">{item.progress}%</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{item.target}</p>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Panel>
            <h2 className="text-xl font-semibold mb-6">Recent Sessions</h2>
            <div className="space-y-3">
              {recentSessions.map((session, idx) => (
                <motion.button
                  key={session.id}
                  onClick={() => navigate(`/analysis-playback`)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg p-4 text-left transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">{session.date}</span>
                    <span className="text-cyan-400 font-bold text-lg">{session.score}%</span>
                  </div>
                  <p className="text-sm text-slate-400">Duration: {session.duration}</p>
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/reports")}
              className="w-full mt-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded-lg py-2 font-medium transition"
            >
              View All Reports
            </motion.button>
          </Panel>
        </motion.div>
      </div>

      {/* Growth Chart Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Panel>
          <h2 className="text-2xl font-semibold mb-6">Performance Trend</h2>
          <div className="h-64 flex items-end gap-3 mb-4">
            {[65, 68, 72, 70, 75, 78, 82].map((score, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${(score / 100) * 100}%` }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.6 }}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-lg hover:from-cyan-600 hover:to-blue-700 transition cursor-pointer group relative"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {score}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
            <span>Week 6</span>
            <span>Week 7</span>
          </div>
        </Panel>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="mt-6"
      >
        <Panel className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready for your next challenge?</h3>
              <p className="text-slate-400">Keep the momentum going with another interview session</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/interview-setup")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition"
            >
              Start Interview
            </motion.button>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}