import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This will permanently delete the club.</DialogDescription>
				</DialogHeader>
				<Button onClick={onAccept} variant={'destructive'}>
					Yes, delete the club
				</Button>
				<Button onClick={onCancel}>No, cancel</Button>
			</DialogContent>
		</Dialog>
	)
}
