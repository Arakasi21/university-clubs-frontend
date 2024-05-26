import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import useClubStore from '@/store/club'

export default function DialogDeleteClub({
	open,
	onOpenChange,
	onAccept,
	onCancel,
}: {
	open: boolean
	onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void
	onAccept: () => void
	onCancel: () => void
}) {
	const { club } = useClubStore()
	const [clubName, setClubName] = useState('')

	const handleAccept = () => {
		if (clubName === club?.name) {
			onAccept()
		} else {
			alert('Incorrect club name')
		}
	}
	return (
		<div>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>This will permanently delete the club.</DialogDescription>
					</DialogHeader>
					<Input
						type="text"
						value={clubName}
						onChange={(e) => setClubName(e.target.value)}
						placeholder="Enter club name to confirm"
					/>
					<Button onClick={handleAccept} variant={'destructive'}>
						Yes, delete the club
					</Button>
					<Button onClick={onCancel}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</div>
	)
}
