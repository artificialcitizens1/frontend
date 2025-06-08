/* package imports */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';

/* styles import */
import "./styles/fonts.css";

/* page/component imports */
import Welcome from "./pages/Welcome";
import CreateSimulation from "./pages/CreateSimulation";
import CandidateSettings from "./pages/CandidateSettings";
import { SimulationSettingsPage } from "./pages/SimulationSettings";
import { SimulationResult } from "./pages/SimulationResult";
import VoterDetails from "./pages/VoterDetails";
import GodMode from "./pages/GodMode";
import SimulationCreation from "./pages/SimulationCreation";
import SimulationLore from "./pages/SimulationLore";
import ElectionResults from "./pages/ElectionResults";

const App: React.FC = () => {

  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="/candidate-settings" element={<CandidateSettings />} />
        <Route path="/simulation-settings" element={<SimulationSettingsPage />} />
        <Route path="/simulation-result" element={<SimulationResult />} />
        <Route path="/voter-details" element={<VoterDetails />} />
        <Route path="/god-mode" element={<GodMode />} />
        <Route path="/simulation-creation" element={<SimulationCreation />} />
        <Route path="/simulation-lore/:simId" element={<SimulationLore />} />
        <Route path="/simulation/:simId" element={<SimulationResult />} />
        <Route path="/election-results/:simId" element={<ElectionResults />} />
      </Routes>
    </Router>
  );
};

export default App;
