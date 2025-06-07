/* package imports */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

// Example page components
const About = () => (
  <div className="p-8">
    <h1 className="text-4xl font-bold">About Us</h1>
    <p className="text-lg">Learn more about our mission and team.</p>
  </div>
);

const Contact = () => (
  <div className="p-8">
    <h1 className="text-4xl font-bold">Contact Us</h1>
    <p className="text-lg">Get in touch with our team.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/create-simulation" element={<CreateSimulation />} />
        <Route path="/simulation-description" element={<SimulationDescription />} />
        <Route path="/candidate-settings" element={<CandidateSettings />} />
        <Route path="/simulation-settings" element={<SimulationSettingsPage />} />
        <Route path="/simulation-loading" element={<SimulationLoading />} />
        <Route path="/simulation-result" element={<SimulationResult />} />
      </Routes>
    </Router>
  );
};

export default App;
