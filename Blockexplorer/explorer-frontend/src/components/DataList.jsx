import { Link } from "react-router-dom";
import { Box, FileText } from "lucide-react";

export default function DataList({ title, data, type }) {
    return (
        <div className="glass-card rounded-2xl p-6 min-h-[400px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                {type === "block" ? <Box className="text-blue-500" /> : <FileText className="text-purple-500" />}
                {title}
            </h3>

            <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-[#2B2F36] last:border-0">
                        {type === "block" ? (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400">Block</span>
                                    <Link to={`/block/${item.number}`} className="text-blue-400 hover:text-blue-300 font-mono">
                                        #{item.number}
                                    </Link>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-400">Txns</span>
                                    <span className="text-white font-medium">{item.txCount}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col max-w-[70%]">
                                    <span className="text-sm text-gray-400">TX Hash</span>
                                    <Link to={`/tx/${item.hash}`} className="text-purple-400 hover:text-purple-300 font-mono truncate">
                                        {item.hash}
                                    </Link>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-400">Block</span>
                                    <Link to={`/block/${item.blockNumber}`} className="text-blue-400 hover:text-blue-300 font-mono text-sm">
                                        #{item.blockNumber}
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No data available</div>
                )}
            </div>
        </div>
    );
}
