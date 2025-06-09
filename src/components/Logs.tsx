import React, { useState, useEffect, useRef } from "react";

interface LogsProps {
  logs?: string[];
}

const Logs: React.FC<LogsProps> = ({ logs = [] }) => {
  // Default logs from the screenshot
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

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

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

  return (
    <div className="bg-black text-white font-mono h-full overflow-hidden">
      {/* Header */}
      <div className="bg-black">
        <div className="px-6 py-3">
          <span className="text-white text-xl roboto-mono">Logs</span>
        </div>
      </div>

      {/* Logs content */}
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
        }
      `}</style>
    </div>
  );
};

export default Logs;
