import { useState } from "react"
import {cloneDeep} from 'lodash'


const usePlayer = (myId) =>{ // why didn't we get the myId by calling hook, -- >>bcz hooks create a new instance whenever they are created and hence same myId ni rehti phir
    const [players,setPlayers] = useState({});
    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[myId];
    delete playersCopy[myId];
    const nonHighlightedPlayers = playersCopy;
    return {players,setPlayers,playerHighlighted,nonHighlightedPlayers};
}
export default usePlayer;