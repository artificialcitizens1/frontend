<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";

const Logs: React.FC<any> = () => {
  // Default logs from the screenshot
=======
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
>>>>>>> f2d54e2 (feat: map and stuff logs added)
  const defaultLogs = [
    "12:15 >>>Charlie Singh held a rally to please his voters",
    "12:16 >>>Sarah Johnson launched a new campaign advertisement",
    "12:17 >>>Mike Davis organized a town hall meeting",
    "12:18 >>>Charlie Singh gained support from local unions",
    "12:19 >>>Electoral commission announces voting procedures",
    "12:20 >>>Sarah Johnson addresses healthcare concerns",
    "12:21 >>>Mike Davis proposes new economic policies",
    "12:22 >>>Charlie Singh visits rural communities",
    "12:23 >>>Polling stations report high voter turnout",
    "12:24 >>>Final campaign events conclude across districts",
  ];

<<<<<<< HEAD
  const displayLogs = defaultLogs;

  const [visibleLogs, setVisibleLogs] = useState<
    Array<{ time: string; message: string; isVisible: boolean; isAnimating: boolean }>
  >([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Parse logs into time and message
  const parsedLogs = displayLogs.map((log) => {
    const timeMatch = log.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
    if (timeMatch) {
      const [, time, message] = timeMatch;
      return { time, message, isVisible: false, isAnimating: false };
    }
    return { time: "", message: log, isVisible: false, isAnimating: false };
  });

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logsContainerRef.current) {
      const container = logsContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleLogs.length]);

  useEffect(() => {
    if (currentLogIndex >= parsedLogs.length) return;

    const timer = setTimeout(() => {
      // Add new log with animation
      setVisibleLogs((prev) => {
        const newLogs = [...prev];
        if (newLogs.length <= currentLogIndex) {
          newLogs.push({ ...parsedLogs[currentLogIndex], isVisible: false, isAnimating: true });
        }
        return newLogs;
      });

      // Trigger visibility after a brief delay for animation
      setTimeout(() => {
        setVisibleLogs((prev) =>
          prev.map((log, index) => (index === currentLogIndex ? { ...log, isVisible: true } : log))
        );

        // Remove animation state after animation completes
        setTimeout(() => {
          setVisibleLogs((prev) =>
            prev.map((log, index) =>
              index === currentLogIndex ? { ...log, isAnimating: false } : log
            )
          );
        }, 600); // Match animation duration

        setCurrentLogIndex((prev) => prev + 1);
      }, 50);
    }, 1200); // Delay between each log appearance

    return () => clearTimeout(timer);
  }, [currentLogIndex, parsedLogs]);
=======
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
>>>>>>> f2d54e2 (feat: map and stuff logs added)

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
<<<<<<< HEAD
      <div ref={logsContainerRef} className="px-6 py-4 h-full overflow-y-auto bg-black">
        <div className="space-y-2">
          {visibleLogs.map((log, index) => {
            return (
              <div
                key={index}
                className={`text-gray-300 text-sm roboto-mono leading-relaxed transition-all duration-600 ease-out ${
                  log.isAnimating
                    ? "transform translate-y-4 opacity-0 scale-95"
                    : log.isVisible
                      ? "transform translate-y-0 opacity-100 scale-100"
                      : "transform translate-y-4 opacity-0 scale-95"
                }`}
                style={{
                  transitionDelay: log.isAnimating ? "0ms" : "0ms",
                }}
              >
                <div
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    log.isVisible ? "bg-gray-900/50 shadow-lg" : "bg-transparent"
                  }`}
                >
                  {/* Log content */}
                  <div className="flex-1">
                    {log.time && (
                      <span className="font-[400] text-white text-[18.21px] leading-[100%] tracking-[0.08em] roboto-mono">
                        {log.time}
                      </span>
                    )}
                    <span className=" font-[100] roboto-mono text-[18.21px] leading-[100%] tracking-[0.08em] text-gray-200/60">
                      {log.time ? " " : ""}
                      {log.message}
                    </span>
                  </div>
                </div>
=======
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
>>>>>>> f2d54e2 (feat: map and stuff logs added)
              </div>
            );
          })}

          {/* Loading indicator for next log */}
          {currentLogIndex < parsedLogs.length && (
            <div className="text-gray-500 text-sm roboto-mono leading-relaxed">
              <div className="flex items-center gap-2 p-3">
                <div className="flex gap-1">
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-gray-600">Loading next log...</span>
              </div>
            </div>
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* Enhanced CSS for log animations */}
      <style>{`
        @keyframes logSlideIn {
          0% {
            transform: translateY(20px) translateX(-10px);
            opacity: 0;
            filter: blur(4px);
          }
          50% {
            transform: translateY(5px) translateX(-2px);
            opacity: 0.7;
            filter: blur(1px);
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
            filter: blur(0);
          }
        }
        
        @keyframes statusGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.8), 0 0 25px rgba(34, 197, 94, 0.4);
          }
        }
        
        .log-enter {
          animation: logSlideIn 0.6s ease-out forwards;
        }
        
        /* Scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.7);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.9);
=======
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
>>>>>>> f2d54e2 (feat: map and stuff logs added)
        }
      `}</style>
    </div>
  );
};

export default Logs;
