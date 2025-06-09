import { socket } from '../api/socket';
import { useTickStore } from '../store/tickStore';
import { useSimulationStore } from '../store/simulationStore';
import { useEffect, useState, useCallback } from 'react';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const {currentTick, totalTicks, setTotalTicks} = useTickStore();
  const { addLog } = useSimulationStore();

  const onConnect = useCallback(() => {
    setIsConnected(true);
    console.log('✅ Connected to server:', socket.id);
  }, []);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    console.log('❌ Disconnected from server');
  }, []);

  const onCurrentTick = useCallback((data: any) => {
    console.log('currentTick event received:', data.data.currentTick);
    // if((totalTicks !== data.currentTick || (totalTicks === 1 && currentTick === 1)) && data.currentTick > totalTicks){
    //   setTotalTicks(data.totalTicks);
    // }
    if(data.data.currentTick > totalTicks){
      console.log('inside the socket if', data.data.currentTick, totalTicks);
      setTotalTicks(data.data.currentTick);
    }
  }, [totalTicks, setTotalTicks]);

  const onServerLog = useCallback((data: any) => {
    console.log('📋 serverLog event received:', data);
    try {
      // Add timestamp to the log if it doesn't have one
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      let logMessage;
      if (typeof data === 'string') {
        logMessage = data;
      } else if (data && typeof data === 'object') {
        // If it's an object, try to extract a message property or stringify it
        logMessage = data.message || data.log || JSON.stringify(data);
      } else {
        logMessage = String(data);
      }
      
      // Format the log with timestamp if it doesn't already have one
      const formattedLog = logMessage.includes('>>>') ? logMessage : `${timestamp} >>>${logMessage}`;
      console.log('📝 Adding formatted log:', formattedLog);
      addLog(formattedLog);
    } catch (error) {
      console.error('❌ Error processing serverLog:', error);
      // Fallback: add the raw data as string
      addLog(`${new Date().toLocaleTimeString()} >>>Error processing log: ${String(data)}`);
    }
  }, [addLog]);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('currentTick', onCurrentTick);
    socket.on('serverLog', onServerLog);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('currentTick', onCurrentTick);
      socket.off('serverLog', onServerLog);
      socket.disconnect();
    };
  }, [onConnect, onDisconnect, onCurrentTick, onServerLog]);

  return { isConnected, currentTick };
}; 