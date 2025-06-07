import { useState } from "react";

// Voter Political Standing Graph component
const VoterPoliticalLeaningGraph = () => {
  return (
    <div className="flex flex-col items-center mt-4 mb-4">
      <div className="relative w-[175px] h-[175px]">
        {/* Grid lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white opacity-30" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white opacity-30" />

        {/* Labels */}
        <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-white text-[12px] font-light roboto-mono">
          Authoritarian
        </span>
        <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-white text-[12px] font-light roboto-mono">
          Libertarian
        </span>
        <span className="absolute top-1/2 -left-10 -translate-y-1/2 text-white text-[12px] font-light roboto-mono">
          Left
        </span>
        <span className="absolute top-1/2 -right-10 -translate-y-1/2 text-white text-[12px] font-light roboto-mono">
          Right
        </span>

        {/* Position indicator */}
        <div
          className="absolute w-4 h-4 bg-[#D25EA9] border-2 border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + 20}%`, // Sample value
            top: `${50 - 20}%`, // Sample value
          }}
        />
      </div>
    </div>
  );
};

// Surveillance Screen Component
const SurveillanceScreen = () => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Laptop mockup container */}
      <div className="relative">
        {/* Replace 'laptop-mockup.png' with your actual laptop PNG file */}
        <img src="images/monitor_mockup.png" alt="Laptop" className="w-full max-w-4xl object-cover" />
        
        {/* Screen overlay - positioned to match the laptop screen area */}
        <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[25%] bg-gradient-to-b from-cyan-400 to-blue-500 overflow-hidden rounded-lg">
          {/* Horizontal scan lines effect */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-[2px] bg-black/20"
                style={{
                  position: "absolute",
                  top: `${(i / 50) * 100}%`,
                  animationDelay: `${i * 0.02}s`,
                }}
              />
            ))}
          </div>

          {/* Portrait grid - 3x2 layout adjusted for laptop screen */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative">
                {/* Portrait placeholder with cyan tint effect */}
                <div
                  className="w-full h-full bg-gradient-to-br from-cyan-300/30 to-blue-400/50 rounded-md flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(45deg, rgba(0,255,255,0.3) 0%, rgba(0,150,255,0.4) 100%)`,
                  }}
                >
                  {/* Simulated portrait */}
                  <div className="w-12 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full relative">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-orange-300 rounded-lg"></div>
                  </div>

                  {/* Scan line overlay for each portrait */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Semi-circle scanner in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-32 h-16 border-t-4 border-cyan-200 rounded-t-full opacity-80 animate-pulse"></div>
            <div
              className="w-24 h-12 border-t-2 border-cyan-100 rounded-t-full opacity-60 mt-1 mx-auto animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          {/* Warning Dialog */}
          {showWarning && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border-2 border-gray-400 shadow-xl z-30">
              {/* Dialog Title Bar */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 flex justify-between items-center text-xs">
                <span className="font-bold">Warning</span>
                <div className="flex gap-1">
                  <button className="w-4 h-3 bg-gray-300 border border-gray-400 text-xs flex items-center justify-center hover:bg-gray-400">
                    _
                  </button>
                  <button className="w-4 h-3 bg-gray-300 border border-gray-400 text-xs flex items-center justify-center hover:bg-gray-400">
                    □
                  </button>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="w-4 h-3 bg-red-500 border border-gray-400 text-xs flex items-center justify-center text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Dialog Content */}
              <div className="p-4 bg-gray-100 min-w-[180px] text-center">
                <div className="mb-3">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="text-gray-800 font-medium text-sm leading-tight">
                    You are being
                    <br />
                    watched
                  </p>
                </div>
                <button
                  onClick={() => setShowWarning(false)}
                  className="px-4 py-1 bg-gray-300 border-2 border-gray-400 text-black hover:bg-gray-400 font-medium text-xs"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Glitch effects */}
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-cyan-200 opacity-60 animate-pulse"></div>
            <div
              className="absolute top-3/4 left-0 right-0 h-[1px] bg-cyan-200 opacity-60 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoterDetails = () => {
  // For demo purposes, using a simple back function
  const handleBack = () => {
    console.log("Navigate back");
    // Replace with your actual navigation logic
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Main Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black py-6 px-8">
          <div className="max-w-[1728px] mx-auto flex items-center gap-6">
            <button
              className="text-white hover:bg-white/5 rounded-2xl transition-colors flex items-center justify-center"
              onClick={handleBack}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="text-[32px] font-medium font-['Inter Display'] text-white roboto-mono">
              VOTER DETAILS
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 py-6">
          <div className="flex">
            {/* Left column - Voter Profile */}
            <div className="w-1/4 rounded-sm mr-6">
              <div className="border border-white/10 rounded-sm">
                {/* Civilian status and name */}
                <div className="border-b bg-[#101528] border-white/10 pl-4 py-4">
                  <div className="text-white/60 text-sm uppercase mb-1 roboto-mono">CIVILIAN</div>
                  <div className="text-white text-2xl font-['ManifoldExtendedCF']">JACK FLANNAGAN</div>
                </div>

                {/* Voter image and details */}
                <div className="flex">
                  <div className="w-40 h-49 overflow-hidden">
                    {/* Using a placeholder since we don't have the actual image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="images/civilian_profile.png"
                        alt="Jack Flannagan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Age */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">AGE</div>
                      <div className="text-white text-xl roboto-mono">32</div>
                    </div>

                    {/* Occupation */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">OCCUPATION</div>
                      <div className="text-white text-xl roboto-mono">OCCUPATION</div>
                    </div>

                    {/* Type */}
                    <div className="py-4 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">TYPE</div>
                      <div className="text-white text-xl roboto-mono">INFLUENCER</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-2 roboto-mono">Description</h3>
                <p className="text-white/80 text-sm leading-relaxed roboto-mono">
                  Jack Flanagan is a quirky, soft-spoken oddball with a knack for fixing broken
                  gadgets using tape and blind optimism. He wears cargo shorts year-round, talks to
                  his plants like coworkers, and once tried to start a detective agency with a stray
                  cat.
                </p>
              </div>

              {/* Political Leaning */}
              <div className="mt-6">
                <h3 className="text-white text-xl pb-4 roboto-mono">Political Leaning</h3>
                <div className="border border-white/30 p-4">
                    <VoterPoliticalLeaningGraph />
                </div>
              </div>
            </div>

            {/* Center column - Laptop mockup with surveillance screen */}
            <div className="w-1/2 flex justify-center items-center">
              <div className="absolute w-[50%] pr-5">
                {/* Surveillance screen content */}
                <SurveillanceScreen />
              </div>
            </div>

            {/* Right column - Logs and Timeline */}
            <div className="w-1/4 flex flex-col gap-6">
              {/* Logs section */}
              <div className="bg-black/60 border border-white/10 p-4 h-[300px] overflow-y-auto">
                <h3 className="text-white text-xl mb-4 roboto-mono">Logs</h3>
                <div className="font-mono text-white/80 text-xs roboto-mono">
                  <p className="my-1">&gt;&gt;18:00 Day 1 is over</p>
                  <p className="my-1">&gt;&gt;Charlie Singh held a rally to please his voters</p>
                  <p className="my-1">&gt;&gt;Acts of vandalism seen on Rahul's posters</p>
                  <p className="my-1">&gt;&gt;Charlie Singh held a rally to please his voters</p>
                  <p className="my-1">&gt;&gt;Earthquake caused in Simpolis</p>
                  <p className="my-1">&gt;&gt;Charlie Singh held a rally to please his voters</p>
                  <p className="my-1">&gt;&gt;Earthquake caused in Simpolis</p>
                  <p className="my-1">&gt;&gt;Charlie Singh held a rally to please his voters</p>
                </div>
              </div>

              {/* Timeline section */}
              <div className="bg-black/60 border border-white/10 p-4">
                <h3 className="text-white text-xl mb-4 roboto-mono">Timeline</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-white mb-1 roboto-mono">
                      Current Location: <span className="text-white/80">Office</span>
                    </p>
                    <p className="text-white roboto-mono">
                      Current Activity: <span className="text-white/80">Working</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-white/80 roboto-mono">3:00 PM</span>
                    <div className="w-full h-[40px] bg-black/30 mt-2 relative">
                      <div className="absolute h-full w-[2px] bg-white left-[65%] top-0"></div>
                      <div className="absolute w-full h-full flex">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="flex-1 border-r border-white/20 h-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDetails;
