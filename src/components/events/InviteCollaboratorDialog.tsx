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

interface InviteCollaboratorDialogProps {
	eventID: string
	fetchInvites: () => Promise<void>
}

const InviteCollaboratorDialog: React.FC<InviteCollaboratorDialogProps> = ({
	eventID,
	fetchInvites,
}) => {
	const [open, setOpen] = useState(false)
	const [clubId, setClubId] = useState<number | null>(null)
	const axiosAuth = useAxiosInterceptor()

	const handleInvite = async () => {
		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventID}/collaborators`,
				{
					club_id: clubId,
				},
			)

			if (response.status === 204) {
				toast.success('Invite sent successfully')
				await fetchInvites()
				setOpen(false)
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
					<Button className="ml-auto">Invite Club</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite Club Collaborator</DialogTitle>
					</DialogHeader>
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

export default InviteCollaboratorDialog
