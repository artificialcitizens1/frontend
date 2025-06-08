import React from 'react';

interface LogsProps {
  logs?: string[];
}

const Logs: React.FC<LogsProps> = ({ logs = [] }) => {
  // Default logs from the screenshot
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

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  return (
    <div className="bg-black text-white font-mono h-full overflow-hidden">
      {/* Header */}
      <div className="bg-black">
        <div className="px-6 py-3">
          <span className="text-white text-xl roboto-mono">Logs</span>
        </div>
      </div>

      {/* Logs content */}
      <div className="px-6 py-4 h-full overflow-y-auto bg-black">
        <div className="space-y-1">
          {displayLogs.map((log, index) => {
            const timeMatch = log.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
            if (timeMatch) {
              const [, time, message] = timeMatch;
              return (
                <div key={index} className="text-gray-300 text-sm roboto-mono leading-relaxed pb-4">
                  <span className="font-bold">{time}</span>
                  <span className="font-normal"> {message}</span>
                </div>
              );
            }
            return (
              <div key={index} className="text-gray-300 text-sm font-mono leading-relaxed">
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Logs;
