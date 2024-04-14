import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

function SideBar() {
	return (
		<div className="h-screen overflow-x-hidden overflow-y-scroll ">
			<Card className="w-100">
				<CardHeader>
					<CardTitle>Volunteer clubs</CardTitle>
					<CardDescription className="text-md">
						For someone who loves to help others
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Link href="/club_pages/volunteer_clubs/cooking_club">
						<p className="py-3 hover:text-blue-500">Cooking club</p>
					</Link>

					<Link href="/club_pages/volunteer_clubs/charity_club">
						<p className="py-3 hover:text-blue-500">AITU Charity</p>
					</Link>

					<Link href="/club_pages/volunteer_clubs/volunteer_club">
						<p className="py-3 hover:text-blue-500">AITU Volunteers</p>
					</Link>
				</CardContent>
			</Card>

			<Card className="w-100">
				<CardHeader>
					<CardTitle>Gaming clubs</CardTitle>
					<CardDescription>We think that descriptions are unnecessary</CardDescription>
				</CardHeader>

				<CardContent>
					<Link href="/">
						<p className="py-3 hover:text-blue-500">AITU Gaming club</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">Board Games</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">GameDev club</p>
					</Link>
				</CardContent>
			</Card>

			<Card className="w-100">
				<CardHeader>
					<CardTitle>For Athletes</CardTitle>
					<CardDescription>
						Do you like to win and love physical activity? Then we think these clubs will suit you
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Link href="/">
						<p className="py-3 hover:text-blue-500">Basketball</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">Volleyball</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">Football</p>
					</Link>
				</CardContent>
			</Card>

			<Card className="w-80">
				<CardHeader>
					<CardTitle>Dance & Music</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>

				<CardContent>
					<Link href="/">
						<p className="py-3 hover:text-blue-500">AITU Dance</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">KCA club</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">AITU Music</p>
					</Link>
				</CardContent>
			</Card>

			<Card className="w-100">
				<CardHeader>
					<CardTitle>Speaking clubs</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent className="text-lg">
					<Link href="/">
						<p className="py-3 hover:text-blue-500">SPQR</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">Debate club</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">Oratory club</p>
					</Link>

					<Link href="/">
						<p className="py-3 hover:text-blue-500">AITU Orchestra</p>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}

export default SideBar
