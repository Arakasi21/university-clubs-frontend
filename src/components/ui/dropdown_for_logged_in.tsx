'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DarkThemeMenuToggle } from '@/components/ui/toggle-mode'
import UserAvatar from '@/components/user/userAvatar'
import { User } from '@/types/user'
import { LogOutIcon, PlusCircleIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import PendingClubsDropdownItem from '@/components/clubs/PendingClubsDropdownItem'
import DialogViewUserInvites from '@/components/user/DialogViewUserInvites'
import React from 'react'

const DropdownForLoggedIn = ({ user, logout }: { user: User; logout: () => void }) => {
	const router = useRouter()
	const canHandleNewClubs: boolean = user.role === 'ADMIN' || user.role === 'DSVR'

	return (
		<div>
			<DropdownMenu>
				<div className="flex flex-row">
					<DialogViewUserInvites userId={user?.id} />
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center space-x-2.5 transition duration-300 hover:bg-gray-200 dark:hover:bg-accent"
						>
							<p>{user?.first_name}</p>
							<UserAvatar user={user} size={44} />
						</Button>
					</DropdownMenuTrigger>
				</div>

				<DropdownMenuContent
					className="w-56"
					onSelect={(e) => {
						e.stopPropagation()
					}}
				>
					<DropdownMenuGroup
						onSelect={(e) => {
							e.stopPropagation()
						}}
					>
						<DropdownMenuItem
							onClick={() => {
								router.push(`/user/${user.id}`)
							}}
							className="flex flex-row space-x-4"
						>
							<UserRoundIcon />
							<p>Profile</p>
						</DropdownMenuItem>

						<DropdownMenuItem className="flex flex-row space-x-4">
							<SettingsIcon />
							<p>Settings</p>
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => {
								router.push(`/clubs/create`)
							}}
							className="flex flex-row space-x-4"
						>
							<PlusCircleIcon />
							<p>Create new Club</p>
						</DropdownMenuItem>

						{canHandleNewClubs && <PendingClubsDropdownItem />}
						<DropdownMenuItem
							onClick={(e) => {
								e.preventDefault()
							}}
						>
							<DarkThemeMenuToggle />
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={logout} className="flex flex-row space-x-4">
						<LogOutIcon />
						<p>Log out</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default DropdownForLoggedIn
