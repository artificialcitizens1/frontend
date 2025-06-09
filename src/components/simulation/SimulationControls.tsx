import { useParams } from "react-router-dom";
import { getSimulationStatus, getWinnerDetails } from "../../api/simulationService";
import { useTickStore } from "../../store/tickStore";

function SimulationControls() {

  const { simId } = useParams<{ simId: string }>();
  
  const { 
    currentTick, 
    setCurrentTick, 
    totalTicks, 
    setCharactersData, 
    setSubTick, 
    tickData, 
    updateSystemTick,
    totalSimulationTicks,
    setShowWinnerDetails
  } = useTickStore();

  const handleNextSim = () => {
    console.log('current tick in sim controls : ', currentTick)
    const nextTick = currentTick + 1;
    setCurrentTick(nextTick);
    console.log('sim tick ', nextTick);
    fetchSimulationData(nextTick);
  }

  const fetchSimulationData = async (tickNumber : number) => {
    const response = await getSimulationStatus(tickNumber, simId!);
    console.log('tick ', tickNumber, ' data:', response);
    if(response.length > 0){
      updateSystemTick(tickNumber, response);
      setCharactersData(response[0].characters);
    }
    if(tickNumber === totalSimulationTicks){
      setShowWinnerDetails(true);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2 px-2">
      <div className="flex justify-center items-center text-sm">
        <button 
          className="px-8 py-3 text-base border-2 border-gray-600 rounded-md hover:bg-gray-700 disabled:cursor-not-allowed font-medium"
          onClick={handleNextSim}
          disabled={!(currentTick < totalTicks)}
        >
          Next Tick
        </button>
      </div>
    </div>
  )
}

export default SimulationControls;