import React from 'react'
import Link from 'next/link'
import UserAvatar from '@/components/user/userAvatar'
import { ClubMember } from '@/types/club' // replace with your actual User type

interface UserLinkProps {
	user: ClubMember
}

const UserLink: React.FC<UserLinkProps> = ({ user }) => {
	return (
		<Link
			href={`/user/${user.id}`}
			className="flex w-full flex-row items-center space-x-3.5 px-2"
			key={user.id}
		>
			<UserAvatar user={user} size={44} />
			<p
				style={{
					color: '#fff',
				}}
			>
				{user.last_name} {user.first_name}
			</p>
		</Link>
	)
}

export default UserLink
