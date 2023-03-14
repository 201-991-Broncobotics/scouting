import { useQuery } from "@tanstack/react-query";
import { getSchema, wrapBackend } from "../lib/types";

export default function Home() {
  const pitSchema = useQuery({
    queryFn: () => (() => typeof window === "undefined" ? null : getSchema("PIT")),
    queryKey: ["pit",]
  })
  return <div className='text-red-500 text-4xl '>
    <p>{JSON.stringify(pitSchema.data)}</p>

QueryClientProvider   </div>;
}

