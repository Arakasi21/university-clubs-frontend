import React from 'react'
import Nav from '@/components/NavBar'
import Posts from '@/app/explore/community/_components/Posts'
import Events from '@/app/explore/community/_components/Events'
import Clubs from '@/app/explore/community/_components/Clubs'

function Page() {
	return (
		<>
			<Nav />
			<div className="mx-44 grid h-screen grid-cols-[300px_1fr_300px]">
				<Events />

				<Posts />

				<Clubs />
			</div>
		</>
	)
}

export default Page
