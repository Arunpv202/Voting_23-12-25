import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  User, 
  Flag, 
  ArrowRight, 
  ShieldCheck,
  Trophy
} from "lucide-react";

export default function VotePage() {
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setVoted(true);
    // After 3 seconds, redirect to the registry
    setTimeout(() => {
      navigate("/user/existing-elections");
    }, 3000);
  };

  const candidates = [
    { id: 1, name: "Alice Johnson", party: "Digital Alliance", symbol: "⚡" },
    { id: 2, name: "Bob Smith", party: "Block Party", symbol: "💎" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <ShieldCheck size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Authenticated Ballot</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Cast Your Vote</h1>
          <p className="text-gray-400">Select one candidate. This action is irreversible once signed on the blockchain.</p>
        </header>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              whileHover={{ y: -8 }}
              className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center group relative overflow-hidden shadow-2xl"
            >
              {/* Profile Image Placeholder */}
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                <User size={40} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
                <div className="flex items-center justify-center gap-2 text-indigo-400 font-medium">
                  <Flag size={14} />
                  <span className="text-sm uppercase tracking-wide">{candidate.party}</span>
                </div>
              </div>

              {/* Symbol Placeholder */}
              <div className="text-4xl mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                {candidate.symbol}
              </div>

              <button 
                onClick={() => handleVote(candidate.name)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Vote for Candidate</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Success Popup Modal */}
        <AnimatePresence>
          {voted && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-emerald-500/30 p-10 rounded-[3rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Vote Cast Successfully!</h2>
                <p className="text-gray-400 mb-8">Your vote for <span className="text-white font-bold">{selectedCandidate}</span> has been broadcasted to the network.</p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono animate-pulse">
                  <Trophy size={14} /> Redirecting to Registry...
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}