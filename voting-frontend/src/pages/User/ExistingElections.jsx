import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  PlayCircle, 
  Timer, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  Calendar,
  Lock,
  ChevronRight
} from "lucide-react";

export default function ExistingElections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing");

  // Expanded Dummy Data for Evaluation (6 per category)
  const generateDummy = (prefix, type) => Array.from({ length: 6 }, (_, i) => ({
    id: `${type}-${i}`,
    name: `${prefix} ${2024 + i}`,
    creator: "Official Election Body",
    info: type === "ongoing" ? "Ends in 12h 30m" : type === "upcoming" ? "Opens in 4 days" : "Closed on Oct 20"
  }));

  const elections = {
    ongoing: generateDummy("Student Vote", "ongoing"),
    upcoming: generateDummy("Department Poll", "upcoming"),
    completed: generateDummy("Board Selection", "completed")
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12">
          <button 
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Portal</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Election Registry</h1>
            <p className="text-gray-400">Browse and participate in decentralized voting sessions.</p>
          </div>
        </header>

        {/* Centered Status Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 w-full max-w-xl shadow-2xl">
            <TabButton active={activeTab === "ongoing"} onClick={() => setActiveTab("ongoing")} icon={<PlayCircle size={16}/>} label="Ongoing" />
            <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} icon={<Timer size={16}/>} label="Upcoming" />
            <TabButton active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={<CheckCircle2 size={16}/>} label="Closed" />
          </div>
        </div>

        {/* Election Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {elections[activeTab].map((election) => (
              <ElectionCard 
                key={election.id} 
                election={election} 
                type={activeTab} 
                navigate={navigate}
              />
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
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
        active ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-[1.02]" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ElectionCard({ election, type, navigate }) {
  const isOngoing = type === "ongoing";
  const isUpcoming = type === "upcoming";

  const getAction = () => {
    if (isOngoing) return { text: "Enter Election", color: "bg-indigo-600 hover:bg-indigo-500", action: () => navigate("/user/enter-election") };
    if (isUpcoming) return { text: "Get Credential", color: "bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed", action: () => {} };
    return { text: "View Result", color: "bg-emerald-600 hover:bg-emerald-500", action: () => alert("Election Result") };
  };

  const btn = getAction();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-7 rounded-[2.5rem] flex flex-col justify-between shadow-xl transition-all group"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-white/5 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <BarChart3 size={24} />
          </div>
          <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border ${
            isOngoing ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 
            isUpcoming ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 
            'border-gray-500/30 text-gray-500 bg-gray-500/5'
          }`}>
            {type}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-1 leading-tight">{election.name}</h3>
        <p className="text-gray-500 text-sm mb-6">{election.creator}</p>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 py-2 px-3 bg-white/5 rounded-lg w-fit">
          {isOngoing ? <Clock size={16} className="text-emerald-400 animate-pulse" /> : <Calendar size={16} />}
          <span className="font-mono">{election.info}</span>
        </div>
      </div>

      <button
        onClick={btn.action}
        className={`w-full py-4 ${btn.color} text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden`}
      >
        {isUpcoming && <Lock size={16} />}
        <span>{btn.text}</span>
        {!isUpcoming && <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
      </button>
    </motion.div>
  );
}