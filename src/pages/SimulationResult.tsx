import { useState } from 'react';
import { PoliticalMap } from '../components/simulation/PoliticalMap';
import { SimulationControls } from '../components/simulation/SimulationControls';
import { EventControls } from '../components/simulation/EventControls';

type SimulationSpeed = 0.25 | 0.5 | 1 | 1.5 | 2;
type SimulationDay = 1 | 2 | 3 | 4;

interface SimulationState {
  isPaused: boolean;
  speed: SimulationSpeed;
  currentDay: SimulationDay;
  events: {
    earthquake: boolean;
    scandal: boolean;
    stockCrash: boolean;
    assassination: boolean;
  };
}

export const SimulationResult = () => {
  const [simulation, setSimulation] = useState<SimulationState>({
    isPaused: false,
    speed: 1,
    currentDay: 1,
    events: {
      earthquake: false,
      scandal: false,
      stockCrash: false,
      assassination: false,
    }
  });

  const handleSpeedChange = (speed: SimulationSpeed) => {
    setSimulation(prev => ({ ...prev, speed }));
  };

  const handlePlayPause = () => {
    setSimulation(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleEvent = (event: keyof SimulationState['events']) => {
    setSimulation(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: true
      }
    }));

    // Reset the event after some time
    setTimeout(() => {
      setSimulation(prev => ({
        ...prev,
        events: {
          ...prev.events,
          [event]: false
        }
      }));
    }, 5000);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#131B39] to-[#0F1322] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <img 
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-top"
        />
        <img 
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 scale-75 origin-bottom"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8 p-8">
        {/* Speed Controls */}
        <SimulationControls 
          speed={simulation.speed}
          isPaused={simulation.isPaused}
          onSpeedChange={handleSpeedChange}
          onPlayPause={handlePlayPause}
        />

        {/* Political Map */}
        <div className="relative w-[1000px] aspect-[4/3] bg-[#1A1A1A] rounded-lg border border-[#304FFE]/30 p-6">
          <PoliticalMap 
            currentDay={simulation.currentDay}
            events={simulation.events}
            isPaused={simulation.isPaused}
            speed={simulation.speed}
          />
        </div>

        {/* Event Controls */}
        <EventControls 
          events={simulation.events}
          onTriggerEvent={handleEvent}
        />
      </div>
    </div>
  );
}; 