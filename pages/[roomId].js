import { useSocket } from "@/context/socket";
import { useEffect, useState } from "react";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "../components/Player";
import usePlayer from "../hooks/usePlayer";
import styles from "@/styles/room.module.css";
import { useRouter } from "next/router";
import Bottom from "@/components/BottomSection";
import { cloneDeep } from "lodash";
import CopySection from "@/components/CopySection";
const Room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer); 
  // why didn't we get the myId by calling hook, -- >>bcz hooks create a new instance whenever they are created and hence same myId ni rehti phir -- > can fix this by creating a global context

  const [users, setUsers] = useState([]); 
  // whenever we disconnect a call, we need to remove the user from the users list, that's why we need to keep track of users 

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      console.log(`a new user connected with userId ${newUser}`);
      const call = peer.call(newUser, stream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
      });
      setUsers((prev) => ({
        ...prev,
        [newUser]: call, // we are storing the call object -- >> bcz we have to apply the close function on the call object
      }));
    };
    socket.on("user-connected", handleUserConnected);
    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  useEffect(() => {
    if (!socket) return;
    const handleUserToggledAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          muted: !prev[userId].muted,
        },
      }));
    };
    const handleUserToggledVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          playing: !prev[userId].playing,
        },
      }));
    };
    const handleUserLeave = (userId) => {
      console.log(`user with id ${userId} left the room`);
      users?.[userId]?.close(); // this close function exists on the call object, we are storing the call object in the array of users
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
     };
    socket.on("user-toggled-audio", handleUserToggledAudio);
    socket.on("user-toggled-video", handleUserToggledVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggled-audio", handleUserToggledAudio);
      socket.off("user-toggled-video", handleUserToggledVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [setPlayers, socket,users]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call; // caller ki id le liya -- peer naam se ni lera coz peer pehle se upr define, uska naam change krke callerId kr diya
      call.answer(stream); // send back your stream when you answer the call
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
      })
      setUsers((prev) => ({
        ...prev,
        [callerId]: call,
      }));
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isHighlighted
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isHighlighted={false}
            />
          );
        })}
      </div>
      <CopySection roomId={roomId} />
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
