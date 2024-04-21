'use client'
import { Club } from '@/types/club'

export default function BackgroundClubImage(props: { club: Club }) {
	return (
		<div
			style={{ backgroundImage: `url(${props.club?.banner_url ?? '/main_photo.jpeg'})` }}
			className="relative h-40 w-screen bg-center bg-no-repeat"
		/>
	)
}
