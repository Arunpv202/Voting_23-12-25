import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { ArrowLeft, Box } from "lucide-react";

export default function BlockDetail() {
    const { number } = useParams();
    const [block, setBlock] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/blocks/${number}`);
                if (!res.data) {
                    setError("Block not found");
                    return;
                }
                setBlock(res.data);
            } catch (err) {
                setError("Error fetching block");
            }
        };
        load();
    }, [number]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0B0E11] text-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="glass-card p-10 rounded-2xl text-center text-red-500 font-semibold text-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!block) {
        return (
            <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
                <div className="animate-pulse text-blue-500 text-xl font-medium">Loading Block Details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0E11] text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="glass-card rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Box className="text-blue-500" /> Block #{block.number}
                    </h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Block Height:</span>
                            <span className="md:col-span-3 font-medium">{block.number}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Timestamp:</span>
                            <span className="md:col-span-3 text-gray-300">
                                {new Date(block.timestamp * 1000).toLocaleString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Transactions:</span>
                            <span className="md:col-span-3 text-blue-400">
                                {block.transactions ? block.transactions.length : 0} transactions
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Hash:</span>
                            <span className="md:col-span-3 font-mono break-all text-gray-300">{block.hash}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Parent Hash:</span>
                            <Link to={`/block/${block.parentHash}`} className="md:col-span-3 font-mono break-all text-blue-400 hover:text-blue-300">
                                {block.parentHash}
                            </Link>
                        </div>



                        <div className="pt-4">
                            <h3 className="text-lg font-semibold mb-4">Transactions</h3>
                            <div className="space-y-2">
                                {block.transactions && block.transactions.length > 0 ? (
                                    block.transactions.map((tx, i) => (
                                        <div key={i} className="p-3 rounded bg-white/5 border border-[#2B2F36] flex items-center justify-between">
                                            <Link to={`/tx/${typeof tx === 'string' ? tx : tx.hash}`} className="text-blue-400 hover:text-blue-300 font-mono truncate">
                                                {typeof tx === 'string' ? tx : tx.hash}
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-500">No transactions in this block.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
