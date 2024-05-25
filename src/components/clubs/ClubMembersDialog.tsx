import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import UserAvatar from '@/components/user/userAvatar'
import Link from 'next/link'
import { Club, ClubMember } from '@/types/club'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ClubMembersDialogProps {
	isOpen: boolean
	onClose: () => void
	club: Club | undefined
	clubMembers: ClubMember[] | undefined
}
const ClubMembersDialog = ({ isOpen, onClose, club, clubMembers }: ClubMembersDialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Club Members</DialogTitle>
					<DialogDescription>View the list of members of {club?.name}.</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-6 py-4 md:grid-cols-3 lg:grid-cols-5">
					{clubMembers?.map((member) => (
						<div key={member.id} className="flex flex-col items-center gap-1">
							<UserAvatar user={member} size={70} />
							<div>
								<div className="text-center">
									<div className="text-sm font-medium">
										<Link href={`/user/${member.id}`} className="hover:underline">
											{member.first_name}
										</Link>
									</div>
								</div>
								<p className="text-xs font-normal text-gray-400 text-muted-foreground">
									{/*{memberRole ? memberRole?.name : 'Member'}*/}
								</p>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ClubMembersDialog
