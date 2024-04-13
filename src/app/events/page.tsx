import React from 'react'
import Nav from '@/components/nav'
import { Calendar } from '@/components/ui/calendar'

export default function Events() {
	return (
		<main>
			<Nav />

			<div>
				<h1>Below you can see upcoming events</h1>

				<div className="flex flex-wrap items-center justify-center gap-6 px-32 text-center">
					<Calendar />
				</div>
			</div>
		</main>
	)
}
