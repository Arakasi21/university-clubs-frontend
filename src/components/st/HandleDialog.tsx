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
import { useAxiosInterceptor } from '@/helpers/fetch_api'

export type HandleDialogProps = {
	selectedClub: Club
	onClose: () => void
	isOpen: boolean
}

export default function HandleDialog({ selectedClub, isOpen, onClose }: HandleDialogProps) {
	const [club, setClub] = useState(selectedClub)
	const axiosAuth = useAxiosInterceptor()
	const onApprove = () => {
		axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`, {
			method: 'POST',
			data: JSON.stringify({ status: 'approved' }),
		})
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error('failed to approve', {
						description: res.data.error,
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
		axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`, {
			method: 'POST',
			data: JSON.stringify({ status: 'rejected' }),
		})
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error('failed to reject', {
						description: res.data.error,
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
