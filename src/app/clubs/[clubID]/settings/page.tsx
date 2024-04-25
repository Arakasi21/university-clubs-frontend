'use client'
import { DialogUpdateClubBanner } from '@/components/DialogUpdateClubBanner'
import { DialogUpdateClubLogo } from '@/components/DialogUpdateClubLogo'
import Nav from '@/components/NavBar'

import MemberRolesRow from '@/components/memberRolesRow'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import useClub from '@/hooks/useClub'
import Link from 'next/link'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'
import useMemberRoles from '@/hooks/useMemberRoles'
import BackgroundClubImage from '@/components/st/BackgroundClubImage'
import ClubImage from '@/components/st/ClubImage'
import React, { useCallback } from 'react'
import { ClubRole } from '@/types/club'
import { toast } from 'sonner'
import RolesTab from './_components/RolesTab'
import SettingsAndMembers from '@/app/clubs/[clubID]/settings/_components/SettingsAndMembers'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

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

	return (
		<>
			<Nav />
			<BackgroundClubImage club={club} />
			<Tabs
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				defaultValue="roles"
			>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="roles">Roles</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>
				<TabsContent value="roles">
					<RolesTab
						club={club}
						handleDragStart={handleDragStart}
						handleDragOver={handleDragOver}
						handleDrop={handleDrop}
						highestRole={highestRole}
						isOwner={isOwner}
						handleDeleteRole={handleDeleteRole}
						fetchClubInfo={fetchClubInfo}
					/>
				</TabsContent>
				<TabsContent value="members">{/*  */}</TabsContent>
				<TabsContent value="settings">{/* Settings content goes here */}</TabsContent>
			</Tabs>
		</>
	)
}

export default Page
