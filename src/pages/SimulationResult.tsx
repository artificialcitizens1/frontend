// import { useEffect, useState } from "react";
// import { getSimulationStatus } from "../api/simulationService";
// import { useParams } from "react-router-dom";
import GodMode from "./GodMode";
import { useTickStore } from "../store/tickStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const SimulationResult = () => {

  const {showWinnerDetails} = useTickStore();

  const navigate = useNavigate();

  useEffect(() => {
    if(showWinnerDetails){
      navigate('election-result');
    }
  },[showWinnerDetails])

  // const { simId } = useParams<{ simId: string }>();
  // const [tick, setTick] = useState<number>(2);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchSimulationData();
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  // const fetchSimulationData = async () => {
  //   const response = await getSimulationStatus(tick, simId!);
  //   console.log('Simulation data:', response);
  //   if(response.length > 0){
  //     setTick((prevTick) => prevTick + 1);
  //   }
  // }

  return (
    <div>
      <GodMode />
    </div>
  );
};
