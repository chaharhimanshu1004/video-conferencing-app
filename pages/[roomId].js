
import { useSocket } from "@/context/socket";
import { useEffect } from "react";
import usePeer from '@/hooks/usePeer'

const Room = () => {
    const socket = useSocket();
    const {peer,myId} = usePeer();
}

export default Room;