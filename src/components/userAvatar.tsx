import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClubMember } from '@/types/club'
import { User } from '@/types/user'

const UserAvatar = ({ user }: { user: User | ClubMember }) => {
	return (
		<Avatar>
			<AvatarImage src={user?.avatar_url} alt={`${user?.first_name}'s profile picture`} />
			<AvatarFallback>{user?.first_name.slice(0, 1)}</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar
