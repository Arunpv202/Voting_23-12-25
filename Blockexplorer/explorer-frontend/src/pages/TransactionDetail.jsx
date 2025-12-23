import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { ethers } from "ethers";

export default function TransactionDetail() {
    const { hash } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/tx/${hash}`);
                setData(res.data);
            } catch (err) {
                setError("Transaction not found");
            }
        };
        load();
    }, [hash]);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0B0E11] text-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="glass-card p-10 rounded-2xl text-center text-red-400">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { tx, receipt } = data; // Backend returns { tx, receipt }
    // Backend receipt status: 1 = success, 0 = fail
    // But provider.getTransactionReceipt returns status as number usually.
    const status = receipt && receipt.status === 1;

    return (
        <div className="min-h-screen bg-[#0B0E11] text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="glass-card rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        Transaction Details
                    </h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Transaction Hash:</span>
                            <span className="md:col-span-3 font-mono text-break break-all">{tx.hash}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Status:</span>
                            <div className="md:col-span-3 flex items-center gap-2">
                                {status ? (
                                    <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm font-medium">
                                        <CheckCircle size={16} /> Success
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-sm font-medium">
                                        <XCircle size={16} /> Failed
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Block:</span>
                            <Link to={`/block/${receipt.blockNumber}`} className="md:col-span-3 text-blue-400 hover:text-blue-300">
                                {receipt.blockNumber}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">From:</span>
                            <Link to={`/address/${tx.from}`} className="md:col-span-3 text-blue-400 hover:text-blue-300 font-mono break-all">
                                {tx.from}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">To:</span>
                            <Link to={`/address/${tx.to}`} className="md:col-span-3 text-blue-400 hover:text-blue-300 font-mono break-all">
                                {tx.to}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Value:</span>
                            <span className="md:col-span-3">
                                {tx.value ? ethers.formatEther(tx.value) : "0"} ETH
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <span className="text-gray-400">Gas Used:</span>
                            <span className="md:col-span-3">
                                {receipt.gasUsed ? receipt.gasUsed.toString() : "0"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
