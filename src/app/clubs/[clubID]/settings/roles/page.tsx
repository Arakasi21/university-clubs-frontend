'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { decimalToRgb } from '@/helpers/helper'
import useClub from '@/hooks/useClub'
import { ClubRole } from '@/types/club'
import RolesDropdownMenu from '@/components/st/RolesDropdownMenu'
import Link from 'next/link'
import { useCallback } from 'react'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission, permissionsToStringArr } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'
import { Badge } from '@/components/ui/badge'
import useMemberRoles from '@/hooks/useMemberRoles'
import BackgroundClubImage from '@/components/st/BackgroundClubImage'

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const { club, isOwner, loading, fetchClubInfo } = useClub({
		clubID: params.clubID,
		user: user,
	})
	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	useMemberRoles({
		clubID: params.clubID,
		user: user,
		userStatus: memberStatus,
	})
	const { permissions, highestRole } = useUserRolesStore()

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

	const handleDeleteRole = useCallback(
		async (roleID: number) => {
			const apiUrl = `http://localhost:5000/clubs/${params.clubID}/roles/${roleID}`
			try {
				const response = await fetch(apiUrl, {
					method: 'DELETE',
					credentials: 'include',
				})

				if (!response.ok) {
					let errorData = await response.json()

					toast.error('Failed to delete role', {
						description: errorData.error,
					})
					return
				}

				fetchClubInfo()
				console.log('Role deleted successfully')

				toast.success('Role deleted!', {
					action: {
						label: 'X',
						onClick: () => {},
					},
				})
			} catch (e) {
				toast.error('ERROR', {
					description: 'An error occurred while trying to make request to delete role.',
				})
				console.log(e)
			}
		},
		[fetchClubInfo, params.clubID],
	)

	if (!hasPermission(permissions, Permissions.manage_roles) && !loading) {
		return <Error statusCode={401} />
	}

	return (
		<>
			<Nav />
			<BackgroundClubImage club={club} />
			<Tabs
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				defaultValue="all"
			>
				<div className="flex flex-wrap justify-center gap-6">
					<Link href={`/clubs/${club?.id}/settings`}>
						<Button variant={'outline'}>Return to settings</Button>
					</Link>
				</div>

				<TabsContent value="all">
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
											.sort((role, role2) => {
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
																onUpdateSuccess={() => fetchClubInfo()}
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
				</TabsContent>
			</Tabs>
		</>
	)
}

export default Page
