import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getSchema, wrapBackend } from "../lib/types";

function App() {
  const pitSchema = useQuery({
    queryFn: () => (() => typeof window === "undefined" ? null : getSchema("PIT")),
    queryKey: ["pit",]
  })
  return <div className='text-red-500 text-4xl '>
    <p>{JSON.stringify(pitSchema.data)}</p>

  </div>;
}

