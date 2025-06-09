import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSimulationFlow } from '../api/simulationService';
import { useSimulationStore } from '../store';
import Lottie from 'lottie-react';

const SimulationCreation = () => {
  const navigate = useNavigate();
  const { candidates, simulationName, description, setSimulationId } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);
  const [gridAnimationData, setGridAnimationData] = useState<any>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  
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

  // Animation progress effect
  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds for full animation
    
    const animationFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animationFrame);
      }
    };
    
    requestAnimationFrame(animationFrame);
  }, []);

  // Load and play GTA IV theme sound
  useEffect(() => {
    const gtaAudio = new Audio('/sounds/gta_iv_theme.mp3');
    gtaAudio.loop = false; // Don't loop the audio
    gtaAudio.volume = 0.8; // Set volume to 80%
    
    // Play the audio immediately
    const playAudio = async () => {
      try {
        await gtaAudio.play();
        console.log('🎵 GTA IV theme is now playing!');
      } catch (error) {
        console.error('❌ Error playing GTA IV theme:', error);
        // Try to play on user interaction
        document.addEventListener('click', () => {
          gtaAudio.play().catch(console.error);
        }, { once: true });
      }
    };
    
    playAudio();
    setAudio(gtaAudio);
    
    // Clean up function to stop audio when component unmounts
    return () => {
      if (gtaAudio) {
        gtaAudio.pause();
        gtaAudio.currentTime = 0;
        console.log('🔇 GTA IV theme stopped');
      }
    };
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
          
          // Stop the audio before navigation
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
            console.log('🔇 GTA IV theme stopped before navigation');
          }
          
          // Add a slight delay before navigation for better UX
          setTimeout(() => {
            navigate(`/simulation-lore/${response.simulation.simId}`);
          }, 2000);
        } else {
          setError('Invalid response from server. Missing simulation ID.');
        }
      } catch (err) {
        console.error('Error creating simulation:', err);
        setError('Failed to create simulation. Please try again.');
      }
    };

    // Start creating the simulation
    createSimulation();
  }, [candidates, simulationName, description, navigate, setSimulationId, audio]);

  return (
    <div className="min-h-screen w-full relative">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-black">
        {/* Top Grid Animation - Translated up with gradient fade */}
        <div className="absolute top-0 w-full h-1/2 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/50 to-black opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 1.0, 
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
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent via-black/50 to-black opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 1.0, 
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
        {/* GTA 4 Style Text Animation */}
        <div className="text-center">
          <h1 
            className="text-8xl font-bold text-white tracking-wider"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: `0 0 ${20 + animationProgress * 10}px rgba(255, 255, 255, ${0.4 + animationProgress * 0.2})`,
              letterSpacing: '0.2em',
              opacity: Math.min(1, animationProgress * 2),
              transform: `scale(${0.95 + animationProgress * 0.05})`,
              transition: 'text-shadow 0.5s ease-out, transform 0.5s ease-out, opacity 0.5s ease-out'
            }}
          >
            CREATING
          </h1>
          <h1 
            className="text-8xl font-bold text-white tracking-wider mt-4"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: `0 0 ${20 + animationProgress * 10}px rgba(255, 255, 255, ${0.4 + animationProgress * 0.2})`,
              letterSpacing: '0.2em',
              opacity: Math.min(1, animationProgress * 2 - 0.5),
              transform: `scale(${0.95 + animationProgress * 0.05})`,
              transition: 'text-shadow 0.5s ease-out, transform 0.5s ease-out, opacity 0.5s ease-out'
            }}
          >
            SIMULATION
          </h1>
        </div>
        
        {error && (
          <div className="mt-8 text-center">
            <p className="text-red-500 mb-4 text-xl">{error}</p>
            <button 
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => {
                // Stop audio before going back
                if (audio) {
                  audio.pause();
                  audio.currentTime = 0;
                  console.log('🔇 GTA IV theme stopped before going back');
                }
                navigate('/candidate-settings');
              }}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationCreation; 