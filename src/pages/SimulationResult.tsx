import { useEffect, useState } from "react";
import { getSimulationStatus } from "../api/simulationService";
import { useParams } from "react-router-dom";

export const SimulationResult = () => {
  const { simId } = useParams<{ simId: string }>();
  const [tick, setTick] = useState<number>(2);

  useEffect(() => {
    fetchSimulationData();
  }, []);

  const fetchSimulationData = async () => {
    const response = await getSimulationStatus(tick, simId!);
    console.log('Simulation data:', response);
    if(response.simulation){
      setTick((prevTick) => prevTick + 1);
    }
  }

  return (
    <div>
      <h1>Simulation Result</h1>
    </div>
  );
};
