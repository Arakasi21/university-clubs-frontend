import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserAvatar from '@/components/user/userAvatar'
import Link from 'next/link'
import { decimalToRgb } from '@/helpers/helper'

const ClubMembersCard = ({ club, clubMembers }) => {
	const [numMembersToShow, setNumMembersToShow] = useState(10) // Display 10 members initially

	const handleNumMembersChange = (newNumMembers) => {
		setNumMembersToShow(newNumMembers)
	}

	return (
		<Card className="mt-8 bg-[#0c1125]">
			<CardHeader>
				<CardTitle>
					Club Members <span className="text-base"> - {club?.num_of_members}</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="grid gap-1"
					style={{
						gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', // Responsive grid
					}}
				>
					{clubMembers &&
						clubMembers.slice(0, numMembersToShow).map((member) => {
							const memberRole = club?.roles?.find((role) => role.id === member.roles[1])
							return (
								<div key={member.id} className="flex items-center gap-4">
									<UserAvatar user={member} />
									<div>
										<Link
											style={{
												color: `${decimalToRgb(memberRole?.color ?? 16777215)}`,
												textDecoration: 'none',
											}}
											href={`/user/${member.id}`}
											className="font-medium hover:underline"
										>
											{member.first_name}
										</Link>
										<p className="font-medium text-gray-400 text-muted-foreground">
											{memberRole ? memberRole?.name : 'Member'}
										</p>
									</div>
								</div>
							)
						})}
				</div>
			</CardContent>
		</Card>
	)
}

export default ClubMembersCard
