import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck, Cpu } from "lucide-react";

export default function ConnectWallet() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask to continue.");
      setIsConnecting(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      localStorage.setItem("wallet", accounts[0]);
    } catch (error) {
      setError("Connection rejected. Please allow the request in MetaMask.");
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (account) {
      // Small delay to show the "Success" state visually
      const timer = setTimeout(() => {
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/user/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [account, navigate, role]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#05070a] text-white overflow-hidden">
      
      {/* Background Visual Flair */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Roles</span>
        </button>

        <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl">
          <div className="bg-slate-900/90 backdrop-blur-2xl p-8 md:p-12 rounded-[calc(1.5rem-1px)]">
            
            {/* Top Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  {account ? <CheckCircle2 size={40} className="text-emerald-400" /> : <Wallet size={40} />}
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                {account ? "Identity Verified" : "Secure Gateway"}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {account 
                  ? "Wallet connected successfully. Redirecting to your secure dashboard..." 
                  : `Please connect your Ethereum wallet to proceed as an ${role?.toUpperCase() || "authorized user"}.`}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!account ? (
              <div className="space-y-6">
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={`relative w-full overflow-hidden group py-4 rounded-xl font-bold text-lg transition-all
                    ${isConnecting ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20'}
                  `}
                >
                  {/* Scanning Animation Effect */}
                  {isConnecting && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-3">
                    {isConnecting ? "Verifying..." : "Connect MetaMask"}
                  </span>
                </button>

                {!window.ethereum && (
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                  >
                    Don't have MetaMask? <span className="underline font-medium text-indigo-400">Install Extension</span>
                  </motion.a>
                )}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center"
              >
                <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-2">Connected Address</p>
                <p className="font-mono text-emerald-400 break-all bg-black/40 p-3 rounded-lg border border-white/5">
                  {account}
                </p>
              </motion.div>
            )}

            {/* Bottom Security Badge */}
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={14} /> 256-bit Encrypted
               </div>
               <div className="flex items-center gap-2">
                  <Cpu size={14} /> Web3 Secure
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}