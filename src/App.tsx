/* package imports */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSocket } from "./hooks/useSocket";

/* styles import */
import "./styles/fonts.css";

/* page/component imports */
import Welcome from "./pages/Welcome";
import CreateSimulation from "./pages/CreateSimulation";
import SimulationDescription from "./pages/SimulationDescription";
import CandidateSettings from "./pages/CandidateSettings";
import { SimulationSettingsPage } from "./pages/SimulationSettings";
import { SimulationLoading } from "./pages/SimulationLoading";
import { SimulationResult } from "./pages/SimulationResult";
import VoterDetails from "./pages/VoterDetails";
import GodMode from "./pages/GodMode";
import SimulationCreation from "./pages/SimulationCreation";
import SimulationLore from "./pages/SimulationLore";

const App: React.FC = () => {
  const { isConnected, currentTick } = useSocket();

  console.log('Socket connection status:', isConnected);
  console.log('Current tick data:', currentTick);

  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="/simulation-description" element={<SimulationDescription />} />
        <Route path="/candidate-settings" element={<CandidateSettings />} />
        <Route path="/simulation-settings" element={<SimulationSettingsPage />} />
        <Route path="/simulation-loading" element={<SimulationLoading />} />
        <Route path="/simulation-creation" element={<SimulationCreation />} />
        <Route path="/simulation-lore/:simId" element={<SimulationLore />} />
        <Route path="/simulation/:simId" element={<SimulationResult />} />
        {/* <Route path="/simulation-result" element={<SimulationResult />} /> */}
        <Route path="/god-mode" element={<GodMode />} />
        <Route path="/voter-details" element={<VoterDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
