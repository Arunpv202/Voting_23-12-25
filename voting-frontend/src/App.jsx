import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import ConnectWallet from "./pages/ConnectWallet";
import BlockchainExplorer from "./pages/BlockchainExplorer.jsx";
/* ================= ADMIN ================= */
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateElection from "./pages/Admin/CreateElection";
import RegisterUsers from "./pages/Admin/RegisterUsers";
import ElectionSetup from "./pages/Admin/ElectionSetup";
import ViewElections from "./pages/Admin/ViewElections";

/* ================= USER ================= */
import UserDashboard from "./pages/User/UserDashboard";
import RegisterElection from "./pages/User/RegisterElection";
import ExistingElections from "./pages/User/ExistingElections";
import EnterElection from "./pages/User/EnterElection";
import FaceVerification from "./pages/User/FaceVerification";
import VotePage from "./pages/User/VotePage";
import ParticipatedElections from "./pages/User/ParticipatedElections";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- Public -------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />

        {/* -------- Admin -------- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-election" element={<CreateElection />} />
        <Route path="/admin/register-users" element={<RegisterUsers />} />
        <Route path="/admin/election-setup" element={<ElectionSetup />} />
        <Route path="/admin/view-elections" element={<ViewElections />} />
        <Route path="/admin/blockchain-explorer/:electionId" element={<BlockchainExplorer />} />

        {/* -------- User -------- */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/register-election" element={<RegisterElection />} />
        <Route path="/user/existing-elections" element={<ExistingElections />} />
        <Route path="/user/enter-election" element={<EnterElection />} />
        <Route path="/user/face-verification" element={<FaceVerification />} />
        <Route path="/user/vote" element={<VotePage />} />
        <Route path="/user/participated" element={<ParticipatedElections />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
