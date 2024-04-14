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
import { ModeToggle } from '@/components/ui/toggle-mode'
import UserAvatar from '@/components/UserAvatar'
import { IUser } from '@/interface/user'
import { GavelIcon, LogOutIcon, PlusCircleIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const DropdownForLoggedIn = ({ user, logout }: { user: IUser; logout: () => void }) => {
	const router = useRouter()
	const canHandleNewClubs: boolean = user.role === 'ADMIN' || user.role === 'DSVR'
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex items-center space-x-2.5 ">
						<p>{user?.first_name}</p>
						<UserAvatar user={user} />
					</Button>
				</DropdownMenuTrigger>

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

						{canHandleNewClubs && (
							<DropdownMenuItem
								onClick={() => {
									router.push(`/clubs/handle`)
								}}
								className="flex flex-row space-x-4"
							>
								<GavelIcon />
								<p>Handle new Clubs</p>
							</DropdownMenuItem>
						)}
						<DropdownMenuItem
							onClick={(e) => {
								e.preventDefault()
							}}
						>
							<ModeToggle />
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
