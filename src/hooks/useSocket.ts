import { socket } from '../api/socket';
import { useTickStore } from '../store/tickStore';
import { useEffect, useState, useCallback } from 'react';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const {currentTick, totalTicks, setCurrentTick, setTotalTicks} = useTickStore();

  const onConnect = useCallback(() => {
    setIsConnected(true);
    console.log('connected to socket server');
  }, []);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    console.log('disconnected from socket server');
  }, []);

  const onCurrentTick = useCallback((data: any) => {
    // console.log('currentTick event received:', data);
    // if(totalTicks !== data.currentTick && data.currentTick > totalTicks){
    //   setTotalTicks(data.totalTicks);
    // }
  }, []);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('currentTick', onCurrentTick);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('currentTick', onCurrentTick);
      socket.disconnect();
    };
  }, [onConnect, onDisconnect, onCurrentTick]);

  return { isConnected, currentTick };
}; 