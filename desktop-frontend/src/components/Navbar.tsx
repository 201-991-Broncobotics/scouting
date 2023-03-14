import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <div className='flex flex-row justify-between text-2xl text-blue-800'>
      <Link to='/'>Home</Link>
      <Link to='/newComp'>new competition</Link>
      <Link to='/createSchema'>create schema</Link>
    </div>
  );
}
