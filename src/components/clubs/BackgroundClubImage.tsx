'use client'
import { Club } from '@/types/club'

export default function BackgroundClubImage(props: { club: Club | undefined }) {
	return (
		<div
			style={{ backgroundImage: `url(${props.club?.banner_url ?? '/main_photo.jpeg'})` }}
			className="h-52 w-full rounded-t-lg bg-cover bg-center"
		/>
	)
}
