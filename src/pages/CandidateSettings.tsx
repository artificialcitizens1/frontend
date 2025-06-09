import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Candidate, CommunicationStyle, MediaInteractions } from '../types/candidate';
import { ParameterSlider } from '../components/candidate/ParameterSlider';
import { PoliticalStandingGraph } from '../components/candidate/PoliticalStandingGraph';
import { calculatePoliticalStanding } from '../utils/politicalCalculator';
import { useSimulationStore } from '../store';
import '../styles/fonts.css'; // Import fonts for consistency

// Import common components
import PageLayout from "../components/layout/PageLayout";
import Toolbar from "../components/layout/Toolbar";
import Button from "../components/layout/Button";

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

// Modify the getRandomizedCandidate function to accept existing candidate data
const getRandomizedCandidate = (existingCandidate: Candidate): Candidate => {
  // Communication styles
  const communicationStyles: CommunicationStyle[] = ["Aggressive", "Calm", "Trendy"];
  const randomCommunicationStyle = communicationStyles[Math.floor(Math.random() * communicationStyles.length)];
  
  // Media interactions
  const mediaInteractions: MediaInteractions[] = ["None", "Few", "Many"];
  const randomMediaInteraction = mediaInteractions[Math.floor(Math.random() * mediaInteractions.length)];
  
  // Random float between min and max
  const randomFloat = (min: number, max: number) => Math.min(max, Math.max(min, Math.random()));
  
  // Create random parameters
  const parameters = {
    communicationStyle: randomCommunicationStyle,
    mediaInteractions: randomMediaInteraction,
    charisma: randomFloat(0.2, 0.9),
    temper: randomFloat(0.2, 0.9),
    integrity: randomFloat(0.2, 0.9),
    authenticity: randomFloat(0.2, 0.9),
  };
  
  // Calculate political standing based on parameters
  const politicalStanding = calculatePoliticalStanding(parameters);
  
  return {
    ...existingCandidate,
    avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${existingCandidate.id}-${Math.random().toString(36).substring(2, 8)}`,
    parameters,
    politicalStanding,
  };
};

const CandidateSettings = () => {
  const [candidates, setCandidates] = useState<[Candidate, Candidate]>([
    { ...defaultCandidate, id: "1" },
    { ...defaultCandidate, id: "2", avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=2" },
  ]);
  const navigate = useNavigate();
  const { 
    setCandidates: setStoreCandidates, 
    simulationName, 
    description,
    getAllData 
  } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleContinue = async () => {
    if (!validateCandidates()) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);

    // Get all form data from store and console.log it
    const allData = getAllData();
    console.log('Form Data:', allData);
    
    // Verify we have name and description from store
    if (!simulationName && !description) {
      console.warn('Simulation name or description missing. Using defaults.');
    }
    
    // Navigate to simulation creation page
    navigate('/simulation-creation');
  };

  // Update the randomizeCharacteristics function
  const randomizeCharacteristics = () => {
    setCandidates(prevCandidates => {
      return [
        getRandomizedCandidate(prevCandidates[0]),
        getRandomizedCandidate(prevCandidates[1])
      ] as [Candidate, Candidate];
    });
  };

  // Toolbar actions
  const toolbarActions = (
    <>
      {error && <div className="text-red-500 mr-4 self-center">{error}</div>}
      <Button
        variant="secondary"
        onClick={randomizeCharacteristics}
        className="px-4 py-3"
      >
        Randomize
        <br>
        </br>
        Characteristics
      </Button>
      <div className="mr-4" />
      <Button
        onClick={handleContinue}
        disabled={!isFormValid()}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </>
  );

  return (
    <PageLayout>
      <Toolbar 
        title="Candidate Settings" 
        subtitle="Select 2 candidate and set their settings and their political standings"
        actions={toolbarActions}
      />

      {/* Content */}
      <div className="w-full px-4 py-10 overflow-hidden relative flex justify-center">
        {/* Main Content - Much wider boxes with significant spacing */}
        <div className="flex flex-row justify-between relative w-full max-w-[1600px]">
          <div className="w-[45%] bg-black/70 border border-white/30 backdrop-blur-lg rounded-sm p-6">
            {/* Left Candidate */}
            <div className="flex flex-col items-center">
              <img
                src={candidates[0].avatarUrl}
                alt="Avatar"
                className="w-[166px] h-[166px] rounded-full bg-white/10"
              />
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Candidate name</span>
                </div>
                <input
                  type="text"
                  value={candidates[0].name}
                  onChange={(e) => updateCandidate(0, { name: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-white/60 text-white pb-2 focus:border-white transition-colors"
                  style={{ fontFamily: "Roboto Mono" }}
                  placeholder="Enter name"
                />
              </div>
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Describe this candidate</span>
                </div>
                <input
                  type="text"
                  value={candidates[0].description}
                  onChange={(e) => updateCandidate(0, { description: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-white/60 text-white pb-2 focus:border-white transition-colors"
                  style={{ fontFamily: "Roboto Mono" }}
                  placeholder="Enter description"
                />
              </div>

              {/* Parameters Section */}
              <div className="mt-8 w-full">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-xl" style={{ fontFamily: "Roboto Mono" }}>
                    Set Parameters for this candidate
                  </h3>
                </div>

                {/* Communication Style */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Communication Style</span>
                  <div className="flex gap-1 mt-2">
                    {(["Aggressive", "Calm", "Trendy"] as const).map((style) => (
                      <button
                        key={style}
                        className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                          candidates[0].parameters.communicationStyle === style
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                        style={{ fontFamily: "Roboto Mono" }}
                        onClick={() => handleStyleSelect(0, style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Interactions */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Media Interactions</span>
                  <div className="flex gap-1 mt-2">
                    {(["None", "Few", "Many"] as const).map((media) => (
                      <button
                        key={media}
                        className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                          candidates[0].parameters.mediaInteractions === media
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                        style={{ fontFamily: "Roboto Mono" }}
                        onClick={() => handleMediaSelect(0, media)}
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
                    value={candidates[0].parameters.charisma}
                    onChange={(value) =>
                      updateCandidate(0, {
                        parameters: { ...candidates[0].parameters, charisma: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Temper"
                    value={candidates[0].parameters.temper}
                    onChange={(value) =>
                      updateCandidate(0, {
                        parameters: { ...candidates[0].parameters, temper: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Integrity"
                    value={candidates[0].parameters.integrity}
                    onChange={(value) =>
                      updateCandidate(0, {
                        parameters: { ...candidates[0].parameters, integrity: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Authenticity"
                    value={candidates[0].parameters.authenticity}
                    onChange={(value) =>
                      updateCandidate(0, {
                        parameters: { ...candidates[0].parameters, authenticity: value },
                      })
                    }
                  />
                </div>
              </div>

              {/* Political Standing Section */}
              <div className="mt-8 w-full">
                <PoliticalStandingGraph
                  value={candidates[0].politicalStanding}
                  onChange={(value) =>
                    updateCandidate(0, { politicalStanding: value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Center Gap with VS Text */}
          <div className="w-[10%] flex items-start justify-center pt-[120px]">
            <span className="text-white/40 text-[32px] font-light" style={{ fontFamily: "Roboto Mono" }}>VS</span>
          </div>

          <div className="w-[45%] bg-black/70 border border-white/30 backdrop-blur-lg rounded-sm p-6">
            {/* Right Candidate */}
            <div className="flex flex-col items-center">
              <img
                src={candidates[1].avatarUrl}
                alt="Avatar"
                className="w-[166px] h-[166px] rounded-full bg-white/10"
              />
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Candidate name</span>
                </div>
                <input
                  type="text"
                  value={candidates[1].name}
                  onChange={(e) => updateCandidate(1, { name: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-white/60 text-white pb-2 focus:border-white transition-colors"
                  style={{ fontFamily: "Roboto Mono" }}
                  placeholder="Enter name"
                />
              </div>
              <div className="mt-6 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Describe this candidate</span>
                </div>
                <input
                  type="text"
                  value={candidates[1].description}
                  onChange={(e) => updateCandidate(1, { description: e.target.value })}
                  className="w-full mt-2 bg-transparent border-b border-white/60 text-white pb-2 focus:border-white transition-colors"
                  style={{ fontFamily: "Roboto Mono" }}
                  placeholder="Enter description"
                />
              </div>

              {/* Parameters Section */}
              <div className="mt-8 w-full">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-xl" style={{ fontFamily: "Roboto Mono" }}>
                    Set Parameters for this candidate
                  </h3>
                </div>

                {/* Communication Style */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Communication Style</span>
                  <div className="flex gap-1 mt-2">
                    {(["Aggressive", "Calm", "Trendy"] as const).map((style) => (
                      <button
                        key={style}
                        className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                          candidates[1].parameters.communicationStyle === style
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                        style={{ fontFamily: "Roboto Mono" }}
                        onClick={() => handleStyleSelect(1, style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Interactions */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm" style={{ fontFamily: "Roboto Mono" }}>Media Interactions</span>
                  <div className="flex gap-1 mt-2">
                    {(["None", "Few", "Many"] as const).map((media) => (
                      <button
                        key={media}
                        className={`flex-1 py-1 px-3 text-sm border rounded-lg ${
                          candidates[1].parameters.mediaInteractions === media
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                        style={{ fontFamily: "Roboto Mono" }}
                        onClick={() => handleMediaSelect(1, media)}
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
                    value={candidates[1].parameters.charisma}
                    onChange={(value) =>
                      updateCandidate(1, {
                        parameters: { ...candidates[1].parameters, charisma: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Temper"
                    value={candidates[1].parameters.temper}
                    onChange={(value) =>
                      updateCandidate(1, {
                        parameters: { ...candidates[1].parameters, temper: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Integrity"
                    value={candidates[1].parameters.integrity}
                    onChange={(value) =>
                      updateCandidate(1, {
                        parameters: { ...candidates[1].parameters, integrity: value },
                      })
                    }
                  />
                  <ParameterSlider
                    label="Authenticity"
                    value={candidates[1].parameters.authenticity}
                    onChange={(value) =>
                      updateCandidate(1, {
                        parameters: { ...candidates[1].parameters, authenticity: value },
                      })
                    }
                  />
                </div>
              </div>

              {/* Political Standing Section */}
              <div className="mt-8 w-full">
                <PoliticalStandingGraph
                  value={candidates[1].politicalStanding}
                  onChange={(value) =>
                    updateCandidate(1, { politicalStanding: value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidateSettings;
