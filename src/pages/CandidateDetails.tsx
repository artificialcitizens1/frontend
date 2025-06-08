import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialMediaFeed from "../components/SocialMediaFeed";
import NewsChannel from "../components/NewsChannel";
import DesktopInterface from "../components/candidate_components/DesktopInterface";

// Surveillance Screen Component
const SurveillanceScreen = () => {
  const [currentView, setCurrentView] = useState<"desktop" | "social" | "news">("desktop");

  const handleSocialMediaClick = () => {
    setCurrentView("social");
  };

  const handleNewsClick = () => {
    setCurrentView("news");
  };

  const handleBackToDesktop = () => {
    setCurrentView("desktop");
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Laptop mockup container */}
      <div className="relative">
        {/* Replace 'laptop-mockup.png' with your actual laptop PNG file */}
        <img
          src="images/monitor_mockup.png"
          alt="Laptop"
          className="w-full max-w-4xl object-cover"
        />

        {/* Screen overlay - positioned to match the laptop screen area with subtle CRT bulge effect */}
        <div
          className="absolute top-[8%] left-[8%] right-[8%] bottom-[32%] bg-white overflow-hidden"
          style={{
            borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
            transform: "perspective(80vw) rotateX(0.8deg)",
            transformOrigin: "center center",
          }}
        >
          {currentView === "desktop" ? (
            <DesktopInterface
              onSocialMediaClick={handleSocialMediaClick}
              onNewsClick={handleNewsClick}
            />
          ) : currentView === "social" ? (
            <SocialMediaFeed onClose={handleBackToDesktop} />
          ) : (
            <NewsChannel onClose={handleBackToDesktop} />
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateDetails = () => {
  const navigate = useNavigate();
  // For demo purposes, using a simple back function
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Main Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black py-2 px-8">
          <div className="max-w-full mx-auto flex items-center gap-6">
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
            <h1 className="text-[24px] font-medium text-white roboto-mono">CANDIDATE DETAILS</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1728px] mx-auto px-4 py-6">
          <div className="flex">
            {/* Left column - Candidate Profile */}
            <div className="w-1/4 rounded-sm mr-6">
              <div className="border border-white/10 rounded-sm">
                {/* Candidate status and name */}
                <div className="border-b bg-[#101528] border-white/10 pl-4 py-4">
                  <div className="text-white/60 text-sm uppercase mb-1 roboto-mono">CANDIDATE|BLUE PARTY</div>
                  <div className="text-white text-2xl font-['ManifoldExtendedCF']">
                    RAHUL SINGH
                  </div>
                </div>

                {/* Candidate image and details */}
                <div className="flex">
                  <div className="w-40 h-49 overflow-hidden">
                    {/* Using a placeholder since we don't have the actual image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="images/candidate_photo.png"
                        alt="Rahul Singh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Age */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">AGE</div>
                      <div className="text-white text-xl roboto-mono">50</div>
                    </div>

                    {/* Occupation */}
                    <div className="border-b border-white/10 py-5 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">OCCUPATION</div>
                      <div className="text-white text-xl roboto-mono">SENATOR</div>
                    </div>

                    {/* Cases and Scandals */}
                    <div className="py-4 ml-4">
                      <div className="text-white/60 text-xs uppercase roboto-mono">CASES AND SCANDALS</div>
                      <div className="text-white text-xl roboto-mono">24</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-2 roboto-mono">Description</h3>
                <p className="text-white/80 text-sm leading-relaxed roboto-mono">
                  Once a railway clerk who fixed trains with duct tape and hope, Rahul shot to fame 
                  during the "Great Mango Subsidy Revolt," where he demanded two mangoes per citizen — 
                  and got them. Now he's running on a platform of "common sense and uncommon snacks." 
                  His fans call him The People's Patchwork. His critics call him unserious. Rahul 
                  just hands them a samosa and moves on.
                </p>
              </div>

              {/* Traits */}
              <div className="mt-6">
                <h3 className="text-white text-xl mb-4 roboto-mono">Traits</h3>
                
                {/* Charisma */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Charisma</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: "60%" }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>

                {/* Temper */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Temper</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: "30%" }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>

                {/* Integrity */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white roboto-mono">Integrity</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white/60 text-xs roboto-mono mr-2">Low</span>
                    <div className="flex-1 bg-gray-700 h-2 relative">
                      <div className="bg-white h-full" style={{ width: "20%" }}></div>
                    </div>
                    <span className="text-white/60 text-xs roboto-mono ml-2">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center column - Laptop mockup with surveillance screen */}
            <div className="w-full flex justify-center items-center relative">
              <div className="absolute w-[100%] pr-5 top-0">
                {/* Surveillance screen content */}
                <SurveillanceScreen />
              </div>
            </div>

            {/* Right column - Logs and Timeline */}
            <div className="w-1/3 flex flex-col gap-6">
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

export default CandidateDetails;
