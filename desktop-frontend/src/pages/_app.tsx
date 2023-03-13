import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import "../styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}><Navbar /><Component {...pageProps} /></QueryClientProvider >
}
