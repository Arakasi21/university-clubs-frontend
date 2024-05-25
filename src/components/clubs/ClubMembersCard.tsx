import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserAvatar from '@/components/user/userAvatar'
import Link from 'next/link'
import { decimalToRgb } from '@/helpers/helper'
import { Club, ClubMember, ClubRole } from '@/types/club'
import ClubMembersDialog from '@/components/clubs/ClubMembersDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ClubMembersCardProps {
	club: Club
	clubMembers: ClubMember[]
}

const ClubMembersCard: React.FC<ClubMembersCardProps> = ({ club, clubMembers }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const openClubMembersDialog = () => setIsDialogOpen(true)
	const closeDialog = () => setIsDialogOpen(false)

	const [numMembersToShow, setNumMembersToShow] = useState(10) // Display 10 members initially
	const handleNumMembersChange = (newNumMembers: number) => {
		setNumMembersToShow(newNumMembers)
	}
	return (
		<>
			<Card className="mt-8 bg-[#0c1125]">
				<CardHeader>
					<CardTitle onClick={openClubMembersDialog}>
						Club Members <span className="text-base"> - {club?.num_of_members}</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className="grid"
						style={{
							gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
							gridGap: '10px', // Responsive grid
						}}
					>
						{clubMembers &&
							clubMembers.slice(0, numMembersToShow).map((member) => {
								const memberRole = club?.roles?.find((role) => role.id === member.roles[1])
								return (
									<div key={member.id} className="flex items-center gap-2">
										<UserAvatar user={member} size={50} />
										<div>
											<Link
												style={{
													color: `${decimalToRgb(memberRole?.color ?? 9539985)}`,
													textDecoration: 'none',
												}}
												href={`/user/${member.id}`}
												className="font-medium hover:underline"
											>
												{member.first_name}
											</Link>
											<p className="text-xs font-normal text-gray-400 text-muted-foreground">
												{memberRole ? memberRole?.name : 'Member'}
											</p>
										</div>
									</div>
								)
							})}
					</div>
				</CardContent>
			</Card>
			<ClubMembersDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				club={club}
				clubMembers={clubMembers}
			/>
		</>
	)
}

export default ClubMembersCard
