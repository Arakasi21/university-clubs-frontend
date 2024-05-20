import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Club, ClubMember } from '@/types/club'

function DialogClubOwnershipTransfer(userId, clubId, memberId) {
	return (
		<div>
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
		</div>
	)
}

export default DialogClubOwnershipTransfer
