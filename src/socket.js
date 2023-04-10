import {io} from 'socket.io-client';


export const initSocket=async ()=>{
    const options={
        'force new connection':true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports:['websocket']
    }

    return io(process.env.REACT_APP_BACKEND_URL,options)
}

//io(process.env.REACT_APP_BACKEND_URL,options) this will return the instance of the socket.io-client so we can call the initSocket function to use the instance and we can emit the event and send the data