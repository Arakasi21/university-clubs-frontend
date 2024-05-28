import React, { useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

interface InviteOrganizerDialogProps {
	eventID: string
	fetchInvites: () => Promise<void>
}

export function InviteOrganizerDialog({ eventID, fetchInvites }: InviteOrganizerDialogProps) {
	const [userId, setUserId] = useState<number | null>(null)
	const [clubId, setClubId] = useState<number | null>(null)
	const axiosAuth = useAxiosInterceptor()

	const handleInvite = async () => {
		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventID}/organizers`,
				{
					user_id: userId,
					club_id: clubId,
				},
			)

			if (response.status === 204) {
				toast.success('Invite sent successfully')
				await fetchInvites()
			} else {
				toast.error('Failed to send invite')
			}
		} catch (error) {
			toast.error('Failed to send invite')
		}
	}

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="ml-auto">Invite Organizer</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite Organizer</DialogTitle>
					</DialogHeader>

					<label className="text-sm text-gray-400">Input user id</label>
					<Input
						className="mb-4"
						value={userId === null ? '' : userId}
						onChange={(e) => setUserId(e.target.value ? parseInt(e.target.value) : null)}
					/>
					<label className="text-sm text-gray-400">Input club id</label>
					<Input
						value={clubId === null ? '' : clubId}
						onChange={(e) => setClubId(e.target.value ? parseInt(e.target.value) : null)}
					/>
					<DialogFooter>
						<Button onClick={handleInvite}>Invite</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default InviteOrganizerDialog
