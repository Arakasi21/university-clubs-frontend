import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import DialogDeleteClub from '@/components/clubs/settings/DialogDeleteClub'

interface DangerZoneProps {
	isOwner: boolean
	isDeleteDialogOpen: boolean
	setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
	handleDeleteClub: () => Promise<void>
}

export default function DangerZone({
	isOwner,
	isDeleteDialogOpen,
	setIsDeleteDialogOpen,
	handleDeleteClub,
}: DangerZoneProps) {
	return (
		<Card className="border-red-900">
			<CardHeader>
				<CardTitle>Danger Zone</CardTitle>
				<CardDescription className="pb-2">
					By proceeding, you acknowledge that you fully understand the implications of this action
					and accept all consequences associated with it.
				</CardDescription>
				<Separator />
				<div className="flex items-center py-2">
					<Label className="text-sm text-muted-foreground">Transfer ownership of the club</Label>
					<Button
						className="ml-auto text-red-500 hover:bg-red-500 hover:text-white"
						variant="secondary"
						disabled={!isOwner}
					>
						Transfer
					</Button>
				</div>
				<Separator />
				<div className="flex items-center py-2">
					<Label className="text-sm text-muted-foreground">Delete Club</Label>
					<Button
						className="ml-auto text-red-500 hover:bg-red-500 hover:text-white"
						variant="secondary"
						disabled={!isOwner}
						onClick={() => setIsDeleteDialogOpen(true)}
					>
						Delete Club
					</Button>
				</div>
			</CardHeader>
			<DialogDeleteClub
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onClick={handleDeleteClub}
				onClick1={() => setIsDeleteDialogOpen(false)}
			/>
		</Card>
	)
}
