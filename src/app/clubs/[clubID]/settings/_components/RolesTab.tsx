'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { ClubRole } from '@/types/club'
import { decimalToRgb } from '@/helpers/helper'
import { permissionsToStringArr } from '@/helpers/permissions'
import { Badge } from '@/components/ui/badge'
import RolesDropdownMenu from '@/components/st/RolesDropdownMenu'
import React from 'react'

interface RolesTabProps {
	club: any
	handleDragStart: (e: React.DragEvent, role: ClubRole) => void
	handleDragOver: (e: React.DragEvent) => void
	handleDrop: (e: React.DragEvent, role: ClubRole) => void
	highestRole: any
	isOwner: any
	handleDeleteRole: (roleID: number) => Promise<void>
	fetchClubInfo: () => void
}

export default function RolesTab({
	club,
	highestRole,
	isOwner,
	handleDeleteRole,
	fetchClubInfo,
}: RolesTabProps) {
	const handleDragStart = (e: React.DragEvent, role: ClubRole) => {
		e.dataTransfer.setData(
			'application/my-app',
			JSON.stringify({ id: role.id, position: role.position }),
		)
		e.dataTransfer.dropEffect = 'move'
	}
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
	}
	const handleDrop = async (e: React.DragEvent, role: ClubRole) => {
		e.preventDefault()
		const draggedRole = JSON.parse(e.dataTransfer.getData('application/my-app'))
		const response = await fetch(`http://localhost:5000/clubs/${club?.id}/roles`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				roles: [
					{ id: draggedRole.id, position: role.position },
					{ id: role.id, position: draggedRole.position },
				],
			}),
		})
		if (response.ok) {
			fetchClubInfo()
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Club Roles</CardTitle>
				<CardDescription className="flex items-center justify-between">
					Manage club roles. You can edit roles, create new one, delete and etc.
					<Link href={`/clubs/${club?.id}/settings/roles/create`}>
						<Button variant={'default'}>Create new role</Button>
					</Link>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Permissions</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/*TODO закрепить member внизу*/}
						{club &&
							club.roles
								.sort((role: ClubRole, role2: ClubRole) => {
									if (role.name === 'member') return 1
									if (role2.name === 'member') return -1
									return role2.position - role.position
								})
								.map((role: ClubRole) => (
									<TableRow
										key={role.position}
										draggable={role.name !== 'member'}
										onDragStart={(e) => handleDragStart(e, role)}
										onDragOver={handleDragOver}
										onDrop={(e) => handleDrop(e, role)}
									>
										<TableCell>
											<p
												className="text-1xl"
												style={{
													color: `${decimalToRgb(role.color)}`,
												}}
											>
												{role.name}
											</p>
										</TableCell>
										<TableCell className="flex  flex-wrap">
											{role.permissions
												? permissionsToStringArr(role.permissions).map((p, index) => (
														<Badge
															key={index}
															variant={p.id === 'administrator' ? 'destructive' : 'default'}
															className="text-1xl mx-2.5 my-1.5 w-fit text-nowrap text-center"
														>
															{p.label}
														</Badge>
													))
												: 'Do not have any permissions'}
										</TableCell>
										{((highestRole?.position ?? 0) > role.position || isOwner) && (
											<TableCell>
												<RolesDropdownMenu
													role={role}
													club={club}
													onUpdateSuccess={fetchClubInfo}
													onClick={() => handleDeleteRole(role.id)}
												/>
											</TableCell>
										)}
									</TableRow>
								))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
