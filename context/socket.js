import { io } from "socket.io-client";
import { createContext, useContext, useState, useEffect } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket =  useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const {children} = props;
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const connection = io(); // no need to provide URL, because its NEXTJS and it will automatically connect to the server
        console.log("Socket connection established", connection);
        setSocket(connection);
    }, []); 

    // Have to explicitely call the API to connect to the server, it will not connect automatically when the app is rendered
    // one way to do this is to call the API in the useEffect hook and call the api but new way is here -- 

    socket?.on("connect_error",async (error) => {
        console.log("Error stabilising the socket connection ", error);
        await fetch("/api/socket ");
    })  
      

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );

}