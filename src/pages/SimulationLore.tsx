import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimulationLore, getSimulationStatus } from '../api/simulationService';

const SimulationLore = () => {
  const { simId } = useParams<{ simId: string }>();
  const [loreTitle, setLoreTitle] = useState('');
  const [loreContent, setLoreContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [simulationData, setSimulationData] = useState<any | null>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch lore data
  useEffect(() => {
    const fetchLore = async () => {
      if (!simId) {
        setError('No simulation ID provided.');
        setIsLoading(false);
        return;
      }

      try {
        const loreData = await getSimulationLore(simId);
        setLoreTitle(loreData.title);
        setLoreContent(loreData.content);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching lore:', err);
        setError('Failed to fetch simulation lore. Please try again.');
        setIsLoading(false);
      }
    };

    fetchLore();

    const interval = setInterval(async () => {
      try {
        const status = await getSimulationStatus(1, simId!);
        console.log('Simulation status:', status);
        if(status){
          setSimulationData(status);
        }
      } catch (error) {
        console.error('Error fetching simulation status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
    
  }, [simId]);

  // Handle scrolling animation
  useEffect(() => {
    if (!isLoading && loreContent.length > 0 && currentLineIndex < loreContent.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => {
          const nextIndex = prev + 1;
          
          // Check if we've reached the end
          if (nextIndex >= loreContent.length) {
            setIsAnimationComplete(true);
          }
          
          return nextIndex;
        });
        
        // Scroll to the bottom as new content appears
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 5000); // Show a new paragraph every 5 seconds for a more cinematic feel
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, loreContent, currentLineIndex]);

  // Handle skip animation
  const handleSkip = () => {
    setCurrentLineIndex(loreContent.length);
    setIsAnimationComplete(true);
  };

  // Handle continue to simulation
  const handleContinue = () => {
    // Navigate to the simulation page
    navigate(`/simulation/${simId}`);
  };

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Stars background */}
      <div className="fixed inset-0 bg-[url('/images/stars_bg.png')] opacity-70"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Loading the story of your world...</p>
          </div>
        ) : error ? (
          <div className="text-center bg-black/50 p-8 rounded-lg">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              className="px-6 py-2 bg-white text-black font-medium rounded-md"
              onClick={() => navigate('/candidate-settings')}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto text-center">
            {/* Title with more dramatic styling */}
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-300 mb-16 animate-pulse tracking-wider">
              {loreTitle}
            </h1>
            
            {/* Cinematic overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            
            {/* Scrolling lore content with film-like styling */}
            <div 
              ref={contentRef}
              className="max-h-[60vh] overflow-y-auto pb-8 scrollbar-hide relative"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="space-y-12 py-4">
                {loreContent.slice(0, currentLineIndex).map((line, index) => (
                  <p 
                    key={index} 
                    className="text-white text-xl md:text-2xl leading-relaxed fade-in-up font-serif"
                    style={{ 
                      animation: `fadeInUp 1.5s ease-out ${index * 0.3}s both`,
                      opacity: 0,
                      textShadow: '0 0 10px rgba(255,255,255,0.3)'
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Controls with better styling */}
            <div className="mt-16 flex justify-center gap-6 relative z-20">
              {!isAnimationComplete && (
                <button 
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors backdrop-blur-sm"
                  onClick={handleSkip}
                >
                  Skip
                </button>
              )}
              
              {isAnimationComplete && (
                <button 
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md transition-colors animate-pulse shadow-lg shadow-yellow-500/20"
                  onClick={handleContinue}
                >
                  Continue to Simulation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* CSS Animations with enhanced effects */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 1.5s ease-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SimulationLore; 