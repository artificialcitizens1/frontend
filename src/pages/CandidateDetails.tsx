import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SocialMediaFeed from "../components/SocialMediaFeed";
import NewsChannel from "../components/NewsChannel";
import DesktopInterface from "../components/candidate_components/DesktopInterface";
import { useSimulationStore } from "../store";
import Logs from "../components/Logs";
import { useTickStore } from "../store/tickStore";
import { getPersonaDetails, type PersonaResponse } from "../api/personaService";

// Surveillance Screen Component
const SurveillanceScreen = ({simId, currentTick, totalTicks, opponentId}: {simId: string, currentTick: number, totalTicks: number, opponentId?: string}) => {
  const [currentView, setCurrentView] = useState<"desktop" | "social" | "news">("desktop");
  const navigate = useNavigate();

  const handleSocialMediaClick = () => {
    setCurrentView("social");
  };

  const handleNewsClick = () => {
    setCurrentView("news");
  };

  const handleTrashClick = () => {
    if (opponentId) {
      navigate(`/simulation/${simId}/candidate-details/${opponentId}`);
    } else {
      console.error("No opponent ID available for navigation");
    }
  };

  const handleBackToDesktop = () => {
    setCurrentView("desktop");
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Laptop mockup container */}
      <div className="relative w-full max-w-4xl">
        {/* Replace 'laptop-mockup.png' with your actual laptop PNG file */}
        <img
          src="/images/monitor_mockup.png"
          alt="Laptop"
          className="w-full h-auto object-contain"
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
              onTrashClick={handleTrashClick}
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

const CandidateDetails = () => {
  const navigate = useNavigate();
  const {simId, characterId} = useParams();
  const { simulationId, setSimulationId, setCurrentTick } = useSimulationStore();
  const { currentTick, totalTicks } = useTickStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personaData, setPersonaData] = useState<PersonaResponse["data"] | null>(null);

console.log('characterId:', characterId);
  
  // Set up demo simulation data if not already set
  useEffect(() => {
    if (!simulationId) {
      // Use a demo simulation ID for the candidate details page
      setSimulationId('demo-simulation-candidate-details');
      setCurrentTick(1);
      console.log('🎭 CandidateDetails - Setting up demo simulation data');
    }
  }, [simulationId, setSimulationId, setCurrentTick]);

  // Fetch persona details
  useEffect(() => {
    const fetchPersonaData = async () => {
      try {
        setIsLoading(true);
        setError(null);      
        console.log('🔍 CandidateDetails - Fetching persona data');
        const response = await getPersonaDetails(characterId!);
        
        if (response.success && response.data) {
          console.log('✅ CandidateDetails - Fetched persona data:', response.data);
          setPersonaData(response.data);
        } else {
          setError("Failed to load persona details");
        }
      } catch (err) {
        console.error('Error fetching persona details:', err);
        setError("Failed to load persona details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonaData();
  }, [characterId]);

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
            <h1 className="text-[24px] font-medium text-white roboto-mono">CANDIDATE DETAILS</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 py-6 h-[calc(100vh-60px)] overflow-hidden">
          <div className="flex h-full">
            {/* Left column - Candidate Profile */}
            <div className="w-1/5 rounded-sm mr-6 overflow-y-auto h-full scrollbar-hide">
              <div className="border border-white/10 rounded-sm">
                {/* Candidate status and name */}
                <div className="border-b bg-[#101528] border-white/10 pl-4 py-4">
                  <div className="text-white/60 text-sm uppercase mb-1 roboto-mono">
                    CANDIDATE|{personaData?.persona.ideologyPosition === 'center-left' ? 'BLUE PARTY' : 'RED PARTY'}
                  </div>
                  <div className="text-white text-2xl font-['ManifoldExtendedCF']">
                    {isLoading ? 'LOADING...' : error ? 'CANDIDATE DATA' : personaData?.persona.name || 'RAHUL SINGH'}
                  </div>
                </div>

                {/* Candidate image and details */}
                <div className="flex">
                  <div className="w-60 h-49 overflow-hidden">
                    {/* Using a placeholder since we don't have the actual image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/images/candidate_photo.png"
                        alt={personaData?.persona.name || "Candidate"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 w-[50%]">
                    {/* Ideology Position */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">IDEOLOGY</div>
                      <div className="text-white text-xl roboto-mono">
                        {isLoading ? 'LOADING...' : 
                         error ? 'UNKNOWN' : 
                         personaData?.persona.ideologyPosition.toUpperCase() || 'CENTER-LEFT'}
                      </div>
                    </div>

                    {/* Persona Type */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">PERSONA TYPE</div>
                      <div className="text-white text-xl roboto-mono">
                        {isLoading ? 'LOADING...' : 
                         error ? 'UNKNOWN' : 
                         personaData?.persona.personaType.toUpperCase() || 'CHARISMATIC'}
                      </div>
                    </div>

                    {/* Communication Style */}
                    <div className="py-4 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">
                        COMMUNICATION STYLE
                      </div>
                      <div className="text-white text-xl roboto-mono">
                        {isLoading ? 'LOADING...' : 
                         error ? 'UNKNOWN' : 
                         personaData?.persona.communicationStyle.toUpperCase() || 'EMPATHETIC'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-2 roboto-mono">Description</h3>
                <p className="text-white/80 text-sm leading-relaxed roboto-mono">
                  {isLoading ? 'Loading candidate description...' : 
                   error ? 'Failed to load candidate description.' : 
                   personaData?.persona.intro || 
                   'Once a railway clerk who fixed trains with duct tape and hope, Rahul shot to fame during the "Great Mango Subsidy Revolt," where he demanded two mangoes per citizen — and got them. Now he\'s running on a platform of "common sense and uncommon snacks." His fans call him The People\'s Patchwork. His critics call him unserious. Rahul just hands them a samosa and moves on.'}
                </p>
              </div>

              {/* Traits */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-4 roboto-mono">Traits</h3>

                {/* Authenticity */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Authenticity</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: `${((personaData?.persona.authenticityLevel || 7) / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>

                {/* Charisma */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Charisma</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: `${((personaData?.persona.charismaLevel || 8) / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>

                {/* Integrity */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Integrity</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: `${((personaData?.persona.integrityLevel || 6) / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center column - Surveillance Screen */}
            <div className="w-1/2 flex-grow h-[vh]">
              <SurveillanceScreen 
                simId={simId || 'demo-simulation'} 
                currentTick={currentTick} 
                totalTicks={totalTicks} 
                opponentId={personaData?.opponent?.personaId}
              />
            </div>

            {/* Right column - Logs */}
            <div className="w-1/5 flex flex-col gap-6 overflow-y-auto h-full scrollbar-hide">
              {/* Logs section */}
              <Logs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
