import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocialMediaFeed from "../components/SocialMediaFeed";
import NewsChannel from "../components/NewsChannel";
import DesktopInterface from "../components/voter_components/DesktopInterface";
import Logs from "../components/Logs";
import { useSimulationStore } from "../store";
import { useTickStore } from "../store/tickStore";

// Voter Political Standing Graph component
const VoterPoliticalLeaningGraph = () => {
  return (
    <div className="flex flex-col items-center mt-4 mb-4">
      <div className="relative w-[175px] h-[175px]">
        {/* Grid lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white opacity-30" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white opacity-30" />

        {/* Labels */}
        <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-white text-[12px] font-light roboto-mono">
          Authoritarian
        </span>
        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-white text-[12px] font-light roboto-mono">
          Libertarian
        </span>
        <span className="absolute top-1/2 -left-10 -translate-y-1/2 text-white text-[12px] font-light roboto-mono">
          Left
        </span>
        <span className="absolute top-1/2 -right-10 -translate-y-1/2 text-white text-[12px] font-light roboto-mono">
          Right
        </span>

        {/* Position indicator */}
        <div
          className="absolute w-4 h-4 bg-[#D25EA9] border-2 border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + 20}%`, // Sample value
            top: `${50 - 20}%`, // Sample value
          }}
        />
      </div>
    </div>
  );
};

// Surveillance Screen Component
const SurveillanceScreen = ({simId, currentTick, totalTicks}: {simId: string, currentTick: number, totalTicks: number}) => {
  const [currentView, setCurrentView] = useState<"desktop" | "social" | "news">("desktop");

  const handleSocialMediaClick = () => {
    setCurrentView("social");
  };

  const handleNewsClick = () => {
    setCurrentView("news");
  };

  const handleBackToDesktop = () => {
    setCurrentView("desktop");
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Laptop mockup container */}
      <div className="relative">
        {/* Replace 'laptop-mockup.png' with your actual laptop PNG file */}
        <img
          src="/images/monitor_mockup.png"
          alt="Laptop"
          className="w-full max-w-4xl object-cover"
        />

        {/* Screen overlay - positioned to match the laptop screen area with subtle CRT bulge effect */}
        <div
          className="absolute top-[8%] left-[8%] right-[8%] bottom-[32%] bg-white overflow-hidden"
          style={{
            borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
            transform: "perspective(80vw) rotateX(0.8deg)",
            transformOrigin: "center center",
          }}
        >
          {currentView === "desktop" ? (
            <DesktopInterface
              onSocialMediaClick={handleSocialMediaClick}
              onNewsClick={handleNewsClick}
            />
          ) : currentView === "social" ? (
            <SocialMediaFeed onClose={handleBackToDesktop} simId={simId!} currentTick={currentTick} totalTicks={totalTicks} />
          ) : (
            <NewsChannel onClose={handleBackToDesktop} simId={simId!} currentTick={currentTick} totalTicks={totalTicks} />
          )}
        </div>
      </div>
    </div>
  );
};

const VoterDetails = () => {

  const navigate = useNavigate();
  const {simId} = useParams();
  const { simulationId, setSimulationId, setCurrentTick } = useSimulationStore();
  const { currentTick, totalTicks } = useTickStore();
  
  // Set up demo simulation data if not already set
  useEffect(() => {
    if (!simulationId) {
      // Use a demo simulation ID for the voter details page
      setSimulationId('demo-simulation-voter-details');
      setCurrentTick(1);
      console.log('🎭 VoterDetails - Setting up demo simulation data');
    }
  }, [simulationId, setSimulationId, setCurrentTick]);

  // For demo purposes, using a simple back function
  const handleBack = () => {
    navigate(-1);
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
            <h1 className="text-[24px] font-medium text-white roboto-mono">VOTER DETAILS</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 py-6">
          <div className="flex">
            {/* Left column - Voter Profile */}
            <div className="w-1/4 rounded-sm mr-6">
              <div className="border border-white/10 rounded-sm">
                {/* Civilian status and name */}
                <div className="border-b bg-[#101528] border-white/10 pl-4 py-4">
                  <div className="text-white/60 text-sm uppercase mb-1 roboto-mono">CIVILIAN</div>
                  <div className="text-white text-2xl font-['ManifoldExtendedCF']">
                    JACK FLANNAGAN
                  </div>
                </div>

                {/* Voter image and details */}
                <div className="flex">
                  <div className="w-40 h-49 overflow-hidden">
                    {/* Using a placeholder since we don't have the actual image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/images/civilian_profile.png"
                        alt="Jack Flannagan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Age */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">AGE</div>
                      <div className="text-white text-xl roboto-mono">32</div>
                    </div>

                    {/* Occupation */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">OCCUPATION</div>
                      <div className="text-white text-xl roboto-mono">OCCUPATION</div>
                    </div>

                    {/* Type */}
                    <div className="py-4 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">TYPE</div>
                      <div className="text-white text-xl roboto-mono">INFLUENCER</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-2 roboto-mono">Description</h3>
                <p className="text-white/80 text-sm leading-relaxed roboto-mono">
                  Jack Flanagan is a quirky, soft-spoken oddball with a knack for fixing broken
                  gadgets using tape and blind optimism. He wears cargo shorts year-round, talks to
                  his plants like coworkers, and once tried to start a detective agency with a stray
                  cat.
                </p>
              </div>

              {/* Political Leaning */}
              <div className="mt-6">
                <h3 className="text-white text-xl pb-4 roboto-mono">Political Leaning</h3>
                <div className="border border-white/30 p-4">
                  <VoterPoliticalLeaningGraph />
                </div>
              </div>
            </div>

            {/* Center column - Laptop mockup with surveillance screen */}
            <div className="w-full flex justify-center items-center relative">
              <div className="absolute w-[100%] pr-5 top-0">
                {/* Surveillance screen content */}
                <SurveillanceScreen simId={simId!} currentTick={currentTick} totalTicks={totalTicks} />
              </div>
            </div>

            {/* Right column - Logs */}
            <div className="w-[45%]">
                <Logs />
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDetails;
