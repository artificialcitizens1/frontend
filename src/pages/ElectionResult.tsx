import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logs from "../components/Logs";
import { useSimulationStore } from "../store";
import { useTickStore } from "../store/tickStore";
import AnimatedText from "../components/AnimatedText";

const ElectionResult = () => {
  const navigate = useNavigate();
  const { simId } = useParams();
  const { simulationId, setSimulationId, setCurrentTick } = useSimulationStore();
  const { currentTick, totalTicks } = useTickStore();
  const [isPlaying, setIsPlaying] = useState(false);

  // Enhanced breaking news data
  const breakingNewsItems = [
    "Rahul Singh wins the election by huge margin",
    "Victory speech scheduled for 8 PM",
    "Supporters celebrate across the nation",
    "Opposition concedes defeat gracefully",
    "International leaders congratulate the winner",
    "Stock market reaches all-time high following results",
    "Peace talks scheduled with neighboring countries",
  ];

  // Set up demo simulation data if not already set
  useEffect(() => {
    if (!simulationId) {
      setSimulationId("demo-simulation-election-result");
      setCurrentTick(totalTicks); // Set to final tick for results
      console.log("🏆 ElectionResult - Setting up demo simulation data");
    }
  }, [simulationId, setSimulationId, setCurrentTick, totalTicks]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleHearSpeech = () => {
    setIsPlaying(!isPlaying);
    // Here you could implement actual audio playback
    console.log("Playing victory speech...");
  };

  const handleViewDetails = () => {
    navigate(`/simulation/${simId}/candidate-details`);
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Main Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black py-2 px-8">
          <div className="max-w-full mx-auto flex items-center gap-6">
            <button
              className="text-white hover:bg-white/5 rounded-2xl transition-colors flex items-center justify-center"
              onClick={handleBack}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-[24px] font-medium text-white roboto-mono">ELECTION RESULTS</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 py-6 h-[calc(100vh-60px)] overflow-hidden">
          <div className="flex h-full">
            {/* Left column - Winner Announcement */}
            <div className="w-2/3 flex flex-col items-center justify-center relative">
              {/* Winner Title */}
              <div className="text-center mb-8">
                <AnimatedText
                  className="text-[120px] font-bold text-white tracking-wider mb-4"
                  style={{ fontFamily: "Arcade Interlaced" }}
                  interval={5000}
                  glowEffect={true}
                >
                  WINNER!
                </AnimatedText>
              </div>

              {/* Winner Card */}
              <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-8 max-w-2xl w-full">
                <div className="flex items-center gap-6">
                  {/* Candidate Photo */}
                  <div className="flex-shrink-0">
                    <img
                      src="/images/candidate_photo.png"
                      alt="Rahul Singh"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-blue-400"
                    />
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-blue-300 text-sm uppercase mb-1 roboto-mono">
                          CANDIDATE|BLUE PARTY
                        </div>
                        <div className="text-white text-3xl font-['ManifoldExtendedCF']">
                          RAHUL SINGH
                        </div>
                      </div>
                    </div>

                    {/* Victory Message */}
                    <div className="mb-6">
                      <p className="text-white/90 text-lg roboto-mono italic mb-2">
                        "I WOULD LIKE TO THANK MY
                      </p>
                      <p className="text-white/90 text-lg roboto-mono italic">
                        FOLLOWERS, IT IS OUR WIN."
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors roboto-mono"
                        onClick={handleHearSpeech}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                        </svg>
                        {isPlaying ? "Stop Speech" : "Hear Speech"}
                      </button>

                      <button
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition-colors roboto-mono"
                        onClick={handleViewDetails}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Breaking News Ticker */}
              <div className="absolute bottom-0 left-0 right-0">
                {/* News background with gradient */}
                <div className="relative bg-gradient-to-r from-black to-gray-900 shadow-2xl border-t border-white/20">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

                  {/* Top border glow */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gray-400 via-white to-gray-400 animate-pulse"></div>

                  <div className="relative py-3 px-6 flex items-center">
                    {/* Breaking News Badge */}
                    <div className="flex-shrink-0 bg-white text-black px-4 py-2 font-bold mr-6 roboto-mono shadow-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                        <span className="text-sm">BREAKING NEWS</span>
                      </div>
                    </div>

                    {/* Enhanced scrolling content */}
                    <div className="flex-1 overflow-hidden">
                      <div className="whitespace-nowrap animate-enhanced-marquee text-white roboto-mono font-medium text-lg">
                        {breakingNewsItems.map((item, index) => (
                          <span key={index} className="inline-block mr-16">
                            <span className="text-yellow-300 mr-2">●</span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live indicator */}
                    <div className="flex-shrink-0 flex items-center gap-2 ml-6">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm roboto-mono font-bold">LIVE</span>
                    </div>
                  </div>

                  {/* Bottom shadow */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-800 to-black"></div>
                </div>
              </div>
            </div>

            {/* Right column - Logs */}
            <div className="w-1/3 flex flex-col gap-6 overflow-y-auto h-full scrollbar-hide border-l border-white/10 pl-6">
              <Logs />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for animations */}
      <style>{`
        @keyframes enhanced-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-enhanced-marquee {
          animation: enhanced-marquee 25s linear infinite;
        }
        
        .animate-enhanced-marquee:hover {
          animation-play-state: paused;
        }
        
        @keyframes breaking-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.8), 0 0 60px rgba(255, 0, 0, 0.3);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Text animation support */
        [style*="--anim"] {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          background-position: calc(var(--anim, 0) * 200% - 100%) 0;
          background-clip: text;
          -webkit-background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default ElectionResult;
