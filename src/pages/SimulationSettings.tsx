import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SimulationSettings,
  ElectionTopic,
  Duration,
  Speed,
  MediaOutlet,
} from "../types/simulation";
import { PoliticalStandingGraph } from "../components/simulation/PoliticalStandingGraph";
import { useSimulationStore } from "../store/simulationStore";

const defaultMediaOutlets: MediaOutlet[] = [
  { name: "NNC", bias: "Left Leaning", isSelected: true },
  { name: "CCB", bias: "Left Leaning", isSelected: true },
  { name: "Simpolis Today", bias: "Right Leaning", isSelected: true },
  { name: "Simpolis TV", bias: "Right Leaning", isSelected: true },
  { name: "Simpolis Media", bias: "Right Leaning", isSelected: true },
];

const defaultSettings: SimulationSettings = {
  electionSettings: {
    topics: ["Water", "Cows", "Development", "Unemployment", "Mandir", "City Names"],
    religiosity: 0.3,
    chaosLevel: 0.4,
    simulationType: 0.2,
  },
  timeSettings: {
    duration: "1 Day",
    speed: 1,
  },
  mediaSettings: {
    outlets: defaultMediaOutlets,
  },
  majoritySentiment: {
    x: 0,
    y: 0,
  },
};

export const SimulationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSimulationSettings, getAllData } = useSimulationStore();

  const handleAddTopic = () => {
    setShowTopicModal(true);
  };

  const handleTopicSubmit = () => {
    if (newTopic.trim()) {
      setSettings((prev) => ({
        ...prev,
        electionSettings: {
          ...prev.electionSettings,
          topics: [...prev.electionSettings.topics, newTopic.trim()],
        },
      }));
      setNewTopic("");
      setShowTopicModal(false);
      setError(null);
    }
  };

  const handleTopicClick = (topic: ElectionTopic) => {
    setSettings((prev) => ({
      ...prev,
      electionSettings: {
        ...prev.electionSettings,
        topics: prev.electionSettings.topics.filter((t) => t !== topic),
      },
    }));
  };

  const handleDurationSelect = (duration: Duration) => {
    setSettings((prev) => ({
      ...prev,
      timeSettings: { ...prev.timeSettings, duration },
    }));
  };

  const handleSpeedSelect = (speed: Speed) => {
    setSettings((prev) => ({
      ...prev,
      timeSettings: { ...prev.timeSettings, speed },
    }));
  };

  const calculatePoliticalStanding = (
    electionSettings: SimulationSettings["electionSettings"],
    mediaOutlets: MediaOutlet[]
  ) => {
    // Calculate media influence (-1 to 1)
    const leftLeaningCount = mediaOutlets.filter(
      (outlet) => outlet.isSelected && outlet.bias === "Left Leaning"
    ).length;
    const rightLeaningCount = mediaOutlets.filter(
      (outlet) => outlet.isSelected && outlet.bias === "Right Leaning"
    ).length;
    const mediaInfluence = (rightLeaningCount - leftLeaningCount) / 5;

    // Calculate x-axis (Left-Right) position
    // Media bias and simulation type influence left-right position
    const xPosition =
      mediaInfluence * 0.4 + // 40% influence from media
      (electionSettings.simulationType - 0.5) * 0.3; // 30% influence from simulation type

    // Calculate y-axis (Authoritarian-Libertarian) position
    // Religiosity and chaos level influence authoritarian-libertarian position
    const yPosition =
      electionSettings.religiosity * 0.4 + // 40% influence from religiosity
      electionSettings.chaosLevel * -0.4; // 40% negative influence from chaos

    return {
      x: Math.max(-1, Math.min(1, xPosition)),
      y: Math.max(-1, Math.min(1, yPosition)),
    };
  };

  const handleMediaToggle = (name: string) => {
    setSettings((prev) => {
      const updatedOutlets = prev.mediaSettings.outlets.map((outlet) =>
        outlet.name === name ? { ...outlet, isSelected: !outlet.isSelected } : outlet
      );

      return {
        ...prev,
        mediaSettings: {
          outlets: updatedOutlets,
        },
        majoritySentiment: calculatePoliticalStanding(prev.electionSettings, updatedOutlets),
      };
    });
  };

  const handleSimulationTypeChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      electionSettings: {
        ...prev.electionSettings,
        simulationType: value,
      },
      majoritySentiment: calculatePoliticalStanding(
        { ...prev.electionSettings, simulationType: value },
        prev.mediaSettings.outlets
      ),
    }));
  };

  const handleReligiosityChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      electionSettings: {
        ...prev.electionSettings,
        religiosity: value,
      },
      majoritySentiment: calculatePoliticalStanding(
        { ...prev.electionSettings, religiosity: value },
        prev.mediaSettings.outlets
      ),
    }));
  };

  const handleChaosLevelChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      electionSettings: {
        ...prev.electionSettings,
        chaosLevel: value,
      },
      majoritySentiment: calculatePoliticalStanding(
        { ...prev.electionSettings, chaosLevel: value },
        prev.mediaSettings.outlets
      ),
    }));
  };

  const validateSettings = () => {
    // Check if at least one topic is selected
    if (settings.electionSettings.topics.length === 0) {
      setError("At least one election topic is required");
      return false;
    }

    // Check if at least one media outlet is selected
    const hasSelectedOutlet = settings.mediaSettings.outlets.some((outlet) => outlet.isSelected);
    if (!hasSelectedOutlet) {
      setError("At least one media outlet must be selected");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateSettings()) {
      return;
    }

    // Store settings in simulation store
    setSimulationSettings(settings);

    // Get all form data and log it
    const allData = getAllData();
    console.log("All Form Data:", allData);

    // Navigate to loading page
    navigate("/simulation-loading");
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#131B39] to-[#0F1322]">
        <img
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-top"
        />
        <img
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-bottom"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
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
                <h1 className="text-[56px] font-medium font-['Inter Display'] text-white">
                  Settings
                </h1>
                <p className="text-white/80 text-base font-light">
                  Set information about this election simulation.
                </p>
              </div>
            </div>
            {error && <div className="text-red-500 mr-4 self-center">{error}</div>}
            <button
              className="px-[88px] py-5 bg-white hover:bg-white/90 transition-colors text-black text-2xl font-['Roboto Mono']"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-8 py-10">
          <div className="bg-black/10 border border-white/20 backdrop-blur-lg rounded-sm p-8">
            <h2 className="text-[32px] font-medium text-white mb-12">Simulation Settings</h2>

            <div className="grid grid-cols-12 gap-16">
              {/* Election Settings */}
              <div className="col-span-4">
                <h3 className="text-white text-xl mb-6">Election settings</h3>

                {/* Topics */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Issues of election</span>
                    <button
                      onClick={handleAddTopic}
                      className="text-white/80 hover:text-white w-6 h-6 rounded-full border border-white/30 hover:border-white flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.electionSettings.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicClick(topic)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Religiosity Slider */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm block mb-2">
                    How religious is this society
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.electionSettings.religiosity}
                    onChange={(e) => handleReligiosityChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Chaos Level Slider */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm block mb-2">
                    How chaotic is this world?
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.electionSettings.chaosLevel}
                    onChange={(e) => handleChaosLevelChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Simulation Type Slider */}
                <div>
                  <span className="text-white/80 text-sm block mb-2">Simulation Type</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.electionSettings.simulationType}
                    onChange={(e) => handleSimulationTypeChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Realistic</span>
                    <span>Satirical</span>
                  </div>
                </div>
              </div>

              {/* Time Settings */}
              <div className="col-span-4">
                <h3 className="text-white text-xl mb-6">Time Settings</h3>

                {/* Duration */}
                <div className="mb-6">
                  <span className="text-white/80 text-sm block mb-2">Duration</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(["1 Day", "2 Days", "3 Days", "4 Days"] as Duration[]).map((duration) => (
                      <button
                        key={duration}
                        onClick={() => handleDurationSelect(duration)}
                        className={`py-1 px-3 text-sm border rounded-lg ${
                          settings.timeSettings.duration === duration
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <span className="text-white/80 text-sm block mb-2">Speed</span>
                  <div className="grid grid-cols-6 gap-1">
                    {([0.25, 0.5, 1, 1.25, 1.5, 2] as Speed[]).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedSelect(speed)}
                        className={`py-1 px-3 text-sm border rounded-lg ${
                          settings.timeSettings.speed === speed
                            ? "border-white text-white"
                            : "border-white/30 text-white/60"
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Media Settings and Political Standing */}
              <div className="col-span-4 space-y-12">
                {/* Media Settings */}
                <div>
                  <h3 className="text-white text-xl mb-6">Media Settings</h3>
                  <div className="space-y-3">
                    {settings.mediaSettings.outlets.map((outlet) => (
                      <button
                        key={outlet.name}
                        onClick={() => handleMediaToggle(outlet.name)}
                        className="flex items-center justify-between w-full p-3 border border-white/20 rounded"
                      >
                        <span className="text-white">{outlet.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 text-sm">{outlet.bias}</span>
                          <div
                            className={`w-6 h-6 rounded border flex items-center justify-center ${
                              outlet.isSelected ? "bg-white border-white" : "border-white/30"
                            }`}
                          >
                            {outlet.isSelected && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Political Standing Graph */}
                <PoliticalStandingGraph
                  value={settings.majoritySentiment}
                  onChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      majoritySentiment: value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A2544] border border-white/20 rounded-lg p-6 w-[400px]">
            <h3 className="text-white text-xl mb-4">Add New Topic</h3>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter topic name"
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white placeholder:text-white/40 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTopicSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setNewTopic("");
                  setShowTopicModal(false);
                }}
                className="px-4 py-2 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button onClick={handleTopicSubmit} className="px-4 py-2 bg-white text-black rounded">
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
