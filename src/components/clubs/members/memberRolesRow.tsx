import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/user/userAvatar'
import { decimalToRgb } from '@/helpers/helper'
import { ClubMember, ClubRole } from '@/types/club'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import RoleCheckboxDropdown from '@/components/clubs/roles/RoleCheckboxDropdown'
import useUserStore from '@/store/user'
import { hasPermission } from '@/helpers/permissions'
import useUserRolesStore from '@/store/useUserRoles'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Input } from '@/components/ui/input'

export type MemberRolesRowProps = {
	onUpdate: () => void
	member: ClubMember
	roles: ClubRole[]
	clubId: number | undefined
	addRoleMember: (roleId: number, memberId: number, clubId: number | undefined) => Promise<void>
}

function MemberRolesRow({
	onUpdate,
	member,
	roles,
	clubId,
}: MemberRolesRowProps & {
	addRoleMember: (roleId: number, memberId: number, clubId: number | undefined) => Promise<void>
}) {
	const [memberRoles, setMemberRoles] = useState<ClubRole[]>()
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const [loading] = useState(true)
	const { user } = useUserStore()
	const axiosAuth = useAxiosInterceptor()
	const roleFilter = (arr1: number[], arr2: ClubRole[]) => {
		const res: ClubRole[] = []
		for (let i = 0; i < arr1.length; i++) {
			for (let k = 0; k < arr2.length; k++) {
				if (arr2[k].id === arr1[i]) {
					res.push(arr2[k])
					break
				}
			}
		}
		return res
	}

	const addRoleMember = async (roleId: number, memberId: number, clubId: number) => {
		console.log(`roleId: ${roleId}, memberId: ${memberId}, clubId: ${clubId}`) // Add this line

		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}/roles/${roleId}/members`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({ members: [memberId] }),
			},
		)

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to add role member', { description: response.data.error })
			return
		}
		onUpdate()
	}

	const removeRoleMember = async (roleId: number, memberId: number, clubId: number) => {
		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}/roles/${roleId}/members`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({ members: [memberId] }),
			},
		)

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to remove role member', { description: response.data.error })
			return
		}
		onUpdate()
	}

	const [isKickDialogOpen, setIsKickDialogOpen] = useState(false)
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
	const [memberToKick, setMemberToKick] = useState<number | null>(null)
	const [memberToBan, setMemberToBan] = useState<number | null>(null)
	const [banReason, setBanReason] = useState('')

	const handleKickMember = (memberId: number) => {
		setMemberToKick(memberId)
		setIsKickDialogOpen(true)
	}

	const confirmKickMember = async () => {
		if (memberToKick !== null) {
			await kickMember(memberToKick, clubId || 0)
		}
		setIsKickDialogOpen(false)
	}

	const kickMember = async (memberId: number, clubId: number) => {
		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}/members/${memberId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to kick member', { description: response.data.error })
			return
		}
		onUpdate()
	}

	const handleBanMember = (memberId: number) => {
		setMemberToBan(memberId)
		setIsBanDialogOpen(true)
	}

	const confirmBanMember = async () => {
		if (typeof memberToBan === 'number' && typeof clubId === 'number') {
			await banMember(memberToBan, clubId, banReason)
		} else {
			console.error('Invalid clubId or memberId')
		}
		setIsBanDialogOpen(false)
		setBanReason('')
	}

	const banMember = async (memberId: number, clubId: number, banReason: string) => {
		const response = await axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubId}/members/${memberId}/ban`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({ reason: banReason || 'No reason provided' }),
			},
		)

		if (!response.status.toString().startsWith('2')) {
			toast.error('Failed to ban member', { description: response.data.error })
			return
		}
		onUpdate()
	}

	useEffect(() => {
		setMemberRoles(roleFilter(member.roles, roles))
	}, [member.roles, roles])

	const { permissions } = useUserRolesStore()

	if (!hasPermission(permissions, Permissions.ALL) && !loading) {
		return <Error statusCode={401} />
	}

	return (
		<TableRow
			key={member.id}
			onContextMenu={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
			onClick={(e) => {
				e.preventDefault()
				setIsContextMenuOpen(true)
			}}
		>
			<DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen} modal={true}>
				<TableCell>
					<UserAvatar user={member} />
				</TableCell>
				<TableCell>{member.first_name}</TableCell>
				<TableCell>{member.last_name}</TableCell>
				<TableCell>
					{memberRoles?.map((role) => (
						<>
							<p style={{ color: `${decimalToRgb(role.color)}` }}>{role.name}</p>
						</>
					))}
				</TableCell>
				<TableCell>{member.email}</TableCell>
				<TableCell>{member.barcode}</TableCell>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href={`/user/${member.id}`}>{member.first_name}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<RoleCheckboxDropdown
						roles={roles}
						assignRole={async (roleId, assign) => {
							if (assign) {
								await addRoleMember(roleId, member.id, clubId || 0)
							} else {
								await removeRoleMember(roleId, member.id, clubId || 0)
							}
						}}
						clubMember={member}
					/>
					{user?.id !== member.id && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleKickMember(member.id)}>
								<p style={{ color: 'orange' }}>Kick</p>
							</DropdownMenuItem>
							{hasPermission(permissions, Permissions.ban_member) && (
								<DropdownMenuItem onClick={() => handleBanMember(member.id)}>
									<p style={{ color: 'red' }}>Ban</p>
								</DropdownMenuItem>
							)}
						</>
					)}
				</DropdownMenuContent>
				<DropdownMenuTrigger></DropdownMenuTrigger>
			</DropdownMenu>
			<Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This will permanently kick the user from the club.
						</DialogDescription>
					</DialogHeader>
					<Button variant={'destructive'} onClick={confirmKickMember}>
						Yes, kick the user
					</Button>
					<Button onClick={() => setIsKickDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
			<Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>This will permanently ban the user from the club.</DialogDescription>
					</DialogHeader>
					<Input
						type="text"
						value={banReason}
						onChange={(e) => setBanReason(e.target.value)}
						placeholder="Enter ban reason"
					/>
					<Button variant={'destructive'} onClick={confirmBanMember}>
						Yes, ban the user
					</Button>
					<Button onClick={() => setIsBanDialogOpen(false)}>No, cancel</Button>
				</DialogContent>
			</Dialog>
		</TableRow>
	)
}

export default MemberRolesRow
