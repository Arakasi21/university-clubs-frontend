'use client'
import React, { useCallback, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import DialogDeleteClub from '@/components/clubs/settings/DialogDeleteClub'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import DialogClubOwnershipTransfer from '@/components/clubs/settings/DialogClubOwnershipTransfer'
import { useRouter } from 'next/navigation'

export default function DangerZone() {
	const clubStore = useClubStore()
	const { club, isOwner } = clubStore

	const router = useRouter()

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false)

	const axiosAuth = useAxiosInterceptor()

	// redirect to main page
	const handleDeleteClub = useCallback(async () => {
		const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}`, {
			method: 'DELETE',
		})

		if (response.status.toString().startsWith('2')) {
			toast.success('Club deleted successfully')
			toast.info('Redirect to main page')
			router.replace('/')
		} else {
			toast.error('Failed to delete club', { description: response.data.error })
		}
		setIsDeleteDialogOpen(false)
	}, [club?.id])

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
						onClick={() => setIsTransferOwnershipDialogOpen(true)}
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
				onAccept={handleDeleteClub}
				onCancel={() => setIsDeleteDialogOpen(false)}
			/>
			<DialogClubOwnershipTransfer
				open={isTransferOwnershipDialogOpen}
				clubStore={clubStore}
				onOpenChange={setIsTransferOwnershipDialogOpen}
				onClick1={() => setIsTransferOwnershipDialogOpen(false)}
			/>
		</Card>
	)
}
