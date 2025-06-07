import { useNavigate } from "react-router-dom";
import { useSimulationStore } from "../store";
import { useState, useRef, useEffect } from "react";

const SimulationDescription = () => {
  const navigate = useNavigate();
  const { description, setDescription } = useSimulationStore();
  const maxChars = 800;
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setDescription(text);
      if (error) setError(null);
    }
  };

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

  const handleContinue = () => {
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    // Log the description using the store
    console.log("Description:", description);
    // Navigate to candidate settings
    navigate("/candidate-settings");
  };

  return (
    <div className="relative w-full h-screen bg-[#0A1929] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Top Grid */}
        <img
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30  origin-top"
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

        {error && <div className="text-red-500 mt-10">{error}</div>}

        {/* Continue Button */}
        <button
          className={`mt-16 w-[400px] h-[104px] bg-white hover:bg-white/90 transition-all ${
            !description.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleContinue}
          disabled={!description.trim()}
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

export default SimulationDescription;
