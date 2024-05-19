import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Club } from '@/types/club'
import { Separator } from '@/components/ui/separator'
import ClubImage from '@/components/st/ClubImage'
import React from 'react'

type DetailedClubDialogProps = {
	club: Club | null
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
}

export function DetailedClubDialog({ club, isOpen, onClose, onDelete }: DetailedClubDialogProps) {
	if (!club) return null

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-[825px]">
					<DialogHeader>
						<DialogTitle>{club.name}</DialogTitle>
						<DialogDescription>{club.club_type}</DialogDescription>
					</DialogHeader>
					<Card className="m-4 bg-muted/70">
						<CardHeader className="pb-3">
							<CardTitle className="text-center text-lg">{club.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-row items-center py-4">
								<ClubImage club={club} height={150} width={150} />
								<p className="py w-80 pl-10">{club.description || 'No description provided.'}</p>
							</div>
							<p className="py-4">Club Type: {club.club_type}</p>
							<Separator />
							<p className="py-4">Number of Members: {club.num_of_members}</p>
							<Separator />
						</CardContent>
					</Card>
					<DialogFooter>
						<Button variant={'destructive'} onClick={onDelete}>
							Delete Club
						</Button>
						<Button onClick={onClose}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
