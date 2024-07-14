
const { useState, useEffect,useRef } = require("react")
import {useSocket} from "@/context/socket";
import { useRouter } from "next/router";
const usePeer = () =>{
    const socket = useSocket();
    const roomId = useRouter().query.roomId;
    const [peer,setPeer] = useState(null); 
    const [myId,setMyId] = useState(''); // whenever we connects it gives the ID
    const isPeerSet = useRef(false) // peer jb set to 2-2 peer connect bcz dev server so usey handle
    useEffect(()=>{
        
        if(isPeerSet.current || !roomId || !socket)return;
        isPeerSet.current = true;
        const initPeer = async () => {
            const Peer = (await import('peerjs')).default;
            const myPeer = new Peer();
            setPeer(myPeer);
            myPeer.on('open', (id) => {
                console.log(`your peer id is ${id}`);
                setMyId(id);
                socket?.emit('join-room',roomId,id) // joined a room, send the roomId and peerId to other
            });
        };
        initPeer();
    },[roomId,socket])

    return {
        peer,myId
    }
}
export default usePeer;