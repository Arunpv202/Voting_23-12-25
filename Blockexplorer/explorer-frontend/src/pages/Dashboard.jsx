import { useEffect, useState } from "react";
import { api } from "../api.js";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import DataList from "../components/DataList";

export default function Dashboard() {
  const [net, setNet] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [netRes, blocksRes] = await Promise.all([
          api.get("/network"),
          api.get("/blocks")
        ]);

        setNet(netRes.data);
        setBlocks(blocksRes.data);

        // Extract transactions from blocks for the feed
        const recentTxs = [];
        for (const block of blocksRes.data) {
          if (block.transactions && block.transactions.length > 0) {
            // If backend returns full objects or strings, handle accordingly.
            // Assuming backend now returns list of hashes.
            // We map them to object for display.
            block.transactions.forEach(txHash => {
              recentTxs.push({
                hash: typeof txHash === 'string' ? txHash : txHash.hash,
                blockNumber: block.number
              });
            });
          }
        }
        // Take latest 10
        setTxs(recentTxs.slice(0, 10));

      } catch (err) {
        console.error(err);
        setError("Backend not reachable");
      }
    };

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!net) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center text-blue-500 animate-pulse">
        Initializing Nexus Explorer...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Ethereum Block Explorer
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time visualizer for your private Clique PoA chain
          </p>
        </div>

        <SearchBar />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 mb-12">
          <StatCard title="Chain ID" value={net.chainId} />
          <StatCard title="Latest Block" value={net.blockNumber} />
          <StatCard title="Network" value={net.name} />
          <StatCard title="Consensus" value="Clique PoA" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataList title="Latest Blocks" data={blocks} type="block" />
          <DataList title="Latest Transactions" data={txs} type="tx" />
        </div>
      </div>
    </div>
  );
}