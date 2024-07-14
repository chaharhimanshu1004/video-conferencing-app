import { useState } from "react"

const usePlayer = (myId) =>{ // why didn't we get the myId by calling hook, -- >>bcz hooks create a new instance whenever they are created and hence same myId ni rehti phir
    const [players,setPlayers] = useState({});
    return {players,setPlayers};
}
export default usePlayer;