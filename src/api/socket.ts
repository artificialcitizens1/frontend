import { io } from 'socket.io-client';

const URL = 'http://13.201.10.152';

export const socket = io(URL, {
    autoConnect: false
}); 