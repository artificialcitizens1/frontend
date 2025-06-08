import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store';
import { startSimulationFlow } from '../api/simulationService';

const SimulationCreation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { candidates, simulationName, description, setSimulationId } = useSimulationStore();
  const navigate = useNavigate();

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
          navigate(`/simulation-lore/${response.simulation.simId}`);
        } else {
          setError('Invalid response from server. Missing simulation ID.');
        }
      } catch (err) {
        console.error('Error creating simulation:', err);
        setError('Failed to create simulation. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Start creating the simulation
    createSimulation();
  }, [candidates, navigate]);

  return (
    <div className="min-h-screen w-full relative">
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