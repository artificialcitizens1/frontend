import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimulationLore, getSimulationStatus } from '../api/simulationService';
import '../styles/fonts.css'; // Import fonts

const SimulationLore = () => {
  const { simId } = useParams<{ simId: string }>();
  const [loreTitle, setLoreTitle] = useState('');
  const [loreContent, setLoreContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  // We're keeping simulationData for future expansion but not currently displaying it
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const finalText = 'The choice now rests with the citizens…';
  const [finalTextTyped, setFinalTextTyped] = useState('');
  const [isFinalTyping, setIsFinalTyping] = useState(false);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isTypingLore, setIsTypingLore] = useState(false);

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
      } catch (error) {
        console.error('Error fetching simulation status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
    
  }, [simId]);

  // Title animation effect
  useEffect(() => {
    if (!isLoading && loreTitle) {
      const titleTimer = setTimeout(() => {
        setTitleAnimationComplete(true);
        // Prepare audio for use after title animation
        if (!typingAudioRef.current) {
          typingAudioRef.current = new window.Audio('/sounds/keyboard_sound.mp3');
          typingAudioRef.current.loop = true;
          typingAudioRef.current.volume = 0.5;
          // Preload audio
          typingAudioRef.current.load();
        }
      }, 4000); // Allow 4 seconds for the title animation
      
      return () => {
        clearTimeout(titleTimer)
        typingAudioRef.current = null; // Clean up audio reference
      };
    }
  }, [isLoading, loreTitle]);

  // Handle audio playback separately for better control
  useEffect(() => {
    // Start audio when title animation complete and lore content is being typed
    if (titleAnimationComplete && currentLineIndex < loreContent.length && !isAnimationComplete) {
      if (typingAudioRef.current) {
        // Make sure we restart from the beginning
        typingAudioRef.current.currentTime = 0;
        
        // Handle autoplay restrictions
        const playPromise = typingAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log(error);
            // Auto-play was prevented, add click listener to resume
            const resumeAudio = () => {
              if (typingAudioRef.current) typingAudioRef.current.play();
              document.removeEventListener('click', resumeAudio);
              document.removeEventListener('keydown', resumeAudio);
            };
            document.addEventListener('click', resumeAudio, { once: true });
            document.addEventListener('keydown', resumeAudio, { once: true });
          });
        }
      }
    }
    
    // Stop audio when typing is complete or component unmounts
    return () => {
      if (isAnimationComplete && typingAudioRef.current) {
        typingAudioRef.current.pause();
        typingAudioRef.current.currentTime = 0;
      }
    };
  }, [titleAnimationComplete, currentLineIndex, loreContent.length, isAnimationComplete]);

  // Handle word-by-word animation with adaptive speed and auto-scrolling
  useEffect(() => {
    let wordInterval: NodeJS.Timeout | null = null;
    let paragraphTimer: NodeJS.Timeout | null = null;

    if (!isLoading && titleAnimationComplete && loreContent.length > 0 && currentLineIndex < loreContent.length) {
      setIsTypingLore(true);
      
      const words = loreContent[currentLineIndex].split(' ');
      setDisplayedWords([]);
      let wordIndex = 0;
      wordInterval = setInterval(() => {
        if (wordIndex < words.length) {
          setDisplayedWords(prev => [...prev, words[wordIndex]]);
          wordIndex++;
          if (contentRef.current) {
            contentRef.current.scrollTo({
              top: contentRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        } else {
          if (wordInterval) clearInterval(wordInterval);
          // Pause after paragraph
          const pauseDuration = Math.min(2000, Math.max(1000, words.length * 50));
          paragraphTimer = setTimeout(() => {
            const nextIndex = currentLineIndex + 1;
            if (nextIndex >= loreContent.length) {
              setIsAnimationComplete(true);
              setIsFinalTyping(true);
              setIsTypingLore(false);
              
              // Stop the typing sound when all lore content is typed
              if (typingAudioRef.current) {
                typingAudioRef.current.pause();
                typingAudioRef.current.currentTime = 0;
              }
              
              setTimeout(() => {
                if (contentRef.current) {
                  contentRef.current.scrollTo({
                    top: contentRef.current.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }, 500);
            } else {
              setCurrentLineIndex(nextIndex);
            }
          }, pauseDuration);
        }
      }, 180);
    }
    
    return () => {
      if (wordInterval) clearInterval(wordInterval);
      if (paragraphTimer) clearTimeout(paragraphTimer);
      setIsTypingLore(false);
    };
  }, [isLoading, titleAnimationComplete, loreContent, currentLineIndex]);

  // Final text typing effect
  useEffect(() => {
    if (isFinalTyping) {
      setFinalTextTyped('');
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        setFinalTextTyped(finalText.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= finalText.length) {
          clearInterval(typeInterval);
          setIsFinalTyping(false);
        }
      }, 60);
      return () => clearInterval(typeInterval);
    }
  }, [isFinalTyping, finalText]);

  // Handle continue to simulation
  const handleContinue = () => {
    // Navigate to the simulation page
    navigate(`/simulation/${simId}`);
  };

  return (
    <div className="min-h-screen w-full relative bg-black overflow-hidden">
      {/* Stars background */}
      <div className="fixed inset-0 bg-black opacity-100">
        {/* Creating a starfield using pseudo-elements via CSS */}
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 border-t-4 border-yellow-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg" style={{ fontFamily: "Roboto Mono" }}>Loading the story of your world...</p>
          </div>
        ) : error ? (
          <div className="text-center bg-black/50 p-8 rounded-lg">
            <p className="text-red-500 mb-4" style={{ fontFamily: "Roboto Mono" }}>{error}</p>
            <button 
              className="px-6 py-2 bg-white text-black font-medium rounded-md"
              onClick={() => navigate('/candidate-settings')}
              style={{ fontFamily: "Roboto Mono" }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="max-w-6xl w-full mx-auto text-center perspective">
            {/* Title crawl animation */}
            <div className={`title-crawl ${titleAnimationComplete ? 'fade-out' : ''}`}>
              <div className="crawl-content">
                <h1 
                  className="text-yellow-400 text-7xl md:text-8xl tracking-widest font-bold title-3d"
                  style={{ fontFamily: "Roboto Mono" }}
                >
                  {loreTitle}
                </h1>
              </div>
            </div>
            
            {/* Main content appears after title animation */}
            {titleAnimationComplete && (
              <>
                {/* Cinematic overlay effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                
                {/* Word-by-word lore content */}
                <div 
                  ref={contentRef}
                  className="max-h-[60vh] overflow-y-auto pb-8 scrollbar-hide relative mt-20"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="space-y-12 py-4">
                    {/* Previously displayed paragraphs */}
                    {loreContent.slice(0, currentLineIndex).map((line, index) => (
                      <p 
                        key={index} 
                        className="text-white text-xl md:text-2xl leading-relaxed"
                        style={{ 
                          fontFamily: "Roboto Mono",
                          textShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }}
                      >
                        {line}
                      </p>
                    ))}
                    
                    {/* Current paragraph with word-by-word animation */}
                    {currentLineIndex < loreContent.length && (
                      <p 
                        className="text-white text-xl md:text-2xl leading-relaxed"
                        style={{ 
                          fontFamily: "Roboto Mono",
                          textShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }}
                      >
                        {displayedWords.join(' ')}
                        {isTypingLore && <span className="cursor-animation"></span>}
                      </p>
                    )}
                    
                    {/* Final line with typing effect and improved spacing - Star Wars style */}
                    {isAnimationComplete && (
                      <div className="mt-20 mb-8 overflow-visible">
                        <p 
                          className="text-yellow-400 text-2xl md:text-3xl leading-relaxed font-bold final-line tracking-wider"
                          style={{ 
                            fontFamily: "Roboto Mono",
                            textShadow: '0 0 25px rgba(255,215,0,0.7)', 
                            letterSpacing: '0.08em',
                            transform: 'perspective(500px) rotateX(15deg)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {finalTextTyped}
                          {!isTypingLore && <span className="cursor-animation" />}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Controls with matching style to other pages */}
                <div className="mt-16 flex justify-center gap-6 relative z-20">                  
                  {isAnimationComplete && (
                    <button 
                      className="px-[88px] py-5 bg-white hover:bg-white/90 transition-colors text-black rounded-md shadow-lg hover:shadow-xl"
                      onClick={handleContinue}
                      style={{ 
                        fontFamily: "Roboto Mono",
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                      }}
                    >
                      <span className="text-[28px] leading-[37px]" style={{ fontFamily: "Roboto Mono" }}>
                        Launch Simulation
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        /* Star field animation */
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }
        
        .perspective {
          perspective: 800px;
        }
        
        .title-crawl {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          transform-origin: 50% 100%;
          transform: translateY(-50%) rotateX(30deg);
          transition: opacity 2s ease;
        }
        
        .crawl-content {
          text-align: center;
          padding: 20px;
        }
        
        .star-wars-intro {
          animation: fadeInBlue 2s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .star-wars-subtitle {
          animation: fadeInYellow 2s ease-out 1s forwards;
          opacity: 0;
        }
        
        .fade-out {
          opacity: 0;
        }
        
        .title-3d {
          animation: crawlUp 4s ease-out 1.5s forwards;
          opacity: 0;
          text-shadow: 0 0 25px rgba(255,215,0,0.6);
        }
        
        @keyframes fadeInBlue {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fadeInYellow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes crawlUp {
          0% { transform: translateZ(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; transform: translateZ(-150px) scale(0.85); }
          100% { transform: translateZ(-300px) scale(0.6); opacity: 0; }
        }
        
        /* Cursor animation for typing effect */
        .cursor-animation {
          display: inline-block;
          width: 10px;
          height: 24px;
          background-color: #fff;
          margin-left: 4px;
          animation: blink 0.8s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Final line animation */
        .final-line {
          perspective: 400px;
        }
        
        /* Starfield effect */
        .bg-black::before,
        .bg-black::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
          background-size: 550px 550px, 350px 350px, 250px 250px;
          background-position: 0 0, 40px 60px, 130px 270px;
          animation: twinkle 8s ease-in-out infinite alternate;
        }
        
        .bg-black::after {
          background-size: 450px 450px, 250px 250px, 150px 150px;
          background-position: 50px 30px, 120px 100px, 10px 120px;
          animation-duration: 10s;
          animation-delay: 1s;
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