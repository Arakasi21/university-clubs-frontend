'use client'
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
	const [password, setPassword] = useState('') // State to hold the password

	const handleAccept = () => {
		if (password === 'expectedPassword') {
			// Replace 'expectedPassword' with the actual password
			onAccept()
		} else {
			alert('Incorrect password')
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
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password to confirm"
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
