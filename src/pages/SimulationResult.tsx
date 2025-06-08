import { useEffect, useState } from "react";
import { getSimulationStatus } from "../api/simulationService";
import { useParams } from "react-router-dom";
import GodMode from "./GodMode";

export const SimulationResult = () => {
  const { simId } = useParams<{ simId: string }>();
  const [tick, setTick] = useState<number>(2);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSimulationData();
    }, 5000);
    return () => clearInterval(interval);
  }, [tick]);

  const fetchSimulationData = async () => {
    const response = await getSimulationStatus(tick, simId!);
    console.log('Simulation data:', response);
    if((response.simulation as unknown as any[]).length > 0){
      setTick((prevTick) => prevTick + 1);
    }
  }

  return (
    <div>
      <GodMode />
    </div>
  );
};
