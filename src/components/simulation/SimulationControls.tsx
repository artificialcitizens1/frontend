import { useParams } from "react-router-dom";
import { getSimulationStatus } from "../../api/simulationService";
import { useTickStore } from "../../store/tickStore";
import { useState } from "react";

function SimulationControls() {

  const { simId } = useParams<{ simId: string }>();
  const [localTick, setLocalTick] = useState(2);
  // const days = ['DAY 1', 'DAY 2', 'DAY 3', 'DAY 4'];
  const { currentTick, totalTicks, setCharactersData, setSubTick, setTickData, tickData, updateSystemTick } = useTickStore();

  const subTickTime = tickData?.map((subTickData) => subTickData.time) || ['Day 1'];
  console.log('tickData : ', tickData);
  console.log('subTickTime : ', subTickTime);

  const handleSubTickChange = (index : number) => {
    setSubTick(index as 0 | 1);
    setCharactersData(tickData![index].characters)
  }

  const handleNextSim = () => {
    console.log('sim tick ', localTick);
    fetchSimulationData(localTick);
  }

  const fetchSimulationData = async (tickNumber : number) => {
    const response = await getSimulationStatus(tickNumber, simId!);
    console.log('tick ', tickNumber, ' data:', response);
    if(response.length > 0){
      updateSystemTick(tickNumber, response);
      setCharactersData(response[0].characters);
      setLocalTick(localTick + 1);
    }
  }

  const isDisabled = () => {
    return currentTick < totalTicks;
  }

  const handleExpandMap = () => {
    console.log('sim tick 3');
    fetchSimulationData(3);
  }

  return (
    <div className="flex flex-col gap-2 mt-2 px-2">
      <div className="flex justify-center items-center gap-2 text-sm">
        {
          subTickTime?.map((dayTime, index) =>
            <button 
              key={dayTime} 
              className={`px-4 py-1 text-xs rounded-md bg-gray-700 active:bg-cyan-500 active:text-black transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed`}
              disabled={index === 0}
              onClick={() =>handleSubTickChange(index)}
            >
              {dayTime}
            </button>
          )}
      </div>
      <div className="flex justify-between items-center text-sm">
        <button 
          className="px-4 py-1 border-2 border-gray-600 rounded-md hover:bg-gray-700"
          onClick={handleExpandMap}
        >
          Tick 3
        </button>
        <button 
          className="px-4 py-1 border-2 border-gray-600 rounded-md hover:bg-gray-700"
          onClick={handleNextSim}
          // disabled={isDisabled()}
        >
          Next Tick
        </button>
      </div>
    </div>
  )
}

export default SimulationControls;