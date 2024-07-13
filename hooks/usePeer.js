
const { useState, useEffect,useRef } = require("react")
const usePeer = () =>{
    const [peer,setPeer] = useState(null); 
    const [myId,setMyId] = useState(''); // whenever we connects it gives the ID
    const isPeerSet = useRef(false) // peer jb set to 2-2 peer connect bcz dev server so usey handle
    useEffect(()=>{
        if(isPeerSet.current)return;
        isPeerSet.current = true;
        const initPeer = async () => {
            const Peer = (await import('peerjs')).default;
            const myPeer = new Peer();
            setPeer(myPeer);
            myPeer.on('open', (id) => {
                console.log(`your peer id is ${id}`);
                setMyId(id);
            });
        };
        initPeer();
    },[])

    return {
        peer,myId
    }
}
export default usePeer;