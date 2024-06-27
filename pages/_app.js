import "@/styles/globals.css";

import { SocketProvider } from "@/context/socket";

// whenever the app is rendered, the socket connection is established

export default function App({ Component, pageProps }) { 
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  )
}
