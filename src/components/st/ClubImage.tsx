import Image from 'next/image'
import { Club } from '@/types/club'

export default function ClubImage(props: { club: Club; width: number; height: number }) {
	return (
		<Image
			src={props.club?.logo_url ?? '/main_photo.jpeg'}
			width={props.width}
			height={props.height}
			alt={`banner of ${props.club?.name}`}
		/>
	)
}
