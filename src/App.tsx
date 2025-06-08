/* package imports */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { socket } from './socket';

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
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('connected to socket server');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('disconnected from socket server');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

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
        <Route path="/simulation-result" element={<SimulationResult />} />
        <Route path="/voter-details" element={<VoterDetails />} />
        <Route path="/god-mode" element={<GodMode />} />
        <Route path="/simulation-creation" element={<SimulationCreation />} />
        <Route path="/simulation-lore/:simId" element={<SimulationLore />} />
        <Route path="/simulation/:simId" element={<SimulationResult />} />
      </Routes>
    </Router>
  );
};

export default App;
