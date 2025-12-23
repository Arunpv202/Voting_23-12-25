import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Calendar, CheckCircle2, BarChart3,
  PlayCircle, Timer, Fingerprint, Database, ExternalLink
} from "lucide-react";

export default function ViewElections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing");

  const generateDummy = (prefix, type) => Array.from({ length: 6 }, (_, i) => ({
    id: `${type}-${i}`,
    name: `${prefix} ${2024 + i}`,
    creator: "Election Commission",
    id_ref: `REG-00${i + 10}`,
    dateInfo: type === "ongoing" ? "Ends in 2 days" : type === "upcoming" ? "Starts Jan 20" : "Ended Nov 15"
  }));

  const elections = {
    ongoing: generateDummy("General Election", "ongoing"),
    upcoming: generateDummy("Council Voting", "upcoming"),
    completed: generateDummy("Board Election", "completed")
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Panel</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Election Registry</h1>
            <p className="text-gray-400">Manage and monitor blockchain-secured voting sessions.</p>
          </div>
        </header>

        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 w-full max-w-xl shadow-2xl">
            <TabButton active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")} icon={<PlayCircle size={16} />} label="Ongoing" />
            <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} icon={<Timer size={16} />} label="Upcoming" />
            <TabButton active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={<CheckCircle2 size={16} />} label="Completed" />
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {elections[activeTab].map((election) => (
              <ElectionCard key={election.id} election={election} type={activeTab} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${active ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-[1.02]" : "text-gray-500 hover:text-gray-300"
        }`}
    >
      {icon} {label}
    </button>
  );
}

function ElectionCard({ election, type }) {
  const navigate = useNavigate();
  const isOngoing = type === "ongoing";
  const isUpcoming = type === "upcoming";
  const isCompleted = type === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-7 rounded-[2.5rem] flex flex-col justify-between shadow-xl hover:border-indigo-500/30 transition-all group"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${isOngoing ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
            <BarChart3 size={24} />
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border mb-2 ${isOngoing ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                isUpcoming ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                  'border-gray-500/30 text-gray-500'
              }`}>
              {type}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
              <Fingerprint size={12} /> {election.id_ref}
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-1 group-hover:text-indigo-400 transition-colors text-white">{election.name}</h3>
        <p className="text-gray-500 text-sm mb-8 font-medium">Created by: {election.creator}</p>

        <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 mb-8">
          {isOngoing ? <Clock size={16} className="text-emerald-400 animate-pulse" /> : <Calendar size={16} />}
          <span className="font-medium">{election.dateInfo}</span>
        </div>
      </div>

      <div className="space-y-3">
        {isCompleted ? (
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20">
              Calculate
            </button>
            <button className="py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all">
              View Result
            </button>
          </div>
        ) : isOngoing ? (
          <button
            className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
            onClick={() => window.open("http://localhost:3001", "_blank")}
          >
            <Database size={18} className="group-hover/btn:rotate-12 transition-transform" />
            <span>View Blockchain</span>
            <ExternalLink size={14} className="opacity-50" />
          </button>
        ) : (
          <button className="w-full py-4 bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
            <span>Setup Configuration</span>
            <PlayCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}