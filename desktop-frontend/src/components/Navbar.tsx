import Link from "next/link";

export default function Navbar() {
	return <div className="flex flex-row justify-between text-2xl text-blue-800">
		<Link href="/">Home</Link>
		<Link href="/newComp">new competition</Link>
		<Link href="/createSchema">create schema</Link>
		<Link href="/pit">pit scout</Link>
		<Link href="/match">match scout</Link>

	</div>
}