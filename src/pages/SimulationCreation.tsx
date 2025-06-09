import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSimulationFlow } from '../api/simulationService';
import { useSimulationStore } from '../store';
import Lottie from 'lottie-react';

const SimulationCreation = () => {
  const navigate = useNavigate();
  const { candidates, simulationName, description, setSimulationId } = useSimulationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridAnimationData, setGridAnimationData] = useState<any>(null);
  
  // Load animation data from public folder
  useEffect(() => {
    const loadAnimationData = async () => {
      try {
        // Fetch grid animation
        const response = await fetch('/animations/grid_animation.json');
        const data = await response.json();
        setGridAnimationData(data);
      } catch (error) {
        console.error('Error loading animation data:', error);
      }
    };
    
    loadAnimationData();
  }, []);

  useEffect(() => {
    const createSimulation = async () => {
      try {
        // Make API call to start simulation with name and description from store
        const response = await startSimulationFlow(
          candidates || [],
          simulationName || "2025 General Election", 
          description || "A simulation of the 2025 general election with two major candidates."
        );
        
        console.log('Simulation created:', response);
        
        // Navigate to the lore page with the simulation ID
        if (response && response.simulation && response.simulation.simId) {
          setSimulationId(response.simulation.simId);
          
          // Add a slight delay before navigation for better UX
          setTimeout(() => {
            navigate(`/simulation-lore/${response.simulation.simId}`);
          }, 2000);
        } else {
          setError('Invalid response from server. Missing simulation ID.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error creating simulation:', err);
        setError('Failed to create simulation. Please try again.');
        setIsLoading(false);
      }
    };

    // Start creating the simulation
    createSimulation();
  }, [candidates, simulationName, description, navigate, setSimulationId]);

  return (
    <div className="min-h-screen w-full relative">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#131B39] to-[#0F1322]">
        {/* Top Grid Animation - Translated up with gradient fade */}
        <div className="absolute top-0 w-full h-1/2 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0F1322] opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 0.15, 
                transform: 'translateY(-25%)', 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
              }}
            />
          )}
        </div>
        {/* Bottom Grid Animation - Rotated 180 degrees and translated down with gradient fade */}
        <div className="absolute bottom-0 w-full h-1/2 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent via-transparent to-[#0F1322] opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 0.15, 
                transform: 'translateY(25%) rotate(180deg)', 
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%'
              }}
            />
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-xl w-full p-8 bg-black/20 border border-white/20 backdrop-blur-lg rounded-lg">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">Creating Simulation</h1>
          
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Please wait while we create your simulation...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                className="px-6 py-2 bg-white text-black font-medium rounded-md"
                onClick={() => navigate('/candidate-settings')}
              >
                Go Back
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SimulationCreation; 