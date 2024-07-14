
import { useSocket } from "@/context/socket";
import { useEffect } from "react";
import usePeer from '@/hooks/usePeer'
import useMediaStream from "@/hooks/useMediaStream";
import Player from "../components/Player";
import usePlayer from "../hooks/usePlayer";
const Room = () => {
    const socket = useSocket();
    const {peer,myId} = usePeer();
    const {stream} = useMediaStream();
    const {players,setPlayers} = usePlayer(myId); // why didn't we get the myId by calling hook, -- >>bcz hooks create a new instance whenever they are created and hence same myId ni rehti phir -- > can fix this by creating a global context

    useEffect(()=>{
        if(!socket || !peer || !stream)return;
        const handleUserConnected = (newUser)=>{
            console.log(`a new user connected with userId ${newUser}`)
            const call = peer.call(newUser,stream);
            call.on('stream',(incomingStream)=>{
                console.log(`incoming stream from ${newUser}`)
                setPlayers((prev)=>({
                    ...prev,
                    [newUser]:{
                        url:incomingStream,
                        muted : false,
                        playing : true,
                    }
                }))
            })
        }
        socket.on('user-connected',handleUserConnected);
        return () =>{
            socket.off('user-connected',handleUserConnected);
        }
    },[peer,setPlayers,socket,stream])

    useEffect(()=>{
        if(!peer || !stream)return;
        peer.on('call',(call)=>{
            const {peer : callerId} = call; // caller ki id le liya -- peer naam se ni lera coz peer pehle se upr define, uska naam change krke callerId kr diya
            call.answer(stream); // send back your stream when you answer the call
            call.on('stream',(incomingStream)=>{
                console.log(`incoming stream from ${callerId}`)
                setPlayers((prev)=>({
                    ...prev,
                    [callerId]:{
                        url:incomingStream,
                        muted : false,
                        playing : true,
                    }
                }))
            })
        })

    },[peer,setPlayers,stream])

    useEffect(()=>{
        if(!stream || !myId )return;
        console.log(`setting my stream ${myId}`)
        setPlayers((prev)=>({
            ...prev,
            [myId]:{
                url:stream,
                muted : false,
                playing : true,
            }
        }))

    },[myId,setPlayers,stream]);


    return (
        <div>
            {
                Object.keys(players).map((playerId)=>{
                    const {url,muted,playing} = players[playerId];
                    return <Player key={playerId} url={url} muted={muted} playing={playing} />
                })
            }
        </div>
    )
}

export default Room;