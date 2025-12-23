import { Box } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="border-b border-[#2B2F36] bg-[#0B0E11]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <Box className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Nexus Explorer
            </h1>
            <span className="text-xs text-gray-500 tracking-wider uppercase font-medium">
              Private Geth Network
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
