import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Club } from '@/types/club'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type HandleDialogProps = {
	selectedClub: Club
	onClose: () => void
	isOpen: boolean
}

export default function HandleDialog({ selectedClub, isOpen, onClose }: HandleDialogProps) {
	const [club, setClub] = useState(selectedClub)

	const onApprove = () => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ status: 'approved' }),
		})
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('failed to approve', {
						description: data.error,
					})
					return
				}

				toast.success('Approved!')
			})
			.catch((error) => console.log(error.message))
			.finally(() => {
				onClose()
			})
	}

	const onReject = () => {
		onClose()
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ status: 'rejected' }),
		})
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('failed to reject', {
						description: data.error,
					})
					return
				}

				toast.success('Rejected!')
			})
			.catch((error) => console.log(error.message))
			.finally(() => {
				onClose()
			})
	}

	useEffect(() => {
		setClub(selectedClub)
	}, [selectedClub])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription className="space-x-2 space-y-2">
						<Button onClick={onApprove}>Approve</Button>
						<Button onClick={onReject} variant="destructive">
							Reject
						</Button>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
