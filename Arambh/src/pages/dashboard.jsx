// Dashboard.jsx - Overall Performance Dashboard
import { TrendingUp, Award, CheckCircle, AlertCircle, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Panel from "../components/Panel";
import { sessionAPI } from "../services/endpoints";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const firstName = user?.firstName || 'User';

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        const response = await sessionAPI.getSessions(1, 20, { status: "completed" });
        const sessions = response.data.data || [];
        const detailedSessions = await Promise.all(
          sessions.map(async (session) => {
            try {
              const detail = await sessionAPI.getSessionById(session._id);
              return detail.data.data || session;
            } catch {
              return session;
            }
          })
        );
        if (isMounted) setDashboardData(buildDashboardData(detailedSessions));
      } catch {
        if (isMounted) setDashboardData(buildDashboardData([]));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  const data = dashboardData || buildDashboardData([]);
  const { stats, improvements, yetToImprove, recentSessions, trend } = data;

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
              {improvements.length === 0 && <p className="text-slate-400">Complete two interviews to see improvements.</p>}
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
              {yetToImprove.length === 0 && <p className="text-slate-400">No improvement areas recorded yet.</p>}
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
              {recentSessions.length === 0 && <p className="text-slate-400">{isLoading ? "Loading sessions..." : "No completed sessions yet."}</p>}
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
            {trend.map((score, idx) => (
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
            {trend.map((_, idx) => <span key={idx}>Session {idx + 1}</span>)}
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

function buildDashboardData(sessions) {
  const completed = sessions
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const first = completed[0];
  const latest = completed[completed.length - 1];
  const metric = (session, group, key) => session?.[group]?.[key] ?? 0;
  const score = (session) => session?.overallScore || session?.confidenceScore || metric(session, 'confidenceMetricsId', 'overallConfidenceScore');
  const firstScore = score(first);
  const latestScore = score(latest);
  const change = (current, previous) => Math.round(current - previous);
  const pace = metric(latest, 'speechMetricsId', 'pace');
  const fillers = metric(latest, 'speechMetricsId', 'fillers');
  const clarity = metric(latest, 'speechMetricsId', 'clarity');
  const eyeContact = metric(latest, 'confidenceMetricsId', 'eyeContact');
  const paceProgress = pace ? Math.max(0, 100 - Math.min(100, Math.abs(pace - 135) / 1.35)) : 0;

  return {
    stats: {
      totalInterviews: completed.length,
      avgScore: completed.length ? Math.round(completed.reduce((sum, session) => sum + score(session), 0) / completed.length) : 0,
      improvement: completed.length > 1 ? change(latestScore, firstScore) : 0,
      streakDays: calculateStreak(completed),
    },
    improvements: completed.length > 1 ? [
      { metric: 'Overall Confidence', previous: firstScore, current: latestScore, change: `${change(latestScore, firstScore) >= 0 ? '+' : ''}${change(latestScore, firstScore)}%` },
      { metric: 'Eye Contact', previous: metric(first, 'confidenceMetricsId', 'eyeContact'), current: eyeContact, change: `${change(eyeContact, metric(first, 'confidenceMetricsId', 'eyeContact')) >= 0 ? '+' : ''}${change(eyeContact, metric(first, 'confidenceMetricsId', 'eyeContact'))}%` },
      { metric: 'Speech Clarity', previous: metric(first, 'speechMetricsId', 'clarity'), current: clarity, change: `${change(clarity, metric(first, 'speechMetricsId', 'clarity')) >= 0 ? '+' : ''}${change(clarity, metric(first, 'speechMetricsId', 'clarity'))}%` },
    ] : [],
    yetToImprove: latest ? [
      { metric: 'Filler Words', target: `${fillers} recorded in the latest session`, progress: Math.max(0, 100 - Math.min(100, fillers * 5)) },
      { metric: 'Speaking Pace', target: pace ? `${pace} WPM (target 120-150)` : 'No WPM recorded', progress: paceProgress },
      { metric: 'Eye Contact', target: `${eyeContact}% in the latest session`, progress: eyeContact },
    ] : [],
    recentSessions: completed.slice(-3).reverse().map((session) => ({
      id: session._id,
      date: new Date(session.endTime || session.createdAt).toLocaleDateString(),
      score: Math.round(score(session)),
      duration: formatDuration(session.duration),
    })),
    trend: completed.slice(-7).map((session) => Math.round(score(session))),
  };
}

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function calculateStreak(sessions) {
  if (sessions.length === 0) return 0;

  const uniqueDays = [...new Set(sessions.map((session) => {
    const date = new Date(session.endTime || session.createdAt);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }))].sort((a, b) => b - a);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  if (uniqueDays[0] !== todayStart && uniqueDays[0] !== yesterdayStart) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    if (uniqueDays[index - 1] - uniqueDays[index] !== 86400000) break;
    streak += 1;
  }
  return streak;
}