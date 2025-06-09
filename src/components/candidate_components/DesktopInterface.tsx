import React, { useState } from "react";
import { Chart } from "react-google-charts";

interface DesktopInterfaceProps {
  onSocialMediaClick: () => void;
  onNewsClick: () => void;
  onTrashClick: () => void;
}

const DesktopInterface: React.FC<DesktopInterfaceProps> = ({ onSocialMediaClick, onNewsClick, onTrashClick }) => {
  const [showWarning, setShowWarning] = useState(false);

  // Sample data for the graphs matching the image values
  const approvalData = [
    ['Time', 'Approval Rating'],
    ['10:00', 55],
    ['11:00', 40],
    ['12:00', 70],
    ['13:00', 22],
    ['14:00', 30],
    ['15:00', 48],
    ['16:00', 25],
    ['17:00', 65],
    ['18:00', 65],
    ['19:00', 90],
    ['20:00', 75]
  ];

  const integrityData = [
    ['Time', 'Integrity Score'],
    ['10:00', 5],
    ['11:00', 20],
    ['12:00', 35],
    ['13:00', 45],
    ['14:00', 45],
    ['15:00', 35],
    ['16:00', 30],
    ['17:00', 25],
    ['18:00', 25],
    ['19:00', 60],
    ['20:00', 85]
  ];

  const approvalOptions = {
    title: '',
    backgroundColor: 'transparent',
    chartArea: { 
      left: 30, 
      top: 10, 
      width: '85%', 
      height: '75%',
      backgroundColor: '#1e3a8a'
    },
    colors: ['#fbb6ce'],
    legend: { position: 'none' },
    hAxis: {
      textStyle: { color: 'white', fontSize: 8 },
      gridlines: { color: 'transparent' }
    },
    vAxis: {
      textStyle: { color: 'white', fontSize: 8 },
      gridlines: { color: '#334155' },
      minValue: 0,
      maxValue: 100
    },
    bar: { groupWidth: '60%' }
  };

  const integrityOptions = {
    title: '',
    backgroundColor: 'transparent',
    chartArea: { 
      left: 30, 
      top: 10, 
      width: '85%', 
      height: '75%',
      backgroundColor: '#1e3a8a'
    },
    colors: ['white'],
    legend: { position: 'none' },
    hAxis: {
      textStyle: { color: 'white', fontSize: 8 },
      gridlines: { color: 'transparent' }
    },
    vAxis: {
      textStyle: { color: 'white', fontSize: 8 },
      gridlines: { color: '#334155' },
      minValue: 0,
      maxValue: 100
    },
    lineWidth: 2,
    pointSize: 5,
    pointShape: 'circle'
  };

  const handleWarningOk = () => {
    setShowWarning(false);
  };

  return (
    <div
      className="w-full h-full relative"
      style={{
        background: "linear-gradient(135deg, #192738 0%, #273c52 100%)",
      }}
    >
      {/* Approval Rating Graph */}
      <div className="absolute top-8 left-8 z-10">
        <div className="bg-gray-900/80 rounded shadow-lg w-80 h-64 p-3 relative">
          {/* Title */}
          <div className="text-white text-sm mb-2 font-bold">Approval Rating</div>
          
          {/* Chart tabs */}
          <div className="flex gap-2 mb-2">
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 1</button>
            <button className="px-2 py-1 bg-blue-500 text-white text-[9px] rounded-sm">Today</button>
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 3</button>
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 4</button>
          </div>
          
          {/* Chart area */}
          <div className="relative h-44 bg-blue-950 border border-blue-800 rounded-sm">
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="100%"
              data={approvalData}
              options={approvalOptions}
            />
          </div>
        </div>
      </div>

      {/* Integrity Map */}
      <div className="absolute top-8 right-8 z-10">
        <div className="bg-gray-900/80 rounded shadow-lg w-80 h-64 p-3 relative">
          {/* Title */}
          <div className="text-white text-sm mb-2 font-bold">Integrity Map</div>
          
          {/* Chart tabs */}
          <div className="flex gap-2 mb-2">
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 1</button>
            <button className="px-2 py-1 bg-blue-500 text-white text-[9px] rounded-sm">Today</button>
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 3</button>
            <button className="px-2 py-1 bg-blue-800/70 text-white text-[9px] rounded-sm">Day 4</button>
          </div>
          
          {/* Chart area */}
          <div className="relative h-44 bg-blue-950 border border-blue-800 rounded-sm">
            <Chart
              chartType="LineChart"
              width="100%"
              height="100%"
              data={integrityData}
              options={integrityOptions}
            />
          </div>
        </div>
      </div>

      {/* Warning Dialog (if needed) */}
      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-gray-700 rounded shadow-lg p-4 w-56">
            <div className="text-center mb-4">
              <div className="text-white text-[10px] mb-2 font-bold">Warning</div>
              <p className="text-white text-[9px]">You are being</p>
              <p className="text-white text-[9px]">watched</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleWarningOk}
                className="px-3 py-1 bg-gray-600 text-white text-[9px] hover:bg-gray-500 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Icons at bottom */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-8">
        {/* Pink Folder Icon */}
        <div
          className="flex flex-col items-center cursor-pointer hover:opacity-80 p-1"
          onClick={onNewsClick}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/icons/ic_folder.svg" alt="folder" className="w-12 h-12" />
          </div>
        </div>

        {/* Browser Icon */}
        <div
          className="flex flex-col items-center cursor-pointer hover:opacity-80 p-1"
          onClick={onNewsClick}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/icons/ic_news.svg" alt="news" className="w-12 h-12" />
          </div>
        </div>

        {/* Social Media Icon */}
        <div
          className="flex flex-col items-center cursor-pointer hover:opacity-80 p-1"
          onClick={onSocialMediaClick}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/icons/ic_shitter.svg" alt="social" className="w-12 h-12" />
          </div>
        </div>

        {/* Trash Icon */}
        <div
          className="flex flex-col items-center cursor-pointer hover:opacity-80 p-1"
          onClick={onTrashClick}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/icons/ic_trash.svg" alt="trash" className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopInterface;
