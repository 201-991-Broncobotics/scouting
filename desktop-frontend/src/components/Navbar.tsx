import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getOpenComp } from "../lib/backend";

export default function Navbar() {
  const openComp = useQuery({
    queryKey: ["openComp"],
    queryFn: getOpenComp,
    refetchInterval: 100,
  })
  return (<>
    <div className='flex flex-row justify-between text-2xl text-blue-800'>
      <Link to='/'>Home</Link>
      <Link to='/newComp'>competition stuff </Link>
      <Link to='/createSchema'>edit schema </Link>
    </div>
  </>
  );
}
