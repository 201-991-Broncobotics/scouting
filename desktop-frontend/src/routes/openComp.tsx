import { useQuery } from "@tanstack/react-query";
import { Button } from "ui";
import { deleteComp, getComps, getOpenComp, openComp } from "../lib/types";

export default function CompList() {

  const openCompQuery = useQuery({
    queryKey: ["openComp"],
    queryFn: getOpenComp,
    refetchInterval: 100,
  })
  const allComps = useQuery({
    queryKey: ["allComps"],
    queryFn: getComps,
    refetchInterval: 100,
  })

  if (openCompQuery.isLoading || allComps.isLoading) return <p>Loading...</p>
  if (openCompQuery.isError || allComps.isError) return <p>Error L bozo </p>

  return <div>
    <p>Open comp name : {openCompQuery.data?.name}</p>

    {allComps.data.map(comp => {
      return <div key={comp.name} className="flex flex-row gap-3">
        <p>name: {comp.name}</p>
        <Button variant="secondary" onClick={() => openComp(comp.name)} > Open {comp.name} </Button>
        <Button variant="danger" onClick={() => deleteComp(comp.name)}> Delete {comp.name} </Button>
      </div>
    })}

  </div>
}
