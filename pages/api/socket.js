import { Server } from "socket.io";

// we don't have the https server because nextjs handles it for us
const socketHandler = (req, res) => {
    if(res.socket.server.io) {
        console.log("Socket already running");
    }else{
        const io = new Server(res.socket.server); // circuit instance created
        res.socket.server.io = io;
        io.on("connection", (socket) => {
            console.log("server connected");
            socket.on('join-room',(roomId,userId)=>{
                console.log(`a user ${userId} joined the room ${roomId} `);
                socket.join(roomId);
                socket.broadcast.to(roomId).emit('user-connected',userId); // user connected msg to everyone in the room except myself

            })
        })
    }
    res.end();
}
export default socketHandler;
