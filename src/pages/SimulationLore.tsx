import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimulationLore, getSimulationStatus } from '../api/simulationService';
import '../styles/fonts.css'; // Import fonts
import { useTickStore } from '../store/tickStore';
import { useSimulationStore } from '../store';
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/layout/Button";

const SimulationLore = () => {
  const { simId } = useParams<{ simId: string }>();
  const navigate = useNavigate();
  const { candidates } = useSimulationStore();
  
  const [loreTitle, setLoreTitle] = useState('The Lore');
  const [loreContent, setLoreContent] = useState<string[]>([
    'Once upon a time...',
    'Once a peaceful place fueled by waffles and weird traditions, Siminipolis spiraled into chaos after the government replaced traffic lights with interpretive dancers. Gridlock. Panic. Mime protests.',
    'The council resigned. An election was called.',
    'Now it\'s Candidate A, a sharp-talking reformer with big plans to modernize the state, vs Candidate B, a nostalgic hardliner promising to "bring Siminipolis back."',
    'The streets are buzzing. The voters are fired up. And everything\'s on the line.',
    'Let\'s see how the election goes...'
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [simulationData, setSimulationData] = useState<any | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const finalText = 'The choice now rests with the citizens…';
  const [finalTextTyped, setFinalTextTyped] = useState('');
  const [isFinalTyping, setIsFinalTyping] = useState(false);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isTypingLore, setIsTypingLore] = useState(false);
  const [candidatesVisible, setCandidatesVisible] = useState(false);
  const [contentBoxVisible, setContentBoxVisible] = useState(false);

  const [_isbuttonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const { setTickData, initializeCharacters } = useTickStore();
  
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
        setLoreTitle(loreData.title || 'The Lore');
        setLoreContent(loreData.content || [
          'Once upon a time...',
          'Once a peaceful place fueled by waffles and weird traditions, Siminipolis spiraled into chaos after the government replaced traffic lights with interpretive dancers. Gridlock. Panic. Mime protests.',
          'The council resigned. An election was called.',
          'Now it\'s Candidate A, a sharp-talking reformer with big plans to modernize the state, vs Candidate B, a nostalgic hardliner promising to "bring Siminipolis back."',
          'The streets are buzzing. The voters are fired up. And everything\'s on the line.',
          'Let\'s see how the election goes...'
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching lore:', err);
        // Use fallback content
        setLoreTitle('The Lore');
        setLoreContent([
          'Once upon a time...',
          'Once a peaceful place fueled by waffles and weird traditions, Siminipolis spiraled into chaos after the government replaced traffic lights with interpretive dancers. Gridlock. Panic. Mime protests.',
          'The council resigned. An election was called.',
          'Now it\'s Candidate A, a sharp-talking reformer with big plans to modernize the state, vs Candidate B, a nostalgic hardliner promising to "bring Siminipolis back."',
          'The streets are buzzing. The voters are fired up. And everything\'s on the line.',
          'Let\'s see how the election goes...'
        ]);
        setIsLoading(false);
      }
    };

    fetchLore();

    const interval = setInterval(async () => {
      try {
        const status = await getSimulationStatus(1, simId!);
        console.log('Simulation status:', status);
        if(status.length > 0 && simulationData === null){
          setSimulationData(status);
          console.log('setting tick data : ', status);
          setTickData(status);
          initializeCharacters(status[0].characters);
          setIsButtonDisabled(false);
        }
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
        
        // After title animation, show candidates with delay for fade-in effect
        setTimeout(() => {
          setCandidatesVisible(true);
          
          // After candidates appear, show content box with delay
          setTimeout(() => {
            setContentBoxVisible(true);
            
            // Prepare audio for typing after content box appears
            if (!typingAudioRef.current) {
              typingAudioRef.current = new window.Audio('/sounds/typing_beep.mp3');
              typingAudioRef.current.loop = true;
              typingAudioRef.current.volume = 0.5;
              // Preload audio
              typingAudioRef.current.load();
            }
          }, 800);
        }, 800);
      }, 4000); // Allow 4 seconds for the title animation
      
      return () => {
        clearTimeout(titleTimer)
        typingAudioRef.current = null; // Clean up audio reference
      };
    }
  }, [isLoading, loreTitle]);

  // Handle audio playback separately for better control
  useEffect(() => {
    // Start audio when content box is visible and lore content is being typed
    if (contentBoxVisible && currentLineIndex < loreContent.length && !isAnimationComplete) {
      if (typingAudioRef.current && isTypingLore) {
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
      } else if (typingAudioRef.current && !isTypingLore) {
        // Pause audio when typing is paused
        typingAudioRef.current.pause();
      }
    }
    
    // Stop audio when typing is complete or component unmounts
    return () => {
      if ((isAnimationComplete || !isTypingLore) && typingAudioRef.current) {
        typingAudioRef.current.pause();
        typingAudioRef.current.currentTime = 0;
      }
    };
  }, [contentBoxVisible, currentLineIndex, loreContent.length, isAnimationComplete, isTypingLore]);

  // Handle word-by-word animation with adaptive speed and auto-scrolling
  useEffect(() => {
    let wordInterval: NodeJS.Timeout | null = null;
    let paragraphTimer: NodeJS.Timeout | null = null;

    if (!isLoading && contentBoxVisible && loreContent.length > 0 && currentLineIndex < loreContent.length) {
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
          
          // Pause typing sound during the paragraph pause
          setIsTypingLore(false);
          
          paragraphTimer = setTimeout(() => {
            const nextIndex = currentLineIndex + 1;
            if (nextIndex >= loreContent.length) {
              setIsAnimationComplete(true);
              setIsFinalTyping(true);
              
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
              // Resume typing sound for the next paragraph
              setIsTypingLore(true);
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
  }, [isLoading, contentBoxVisible, loreContent, currentLineIndex]);

  // Final text typing effect
  useEffect(() => {
    if (isFinalTyping) {
      setFinalTextTyped('');
      let charIndex = 0;
      
      // Start typing sound for final text
      setIsTypingLore(true);
      
      const typeInterval = setInterval(() => {
        setFinalTextTyped(finalText.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= finalText.length) {
          clearInterval(typeInterval);
          setIsFinalTyping(false);
          setIsTypingLore(false);
        }
      }, 60);
      return () => clearInterval(typeInterval);
    }
  }, [isFinalTyping, finalText]);

  // Handle continue to simulation
  const handleContinue = () => {
    // Navigate to the simulation page
    navigate(`/simulation/${simId}`); // simulation result page.
  };

  // Get candidate names and parties
  const getCandidateInfo = () => {
    if (candidates && candidates.length >= 2) {
      return [
        { name: candidates[0].name || 'RAHUL SINGH', party: 'BLUE PARTY' },
        { name: candidates[1].name || 'ARMAN PATEL', party: 'ORANGE PARTY' }
      ];
    }
    return [
      { name: 'RAHUL SINGH', party: 'BLUE PARTY' },
      { name: 'ARMAN PATEL', party: 'ORANGE PARTY' }
    ];
  };

  const candidateInfo = getCandidateInfo();

  // Toolbar actions - continue button at the top
  const toolbarActions = (
    <Button 
      onClick={handleContinue}
      disabled={!isAnimationComplete}
      variant="primary"
    >
      Launch Simulation
    </Button>
  );

  // Add useEffect to control page scrolling
  useEffect(() => {
    // Disable scrolling on the body when this component mounts
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <PageLayout>
      {/* Custom Toolbar without back button - only title and continue button */}
      <div className="sticky top-0 z-50 bg-transparent pt-6 pb-4 px-8">
        <div className="max-w-[1728px] mx-auto flex justify-between items-center">
          <div>
            <h1 
              className="text-white" 
              style={{ 
                fontFamily: "Roboto Mono",
                fontWeight: 500,
                fontSize: "48px",
                lineHeight: "100%",
                letterSpacing: "0%"
              }}
            >
              The Lore
            </h1>
          </div>
          
          <div className="flex items-center">
            {toolbarActions}
          </div>
        </div>
      </div>

      {/* Main Content Container - No overflow, fixed height */}
      <div 
        className="w-full px-4 flex flex-col items-center justify-center overflow-hidden mt-12"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 border-t-4 border-pink-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg" style={{ fontFamily: "Roboto Mono" }}>Loading the story of your world...</p>
          </div>
        ) : error ? (
          <div className="text-center bg-black p-8 rounded-lg">
            <p className="text-red-500 mb-4" style={{ fontFamily: "Roboto Mono" }}>{error}</p>
            <button 
              className="px-6 py-2 bg-white text-black font-medium"
              onClick={() => navigate('/candidate-settings')}
              style={{ fontFamily: "Roboto Mono" }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Star Wars style title animation */}
            {!titleAnimationComplete && (
              <div className="absolute inset-0 star-wars-container perspective overflow-hidden">
                <div className="title-crawl">
                  <div className="crawl-content">
                    <h1 
                      className="text-yellow-400 text-6xl md:text-8xl tracking-wider font-bold title-3d"
                      style={{ fontFamily: "Roboto Mono" }}
                    >
                      {loreTitle}
                    </h1>
                  </div>
                </div>
              </div>
            )}

            {/* Content after title animation - Candidate Headers and Content Box */}
            {titleAnimationComplete && (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-6 overflow-hidden">
                {/* Candidate Headers - Fade in animation */}
                <div className={`flex justify-between w-full max-w-[1728px] transition-all duration-1000 ease-in-out ${candidatesVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
                  <div className="flex items-center bg-black py-2 px-4 rounded-sm w-[45%] border border-white/10">
                    <img src="/images/candidate_default.png" alt="Candidate" className="w-12 h-12 mr-3" />
                    <div className="text-left">
                      <p className="text-white/70 text-xs" style={{ fontFamily: "Roboto Mono" }}>
                        CANDIDATE|{candidateInfo[0].party}
                      </p>
                      <p className="text-white text-xl" style={{ fontFamily: "Roboto Mono" }}>
                        {candidateInfo[0].name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end bg-black py-2 px-4 rounded-sm w-[45%] border border-white/10">
                    <div className="text-right">
                      <p className="text-white/70 text-xs" style={{ fontFamily: "Roboto Mono" }}>
                        CANDIDATE|{candidateInfo[1].party}
                      </p>
                      <p className="text-white text-xl" style={{ fontFamily: "Roboto Mono" }}>
                        {candidateInfo[1].name}
                      </p>
                    </div>
                    <img src="/images/candidate_default.png" alt="Candidate" className="w-12 h-12 ml-3" />
                  </div>
                </div>

                {/* Content Box - Appears with animation after candidates */}
                <div className={`w-full max-w-[1728px] flex-grow flex flex-col bg-black border border-white/10 rounded-sm p-8 transition-all duration-1000 ease-in-out overflow-hidden ${contentBoxVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'}`}>
                  {/* First line is a heading */}
                  {loreContent.length > 0 && contentBoxVisible && (
                    <h2 
                      className="text-white text-3xl mb-6 font-bold"
                      style={{ fontFamily: "Roboto Mono" }}
                    >
                      {currentLineIndex > 0 ? loreContent[0] : displayedWords.join(' ')}
                      {currentLineIndex === 0 && isTypingLore && <span className="cursor-animation"></span>}
                    </h2>
                  )}

                  {/* Main content area with hidden scrollbar */}
                  <div 
                    ref={contentRef}
                    className="flex-grow overflow-y-auto scrollbar-hide"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    <div className="space-y-6 pr-4">
                      {/* Previously displayed paragraphs (skipping the first one which is the heading) */}
                      {loreContent.slice(1, currentLineIndex).map((line, index) => (
                        <p 
                          key={index} 
                          className="text-white text-xl leading-relaxed"
                          style={{ 
                            fontFamily: "Roboto Mono",
                          }}
                        >
                          {line}
                        </p>
                      ))}
                      
                      {/* Current paragraph with word-by-word animation (if not the first line) */}
                      {currentLineIndex > 0 && currentLineIndex < loreContent.length && (
                        <p 
                          className="text-white text-xl leading-relaxed"
                          style={{ 
                            fontFamily: "Roboto Mono",
                          }}
                        >
                          {displayedWords.join(' ')}
                          {isTypingLore && <span className="cursor-animation"></span>}
                        </p>
                      )}
                      
                      {/* Final text */}
                      {isAnimationComplete && (
                        <p 
                          className="text-white text-xl leading-relaxed mt-6"
                          style={{ 
                            fontFamily: "Roboto Mono",
                          }}
                        >
                          {finalTextTyped}
                          {isFinalTyping && <span className="cursor-animation"></span>}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        /* PageLayout override to prevent scrolling */
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* WebKit */
          width: 0 !important;
          height: 0 !important;
        }
        
        /* Star Wars style animations */
        .perspective {
          perspective: 800px;
        }
        
        .star-wars-container {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        
        .title-crawl {
          position: relative;
          top: 0;
          transform-origin: 50% 100%;
          animation: crawlUp 4s ease-out forwards;
        }
        
        .crawl-content {
          text-align: center;
          padding: 20px;
        }
        
        .title-3d {
          opacity: 0;
          animation: fadeInAndScale 3.5s ease-out 0.5s forwards;
          text-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
        }
        
        @keyframes crawlUp {
          0% { transform: rotateX(20deg) translateY(100vh); }
          100% { transform: rotateX(20deg) translateY(-10vh); }
        }
        
        @keyframes fadeInAndScale {
          0% { opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
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
      `}</style>
    </PageLayout>
  );
};

export default SimulationLore;