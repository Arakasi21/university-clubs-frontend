import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
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
import AdminRoleCheckboxDropdown, { UserRole } from '@/components/st/AdminRolesDropdownMenu'

export type StudentsRowProps = {
	onUpdate: () => void
	student: User
}
function StudentsRow({ onUpdate, student }: StudentsRowProps) {
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const axiosAuth = useAxiosInterceptor()

	const roles: UserRole[] = ['ADMIN', 'MODER']

	// TODO WRITE USE EFFECT TO UPDATE STUDENT ROLES AND ETC...

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
				<TableCell>{student.first_name}</TableCell>
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
