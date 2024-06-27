
import { useSocket } from "@/context/socket";
import { useEffect } from "react";

export default function Home() {
  const socket = useSocket();
  useEffect(() => {
   socket?.on("connect", () => {
     console.log("Socket connected",socket.id);
   });
  },[socket]);
  return (
   <h1>Welcome to the video-conferencing-app</h1>
  );
}
