import React, { useState } from "react";

interface DesktopInterfaceProps {
  onSocialMediaClick: () => void;
  onNewsClick: () => void;
}

const DesktopInterface: React.FC<DesktopInterfaceProps> = ({ onSocialMediaClick, onNewsClick }) => {
  const [showWarning, setShowWarning] = useState(true);

  const handleWarningOk = () => {
    setShowWarning(false);
  };

  return (
    <div
      className="w-full h-full relative"
      style={{
        background: "linear-gradient(135deg, #4a90a4 0%, #6ba3d0 100%)",
      }}
    >
      {/* Warning Dialog */}
      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-gray-200 border-2 border-gray-400 rounded-sm shadow-lg">
            {/* Title bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-2 py-1 text-sm flex items-center justify-between">
              <span>Warning</span>
              <div className="flex gap-1">
                <button className="w-4 h-4 bg-gray-300 border border-gray-400 text-xs">_</button>
                <button className="w-4 h-4 bg-gray-300 border border-gray-400 text-xs">□</button>
                <button className="w-4 h-4 bg-red-500 border border-gray-400 text-xs">×</button>
              </div>
            </div>
            {/* Content */}
            <div className="p-4 w-64">
              <div className="text-center mb-4">
                <p className="text-black text-sm">You are being</p>
                <p className="text-black text-sm">watched</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleWarningOk}
                  className="px-4 py-1 bg-gray-300 border-2 border-gray-400 text-black text-sm hover:bg-gray-400 active:border-gray-600"
                  style={{
                    borderStyle: "outset",
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Icons at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        {/* Pink Folder Icon */}
        {/* <div className="flex flex-col items-center cursor-pointer hover:bg-white/20 p-2 rounded">
          <div className="w-12 h-12 bg-pink-400 border-2 border-pink-600 rounded-sm flex items-center justify-center shadow-lg">
            <div className="w-8 h-6 bg-pink-300 border border-pink-500 rounded-sm"></div>
          </div>
          <span className="text-white text-xs mt-1">Folder</span>
        </div> */}

        {/* Red/Pink Circle Icon (Browser) */}
        <div
          className="flex flex-col items-center cursor-pointer hover:bg-white/20 p-2 rounded"
          onClick={onNewsClick}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <img src="/icons/ic_news.svg" alt="news" />
          </div>
          <span className="text-white text-xs mt-1">News</span>
        </div>

        {/* Dark Circle Icon (Social Media) */}
        <div
          className="flex flex-col items-center cursor-pointer hover:bg-white/20 p-2 rounded"
          onClick={onSocialMediaClick}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <img src="/icons/ic_shitter.svg" alt="social" />
          </div>
          <span className="text-white text-xs mt-1">Social</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopInterface;
