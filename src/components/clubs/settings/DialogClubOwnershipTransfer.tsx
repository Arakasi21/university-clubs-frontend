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
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This will give ownership to member you have chosen.
						</DialogDescription>
					</DialogHeader>
					{members.map((member) => (
						<div className="flex flex-row" key={member.id}>
							<UserAvatar user={member} />
							<p>{member.id}</p>
							<p>
								{member.first_name} {member.last_name}
							</p>
							<p>{member.barcode}</p>
							<p>{member.email}</p>
							<Button
								onClick={() => {
									setSelectedMember(member)
								}}
								disabled={member.id === user?.id}
							>
								{member.id == selectedMember?.id && <p>V</p>}
							</Button>
						</div>
					))}

					<Button
						onClick={() => {
							transferOwnership(selectedMember)
						}}
						variant={'destructive'}
					>
						Yes, transfer the ownership
					</Button>
					<Button onClick={onClick1}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</div>
	)
}
