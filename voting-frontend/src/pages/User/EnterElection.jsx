import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  UserSquare2, 
  ScanFace, 
  ArrowRight,
  Info
} from "lucide-react";

export default function EnterElection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Security Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/user/existing-elections")}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Registry</span>
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          {/* Top Decorative Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">Voter Clearance</h2>
            <p className="text-gray-400 text-sm leading-relaxed px-2">
              Please enter your unique Voter ID to initiate the biometric verification sequence.
            </p>
          </div>

          {/* Input Field */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">
                Official Voter ID
              </label>
              <div className="relative">
                <UserSquare2 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" 
                  size={20} 
                />
                <input 
                  type="text" 
                  placeholder="Enter your registered ID"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700 font-bold tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* Info Badge */}
          <div className="mt-6 flex gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl items-center">
            <Info size={18} className="text-indigo-400 shrink-0" />
            <p className="text-[11px] text-gray-400 leading-snug">
              Your ID will be cross-referenced with the encrypted ledger before opening the camera.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate("/user/face-verification")}
            className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <ScanFace size={20} />
            <span>Proceed to Face Scan</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-gray-600">
           <div className="h-px w-8 bg-white/5" />
           <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Protocol: Secure-Entry-v2</p>
           <div className="h-px w-8 bg-white/5" />
        </div>
      </motion.div>
    </div>
  );
}