import { useEffect,useState,useRef } from "react";

const useMediaStream = () =>{
    const [state,setState] = useState(null); // stream store
    const isStreamSet = useRef(false);

    useEffect(()=>{
        if(isStreamSet.current)return;
        isStreamSet.current = true;
        (async function initStream(){
            try{
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio:true,
                    video:true,
                })
                console.log("setting your stream");
                setState(stream);
            }catch(err){
                console.log("Error in media Navigator",err);
            }
        })()
    },[])
    return {
        stream : state,
    }

}
export default useMediaStream;