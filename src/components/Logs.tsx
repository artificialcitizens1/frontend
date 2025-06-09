import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';

interface LogsProps {
  logs?: string[];
}

const Logs: React.FC<LogsProps> = ({ logs: propLogs = [] }) => {
  const { logs: storeLogs } = useSimulationStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [displayLogs, setDisplayLogs] = useState<string[]>([]);
  const [newLogIndices, setNewLogIndices] = useState<Set<number>>(new Set());
  
  // Default logs from the screenshot (fallback)
  const defaultLogs = [
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:15 >>>Charlie Singh held a rally to please his voters",
  ];

  // Priority: propLogs > storeLogs > defaultLogs
  const currentLogs = propLogs.length > 0 ? propLogs : (storeLogs.length > 0 ? storeLogs : defaultLogs);

  // Auto-scroll to bottom when new logs are added
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle new logs with animation
  useEffect(() => {
    const previousLength = displayLogs.length;
    setDisplayLogs(currentLogs);
    
    if (currentLogs.length > previousLength && previousLength > 0) {
      // Mark new logs for animation
      const newIndices = new Set<number>();
      for (let i = previousLength; i < currentLogs.length; i++) {
        newIndices.add(i);
      }
      setNewLogIndices(newIndices);
      
      // Auto-scroll to bottom
      setTimeout(scrollToBottom, 100);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setNewLogIndices(new Set());
      }, 1000);
    }
  }, [currentLogs, displayLogs.length]);

  // Initial scroll to bottom
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);

  return (
    <div className="bg-black text-white font-mono h-full overflow-hidden border border-white/20 rounded-lg flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-white/20 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <span 
              className="text-white text-lg tracking-wider"
              style={{ fontFamily: "Roboto Mono", fontWeight: 500 }}
            >
              Logs
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span 
                className="text-xs text-white/60"
                style={{ fontFamily: "Roboto Mono" }}
              >
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Logs content */}
      <div 
        ref={scrollContainerRef}
        className="px-6 py-4 flex-1 overflow-y-auto overflow-x-hidden bg-black scrollbar-hide"
      >
        <div className="space-y-2">
          {displayLogs.map((log, index) => {
            const isNewLog = newLogIndices.has(index);
            const timeMatch = log.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
            
            if (timeMatch) {
              const [, time, message] = timeMatch;
              return (
                <div 
                  key={`${index}-${log}`} 
                  className={`text-gray-300 text-sm leading-relaxed pb-3 border-l-2 border-transparent pl-3 transition-all duration-500 break-words ${
                    isNewLog ? 'animate-slideInFromRight border-l-cyan-500 bg-cyan-500/5' : 'hover:border-l-white/20 hover:bg-white/5'
                  }`}
                  style={{ fontFamily: "Roboto Mono", wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  <span className="font-bold text-cyan-400">{time}</span>
                  <span className="font-normal text-white/90 break-words"> {message}</span>
                </div>
              );
            }
            return (
              <div 
                key={`${index}-${log}`} 
                className={`text-gray-300 text-sm leading-relaxed pb-3 border-l-2 border-transparent pl-3 transition-all duration-500 break-words ${
                  isNewLog ? 'animate-slideInFromRight border-l-cyan-500 bg-cyan-500/5' : 'hover:border-l-white/20 hover:bg-white/5'
                }`}
                style={{ fontFamily: "Roboto Mono", wordWrap: "break-word", overflowWrap: "break-word" }}
              >
                {log}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
        
        /* Hide scrollbar completely */
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* WebKit browsers */
          width: 0 !important;
          height: 0 !important;
        }
        
        /* Ensure text wrapping */
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};

export default Logs;