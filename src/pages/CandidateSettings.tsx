import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Candidate, CommunicationStyle, MediaInteractions } from "../types/candidate";
import { ParameterSlider } from "../components/candidate/ParameterSlider";
import { PoliticalStandingGraph } from "../components/candidate/PoliticalStandingGraph";
import { calculatePoliticalStanding } from "../utils/politicalCalculator";
import { useSimulationStore } from "../store";

const defaultCandidate: Candidate = {
  id: "1",
  name: "",
  description: "",
  avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=1",
  parameters: {
    communicationStyle: "Calm",
    mediaInteractions: "Few",
    charisma: 0.5,
    temper: 0.5,
    integrity: 0.5,
    authenticity: 0.5,
  },
  politicalStanding: { x: 0, y: 0 },
};

const CandidateSettings = () => {
  const [candidates, setCandidates] = useState<[Candidate, Candidate]>([
    { ...defaultCandidate, id: "1" },
    { ...defaultCandidate, id: "2", avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=2" },
  ]);
  const navigate = useNavigate();
  const { setCandidates: setStoreCandidates, getAllData } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);

  // Update store with candidates whenever they change
  useEffect(() => {
    setStoreCandidates(candidates);
  }, [candidates, setStoreCandidates]);

  // Set overflow-x: hidden on document.body to prevent horizontal scroll
  useEffect(() => {
    // Save original style
    const originalStyle = document.body.style.overflowX;
    
    // Set overflow-x hidden
    document.body.style.overflowX = 'hidden';
    
    // Clean up function to restore original style
    return () => {
      document.body.style.overflowX = originalStyle;
    };
  }, []);

  const updateCandidate = (index: 0 | 1, updates: Partial<Candidate>) => {
    setCandidates((prev) => {
      const newCandidates = [...prev] as [Candidate, Candidate];
      const currentCandidate = newCandidates[index];

      // Create the updated candidate
      const updatedCandidate = { ...currentCandidate, ...updates };

      // If parameters were updated, recalculate political standing
      if (updates.parameters) {
        updatedCandidate.politicalStanding = calculatePoliticalStanding(
          updatedCandidate.parameters
        );
      }

      newCandidates[index] = updatedCandidate;

      // Clear error when fields are updated
      setError(null);

      return newCandidates;
    });
  };

  const handleStyleSelect = (index: 0 | 1, style: CommunicationStyle) => {
    updateCandidate(index, {
      parameters: { ...candidates[index].parameters, communicationStyle: style },
    });
  };

  const handleMediaSelect = (index: 0 | 1, media: MediaInteractions) => {
    updateCandidate(index, {
      parameters: { ...candidates[index].parameters, mediaInteractions: media },
    });
  };

  const validateCandidates = () => {
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (!candidate.name.trim()) {
        setError(`Candidate ${i + 1} name is required`);
        return false;
      }
      if (!candidate.description.trim()) {
        setError(`Candidate ${i + 1} description is required`);
        return false;
      }
    }
    return true;
  };

  // Check if both candidates have filled required fields
  const isFormValid = () => {
    return candidates.every(
      (candidate) => candidate.name.trim() !== "" && candidate.description.trim() !== ""
    );
  };

  const handleContinue = () => {
    if (!validateCandidates()) {
      return;
    }

    // Get all form data from store and console.log it
    const allData = getAllData();
    console.log("Form Data:", allData);
    navigate("/simulation-settings");
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#131B39] to-[#0F1322]">
        <img
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 origin-top"
        />
        <img
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 origin-bottom"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-br from-[#131B39] to-[#0F1322] py-6 px-8">
          <div className="max-w-[1728px] mx-auto flex justify-between items-start">
            <div className="flex items-center gap-6">
              <button
                className="w-32 h-32 text-white text-6xl hover:bg-white/5 rounded-2xl transition-colors flex items-center justify-center"
                onClick={() => navigate(-1)}
              >
                <svg
                  width="48"
                  height="48"
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
              <div>
                
                <h1 className="text-2xl sm:text-[56px] font-medium font-['Inter Display'] text-white mb-[20px]">
                  Candidate Settings
                </h1>
                <p className="text-white/80 text-xs sm:text-base font-light">
                  Select 2 candidate avatars and set their settings and their political standings
                </p>
              </div>
            </div>
            {error && <div className="text-red-500 mr-4 self-center">{error}</div>}
            <button
              className={`px-[88px] py-5 bg-white transition-colors text-black text-2xl font-['Roboto Mono'] ${
                !isFormValid() ? "opacity-50 cursor-not-allowed" : "hover:bg-white/90"
              }`}
              onClick={handleContinue}
              disabled={!isFormValid()}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 py-10 overflow-hidden">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-14 relative">
            {candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="flex-1 bg-black/10 border border-white/20 backdrop-blur-lg rounded-sm"
              >
                {/* Avatar Section */}
                <div className="p-6">
                  <span className="text-[#EF69B6] text-sm font-['Roboto Mono'] uppercase">
                    Select Avatars
                  </span>
                  <div className="mt-8 flex flex-col items-center">
                    <img
                      src={candidate.avatarUrl}
                      alt="Avatar"
                      className="w-[166px] h-[166px] rounded-full bg-white/10"
                    />
                    <div className="mt-6 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Candidate name</span>
                        <button className="text-white">✨</button>
                      </div>
                      <input
                        type="text"
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index as 0 | 1, { name: e.target.value })}
                        className="w-full mt-2 bg-transparent border-b border-white/40 text-white pb-2"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="mt-6 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Describe this candidate</span>
                        <button className="text-white">✨</button>
                      </div>
                      <input
                        type="text"
                        value={candidate.description}
                        onChange={(e) =>
                          updateCandidate(index as 0 | 1, { description: e.target.value })
                        }
                        className="w-full mt-2 bg-transparent border-b border-white/40 text-white pb-2"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                </div>

                {/* Parameters Section */}
                <div className="p-6 border-t border-white/20">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-white font-medium text-xl">
                      Set Parameters for this candidate
                    </h3>
                    <button className="text-[#EF69B6] font-medium text-xl">View Routine</button>
                  </div>

                  {/* Communication Style */}
                  <div className="mb-6">
                    <span className="text-white/80 text-sm">Communication Style</span>
                    <div className="flex gap-1 mt-2">
                      {(["Aggressive", "Calm", "Trendy"] as const).map((style) => (
                        <button
                          key={style}
                          className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                            candidate.parameters.communicationStyle === style
                              ? "border-white text-white"
                              : "border-white/30 text-white/60"
                          }`}
                          onClick={() => handleStyleSelect(index as 0 | 1, style)}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Media Interactions */}
                  <div className="mb-6">
                    <span className="text-white/80 text-sm">Media Interactions</span>
                    <div className="flex gap-1 mt-2">
                      {(["None", "Few", "Many"] as const).map((media) => (
                        <button
                          key={media}
                          className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                            candidate.parameters.mediaInteractions === media
                              ? "border-white text-white"
                              : "border-white/30 text-white/60"
                          }`}
                          onClick={() => handleMediaSelect(index as 0 | 1, media)}
                        >
                          {media}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-6">
                    <ParameterSlider
                      label="Charisma"
                      value={candidate.parameters.charisma}
                      onChange={(value) =>
                        updateCandidate(index as 0 | 1, {
                          parameters: { ...candidate.parameters, charisma: value },
                        })
                      }
                    />
                    <ParameterSlider
                      label="Temper"
                      value={candidate.parameters.temper}
                      onChange={(value) =>
                        updateCandidate(index as 0 | 1, {
                          parameters: { ...candidate.parameters, temper: value },
                        })
                      }
                    />
                    <ParameterSlider
                      label="Integrity"
                      value={candidate.parameters.integrity}
                      onChange={(value) =>
                        updateCandidate(index as 0 | 1, {
                          parameters: { ...candidate.parameters, integrity: value },
                        })
                      }
                    />
                    <ParameterSlider
                      label="Authenticity"
                      value={candidate.parameters.authenticity}
                      onChange={(value) =>
                        updateCandidate(index as 0 | 1, {
                          parameters: { ...candidate.parameters, authenticity: value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Political Standing Section */}
                <div className="p-8 border-t border-white/20">
                  <PoliticalStandingGraph
                    value={candidate.politicalStanding}
                    onChange={(value) =>
                      updateCandidate(index as 0 | 1, { politicalStanding: value })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* VS Text */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <span className="text-white/40 text-2xl font-['Roboto Mono']">VS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSettings;
