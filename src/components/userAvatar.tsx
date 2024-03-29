import React from 'react';
import {IUser} from "@/interface/user";
import {IClubMember} from "@/interface/club";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const UserAvatar = ({user}:{user:IUser|IClubMember}) => {
	return (
		<Avatar>
			<AvatarImage src={user?.avatar_url} alt={`${user?.first_name}'s profile picture`}/>
			<AvatarFallback>{user?.first_name.slice(0, 1)}</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;