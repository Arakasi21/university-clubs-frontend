import React, { useCallback, useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { clubStore } from '@/store/club'
import { ClubMember } from '@/types/club'
import UserAvatar from '@/components/user/userAvatar'
import useUserStore from '@/store/user'
import axios from 'axios'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Check } from 'lucide-react'

export default function DialogClubOwnershipTransfer({
	open,
	clubStore,
	onOpenChange,
	onClick1,
}: {
	open: boolean
	clubStore: clubStore
	onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void
	onClick1: () => void
}) {
	const axiosAuth = useAxiosInterceptor()
	const { club } = clubStore
	const { user } = useUserStore()

	const [members, setMembers] = useState<ClubMember[]>([])
	const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null)
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

	const transferOwnership = async (member: ClubMember | null) => {
		if (!member) {
			toast.error('select member')
			return
		}

		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/ownership/${member.id}`,
			{
				method: 'PATCH',
			},
		)

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to fetch member join status', { description: response.data.error })
			return
		}

		toast.success('Approved!')
		setIsConfirmDialogOpen(false)
		onOpenChange(false)
	}

	const fetchMembers = useCallback(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/members?page=1&page_size=25`)
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error('not found', {
						description: res.data.error,
					})
					throw new Error(res.data.error || 'Failed to Fetch member roles ')
				}

				setMembers(res.data.members)
			})

			.catch((error) => console.log(error.message))
	}, [club?.id])

	useEffect(() => {
		fetchMembers()
	}, [club?.id, fetchMembers])

	return (
		<div>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[625px]">
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This will give ownership to member you have chosen.
						</DialogDescription>
					</DialogHeader>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>id</TableHead>
								<TableHead>ava</TableHead>
								<TableHead>name</TableHead>
								<TableHead>barcode</TableHead>
								<TableHead className="w-10">action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{members
								.sort((a, b) => a.id - b.id)
								.map((member) => (
									<TableRow key={member.id}>
										<TableCell>{member.id}</TableCell>
										<TableCell>
											<UserAvatar user={member} />
										</TableCell>
										<TableCell>
											{member.first_name} {member.last_name}
										</TableCell>
										<TableCell>{member.barcode}</TableCell>
										<TableCell>
											<Button
												className={`h-6 w-6  ${member.id == selectedMember?.id ? 'selected' : ''}`}
												onClick={() => {
													if (selectedMember?.id === member.id) {
														setSelectedMember(null) // Unselect the member if it's already selected
													} else {
														setSelectedMember(member) // Select the member
													}
												}}
												disabled={member.id === user?.id}
											>
												{member.id == selectedMember?.id && (
													<span>
														<Check className="w-3.5" />
													</span>
												)}
											</Button>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>

					<Button
						onClick={() => {
							setIsConfirmDialogOpen(true)
						}}
						variant={'destructive'}
					>
						Yes, transfer the ownership
					</Button>
					<Button onClick={onClick1}>No, cancel</Button>
				</DialogContent>
			</Dialog>

			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent className="w-[380px]">
					<DialogHeader>
						<DialogTitle>Are you 100% sure?</DialogTitle>
						<DialogDescription>
							This will give ownership to the member you have chosen.
						</DialogDescription>
					</DialogHeader>
					<Button
						onClick={() => {
							transferOwnership(selectedMember)
						}}
						variant={'destructive'}
					>
						Yes, I'm sure
					</Button>
					<Button onClick={() => setIsConfirmDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</div>
	)
}
