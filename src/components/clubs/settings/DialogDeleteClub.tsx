import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function DialogDeleteClub(props: {
	open: boolean
	onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void
	onClick: () => Promise<void>
	onClick1: () => void
}) {
	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This will permanently delete the club.</DialogDescription>
				</DialogHeader>
				<Button onClick={props.onClick} variant={'destructive'}>
					Yes, delete the club
				</Button>
				<Button onClick={props.onClick1}>No, cancel</Button>
			</DialogContent>
		</Dialog>
	)
}
