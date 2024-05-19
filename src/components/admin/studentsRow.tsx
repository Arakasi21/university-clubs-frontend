import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/user/userAvatar'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { User } from '@/types/user'
import AdminRoleCheckboxDropdown, { UserRole } from '@/components/admin/AdminRolesDropdownMenu'

export type StudentsRowProps = {
	onUpdate: () => void
	student: User
}

function StudentsRow({ onUpdate, student }: StudentsRowProps) {
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const axiosAuth = useAxiosInterceptor()

	const roles: UserRole[] = ['ADMIN', 'MODER']

	const assignRole = async (role: UserRole, assign: boolean) => {
		try {
			const roleToAssign = assign ? role : 'USER'
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${student.id}/roles?role=${roleToAssign}`

			const response = await axiosAuth.patch(url)

			if (!response.status.toString().startsWith('2')) {
				console.error('Failed to update role:', response.data.error)
				return
			}

			onUpdate()
		} catch (error) {
			console.error('Error updating role:', error)
		}
	}

	useEffect(() => {
		onUpdate()
	}, [])

	const getRoleColor = (role: UserRole) => {
		switch (role) {
			case 'DSVR':
				return 'text-red-600'
			case 'ADMIN':
				return 'text-blue-300'
			case 'MODER':
				return 'text-yellow-500'
			default:
				return ''
		}
	}

	return (
		<TableRow
			key={student.id}
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
					<UserAvatar user={student} />
				</TableCell>
				<TableCell>
					{student.role !== 'USER' && (
						<span className={`font-bold ${getRoleColor(student.role as UserRole)}`}>
							{student.role}
						</span>
					)}{' '}
					{student.first_name}
				</TableCell>
				<TableCell>{student.last_name}</TableCell>
				<TableCell>{student.email}</TableCell>
				<TableCell>{student.barcode}</TableCell>
				<TableCell>{student.major}</TableCell>
				<TableCell>{student.group_name}</TableCell>
				<TableCell>{student.year}</TableCell>

				<DropdownMenuContent>
					<DropdownMenuItem>
						<Link href={`/user/${student.id}`}>{student.first_name}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<AdminRoleCheckboxDropdown
						roles={roles}
						assignRole={assignRole}
						userRoles={student.role !== 'USER' ? [student.role as UserRole] : []}
					/>
					<DropdownMenuSeparator />
					<p>Additional actions can be added here.</p>
				</DropdownMenuContent>
				<DropdownMenuTrigger />
			</DropdownMenu>
		</TableRow>
	)
}

export default StudentsRow
