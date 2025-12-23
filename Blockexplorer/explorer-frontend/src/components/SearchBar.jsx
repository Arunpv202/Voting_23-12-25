import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function SearchBar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term) return;

    if (term.startsWith("0x")) {
      if (term.length === 66) {
        // It could be a Tx or a Block. Let's ask the backend if it's a block first.
        try {
          // Attempt to fetch block. If it returns data, it's a block.
          // Note context: backend /blocks/:hash returns valid block json or errors.
          const res = await api.get(`/blocks/${term}`);
          if (res.data && res.data.hash) {
            navigate(`/block/${term}`);
            return;
          }
        } catch (err) {
          // If 404/500, assume it's not a block, fall through to TX
        }
        // Default to transaction if not confirmed as a block
        navigate(`/tx/${term}`);

      } else if (term.length === 42) {
        navigate(`/address/${term}`);
      }
    } else if (!isNaN(term)) {
      navigate(`/block/${term}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-8 relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value.trim())}
        placeholder="Search by Block Number / Tx Hash / Address"
        className="
          w-full pl-11 pr-4 py-4 rounded-xl
          glass-input
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </form>
  );
}
