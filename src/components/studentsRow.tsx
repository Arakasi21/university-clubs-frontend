import { TableCell, TableRow } from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { useState } from 'react'
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

export type StudentsRowProps = {
	onUpdate: () => void
	student: User
}

function StudentsRow({ onUpdate, student }: StudentsRowProps) {
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
	const axiosAuth = useAxiosInterceptor()

	console.log('Rendering student:', student)

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
					<p>something</p>
				</DropdownMenuContent>
				<DropdownMenuTrigger></DropdownMenuTrigger>
			</DropdownMenu>
		</TableRow>
	)
}

export default StudentsRow
