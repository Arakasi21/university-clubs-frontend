import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { ClubRole } from '@/types/club'
import { decimalToRgb } from '@/helpers/helper'
import { permissionsToStringArr } from '@/helpers/permissions'
import { Badge } from '@/components/ui/badge'
import RolesDropdownMenu from '@/components/clubs/roles/RolesDropdownMenu'
import React from 'react'
import { DialogCreateClubRole } from '@/components/clubs/roles/DialogCreateClubRole'
import { useDragDrop } from '@/hooks/useDragDrop'

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
	const { handleDragStart, handleDragOver, handleDrop } = useDragDrop({ club, fetchClubInfo })
	return (
		<Card className="bg-muted/40 sm:m-12">
			<CardHeader className="flex gap-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center">
						<div>
							<CardTitle>Club Roles</CardTitle>
							<CardDescription className="flex items-center justify-between">
								Manage club roles. You can edit roles, create new one, delete and etc.
							</CardDescription>
						</div>
					</div>
					<div className="flex flex-row gap-3 ">
						<div className="flex gap-3">
							<DialogCreateClubRole club={club} onCreateSuccess={fetchClubInfo} />
						</div>
					</div>
				</div>
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
										key={role.id} // use unique id here
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
