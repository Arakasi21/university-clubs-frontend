import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { IClub, IClubMember } from '@/interface/club'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type HandleDialogProps = {
	selectedUser: IClubMember
	club: IClub
	onClose: () => void
	onHandle: (userID: number, status: 'approved' | 'rejected') => void
	isOpen: boolean
}

export default function HandleDialog({
	selectedUser,
	club,
	isOpen,
	onClose,
	onHandle,
}: HandleDialogProps) {
	const [user, setUser] = useState(selectedUser)

	useEffect(() => {
		setUser(selectedUser)
	}, [selectedUser])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription className="space-x-2 space-y-2">
						<Button
							onClick={() => {
								onHandle(user.id, 'approved')
							}}
						>
							Approve
						</Button>
						<Button
							onClick={() => {
								onHandle(user.id, 'rejected')
							}}
							variant="destructive"
						>
							Reject
						</Button>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
