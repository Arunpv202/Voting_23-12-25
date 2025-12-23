import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { ArrowLeft, Wallet } from "lucide-react";

export default function AddressDetail() {
    const { addr } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/address/${addr}`);
                setData(res.data);
            } catch (err) {
                setError("Address not found");
            }
        };
        load();
    }, [addr]);

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

    return (
        <div className="min-h-screen bg-[#0B0E11] text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="glass-card rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Wallet className="text-purple-500" /> Address Details
                    </h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-[#2B2F36]">
                            <span className="text-gray-400">Address:</span>
                            <span className="md:col-span-3 font-mono break-all">{data.address}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <span className="text-gray-400">Balance:</span>
                            <span className="md:col-span-3 text-2xl font-semibold text-green-400">
                                {data.balance} ETH
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
