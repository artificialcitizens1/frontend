import { useNavigate } from "react-router-dom";
import { useSimulationStore } from "../store";
import { useState } from "react";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { simulationName, setSimulationName } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!simulationName.trim()) {
      setError("Simulation name is required");
      return;
    }

    // Log the simulation name using the store
    console.log("Creating simulation:", simulationName);
    // Navigate to description page
    navigate("/simulation-description");
  };

  return (
    <div className="relative w-full h-screen bg-[#0A1929] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Top Grid */}
        <img
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 origin-top"
        />
        {/* Bottom Grid */}
        <img
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 origin-bottom"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Input Field */}
        <input
          type="text"
          value={simulationName}
          onChange={(e) => {
            setSimulationName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Name your simulation"
          className="w-[961px] h-[97px] bg-transparent text-white text-center text-[80px] focus:outline-none placeholder:text-white/50 placeholder:text-[80px] placeholder:transition-opacity focus:placeholder:opacity-0"
          style={{
            fontFamily: "Inter Display",
            fontWeight: 200,
            lineHeight: "97px",
          }}
        />

        {error && <div className="text-red-500 mt-2">{error}</div>}

        {/* Continue Button */}
        <button
          className={`mt-16 w-[400px] h-[104px] bg-white hover:bg-white/90 transition-all ${
            !simulationName.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleContinue}
          disabled={!simulationName.trim()}
        >
          <span
            className="flex items-center justify-center h-full text-[28px] leading-[37px] text-black"
            style={{ fontFamily: "Roboto Mono" }}
          >
            Continue
          </span>
        </button>
      </div>
    </div>
  );
};

export default CreateSimulation;
