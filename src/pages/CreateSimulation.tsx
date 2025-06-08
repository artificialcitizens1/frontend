import { useNavigate } from "react-router-dom";
import { useSimulationStore } from "../store";
import { useState, useRef, useEffect } from "react";
import "../styles/fonts.css";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { simulationName, setSimulationName, description, setDescription } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 800;

  const handleContinue = () => {
    if (!simulationName.trim()) {
      setError("Simulation name is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    // Log the simulation data
    console.log("Creating simulation:", { name: simulationName, description });
    
    // Navigate directly to candidate settings page
    navigate("/candidate-settings");
  };

  // Handle textarea auto-resize for description
  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = 42; // Corresponds to lineHeight: "42px"
      const maxLines = 6;
      const maxHeight = lineHeight * maxLines;

      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;

      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [description]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setDescription(text);
      if (error) setError(null);
    }
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
        {/* Name Input Section */}
        <div className="mb-16">
          <label htmlFor="simulationName" className="text-white text-sm text-[18px] mb-4 block text-center" style={{ fontFamily: "Roboto Mono" }}>
            Name your simulation
          </label>
          {/* Input Field */}
          <input
            type="text"
            value={simulationName}
            onChange={(e) => {
              setSimulationName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Name your simulation"
            autoFocus
            className="w-[961px] h-[80px] bg-transparent text-white text-center text-[40px] focus:outline-none placeholder:text-white/50 placeholder:text-[40px] placeholder:transition-opacity focus:placeholder:opacity-0"
            style={{
              fontFamily: "Roboto Mono",
              fontWeight: 200,
              lineHeight: "97px",
            }}
          />
        </div>

        {/* Description Input Section */}
        <div className="mb-16">
          <label htmlFor="simulationDescription" className="text-white text-sm text-[18px] mb-4 block text-center" style={{ fontFamily: "Roboto Mono" }}>
            What's it all about?
          </label>
          {/* Text Area Field */}
          <div className="relative w-[961px]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What's it all about?"
              className="w-[961px] bg-transparent text-white text-[28px] text-center focus:outline-none placeholder:text-white/50 placeholder:text-[28px] placeholder:transition-opacity focus:placeholder:opacity-0 resize-none"
              style={{
                fontFamily: "Roboto Mono",
                fontWeight: 200,
                lineHeight: "42px",
                scrollbarColor: "white rgba(255, 255, 255, 0.1)",
                overflowY: "hidden",
              }}
            />
            <div
              className="absolute bottom-[-30px] right-0 text-white/50 text-sm"
              style={{ fontFamily: "Roboto Mono" }}
            >
              {description.length}/{maxChars} characters
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 mt-2 mb-6">{error}</div>}

        {/* Continue Button */}
        <button
          className={`mt-8 w-[400px] h-[104px] bg-white hover:bg-white/90 transition-all ${
            !simulationName.trim() || !description.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleContinue}
          disabled={!simulationName.trim() || !description.trim()}
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
