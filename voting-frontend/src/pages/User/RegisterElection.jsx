import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { storeSecrets } from "../../utils/zkStorage";
import {
  ArrowLeft,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Loader2
} from "lucide-react";

export default function RegisterElection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    election_id: "",
    token: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.election_id || !formData.token) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Connect to MetaMask
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress(); // Ensure connected

      // 2. Generate ZK Identity
      const zkSecret = CryptoJS.lib.WordArray.random(32).toString();
      const salt = CryptoJS.lib.WordArray.random(32).toString();

      // 3. Compute Commitment
      const commitment = CryptoJS.SHA256(zkSecret + formData.election_id + salt).toString();
      console.log("Generated Commitment:", commitment);

      // 4. Sign Message to derive encryption key
      const message = "ZK-VOTING::" + formData.election_id;
      const signature = await signer.signMessage(message);

      // 5. Store Secrets Encrypted
      await storeSecrets(formData.election_id, { zkSecret, salt }, signature);
      console.log("Secrets stored securely.");

      // 6. Send to Backend
      const response = await fetch("http://localhost:5001/api/register", { // NOTE: Update this valid endpoint if different
        method: "POST", // Endpoint is actually /api/register as per server.js: app.post('/api/register', tokenController.registerVoter);
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          election_id: formData.election_id, // Match backend expectation "election_id" (we updated backend to use this)
          token: formData.token,
          commitment: "0x" + commitment // Usually commitments are hex strings, 0x prefix is good practice
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      alert("Registration Successful! You are now anonymous.");
      navigate("/user/dashboard"); // Or wherever appropriate

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/user/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-px -left-px w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-tl-[2.5rem]" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">Register for Election</h2>
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              Enter your authorized credentials to link your wallet to a specific election.
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">
                Election Identifier
              </label>
              <div className="relative">
                <Fingerprint
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  name="election_id"
                  value={formData.election_id}
                  onChange={handleChange}
                  placeholder="e.g. ELEC-2024-X"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700 font-medium font-mono text-sm"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">
                Secure Token Number
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700 font-medium font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 flex gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-blue-300 leading-snug">
            <ShieldAlert size={16} className="shrink-0 opacity-70" />
            <p>Ensure your token is kept private. It will be mapped to your wallet address permanently for this session.</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>Submit & Continue</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Technical Metadata */}
        <p className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
          Verification Stage: Access Control
        </p>
      </motion.div>
    </div>
  );
}