import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransactionDetail from "./pages/TransactionDetail";
import BlockDetail from "./pages/BlockDetail";
import AddressDetail from "./pages/AddressDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tx/:hash" element={<TransactionDetail />} />
        <Route path="/address/:addr" element={<AddressDetail />} />
        <Route path="/block/:number" element={<BlockDetail />} />
      </Routes>
    </Router>
  );
}
