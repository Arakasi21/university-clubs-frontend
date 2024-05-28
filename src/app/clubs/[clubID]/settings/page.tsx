'use client'
import Nav from '@/components/NavBar'

import MemberRolesRow from '@/components/clubs/members/memberRolesRow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useClub from '@/hooks/useClub'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import useMemberRoles from '@/hooks/useMemberRoles'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import React, { useCallback } from 'react'
import { toast } from 'sonner'
import RolesTab from './_components/RolesTab'
import Settings from '@/app/clubs/[clubID]/settings/_components/Settings'
import { useDragDrop } from '@/hooks/useDragDrop'
import Link from 'next/link'
import Members from '@/app/clubs/[clubID]/settings/_components/Members'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Permissions } from '@/types/permissions'
import { hasPermission } from '@/helpers/permissions'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import EventsContent from '@/app/clubs/[clubID]/settings/_components/Events'
import ClubImage from '@/components/clubs/ClubImage'

// TODO MAKE CLUB INFO PATCH ( WRITE PATCH FOR UPDATING CLUB INFO )

function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const { club, clubMembers, fetchClubInfo, isOwner } = useClub({
		clubID: params.clubID,
		user: user,
	})
	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})
	const { permissions, highestRole } = useUserRolesStore()
	const axiosAuth = useAxiosInterceptor()
	const { handleDragStart, handleDragOver, handleDrop } = useDragDrop({ club, fetchClubInfo })
	const handleDeleteRole = useCallback(
		async (roleID: number) => {
			const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/roles/${roleID}`
			try {
				const response = await axiosAuth(apiUrl, {
					method: 'DELETE',
				})

				if (!response.status.toString().startsWith('2')) {
					toast.error('Failed to delete role', {
						description: response.data.error,
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
		[params.clubID, fetchClubInfo],
	)

	if (!club) {
		return <div>Club not found</div>
	}

	return (
		<main className="scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
			<Nav />
			<div className="absolute h-[320px] w-full overflow-hidden rounded-sm shadow-2xl shadow-[#020817]/40">
				<img
					className="z-1 h-full w-full object-cover object-center "
					height={600}
					src={club?.banner_url}
					style={{
						aspectRatio: '1920/600',
						objectFit: 'cover',
					}}
					width={1920}
				/>
				<div className="z-1 absolute inset-0 bg-gradient-to-b from-transparent/30 to-[#020817]/80" />
				<div className="z-1 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#020817]/90" />
			</div>
			<div className="relative z-30 max-w-6xl py-12 sm:p-12 md:mx-auto">
				<BackgroundClubImage club={club} />
				<div className=" rounded-lg bg-[#0c1125]">
					<div className="flex items-center justify-between gap-4 p-6">
						<div className="flex items-center">
							<div className="flex shrink-0 overflow-hidden rounded-full">
								<ClubImage club={club} width={84} height={84} />
							</div>
							<div className="pl-4">
								<CardTitle>{club?.name}</CardTitle>
								<CardDescription>{club?.description}</CardDescription>
							</div>
						</div>
					</div>
				</div>
				<Tabs className="grid flex-1 items-start py-2" defaultValue="settings">
					<TabsList className="grid w-full grid-cols-5 ">
						<Link
							className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3  text-xs font-medium ring-offset-background sm:text-sm"
							href={`/clubs/${club?.id}`}
						>
							Return
						</Link>
						{hasPermission(permissions, Permissions.ALL) ? (
							<TabsTrigger value="members" className="text-xs sm:text-sm">
								Members
							</TabsTrigger>
						) : (
							<TabsTrigger value="members" className="text-xs sm:text-sm" disabled>
								Members
							</TabsTrigger>
						)}

						{hasPermission(permissions, Permissions.manage_roles) ? (
							<TabsTrigger value="roles" className="text-xs sm:text-sm">
								Roles
							</TabsTrigger>
						) : (
							<TabsTrigger value="roles" className="text-xs sm:text-sm" disabled>
								Roles
							</TabsTrigger>
						)}
						{hasPermission(permissions, Permissions.manage_events) ? (
							<TabsTrigger value="events" className="text-xs sm:text-sm">
								Events
							</TabsTrigger>
						) : (
							<TabsTrigger value="events" className="text-xs sm:text-sm" disabled>
								Events
							</TabsTrigger>
						)}
						{hasPermission(permissions, Permissions.ALL) ? (
							<TabsTrigger value="settings" className="text-xs sm:text-sm">
								Settings
							</TabsTrigger>
						) : (
							<TabsTrigger value="settings" className="text-xs sm:text-sm" disabled>
								Settings
							</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="members" className="w-full overflow-x-auto ">
						<Members
							memberPerms={permissions}
							club={club}
							clubMembers={clubMembers}
							callbackfn={(member) => (
								<MemberRolesRow
									onUpdate={() => fetchClubInfo()}
									member={member}
									roles={club?.roles ?? []}
									clubId={club?.id ?? 0}
									key={member.id}
									addRoleMember={async () => {}}
								/>
							)}
						/>
					</TabsContent>

					<TabsContent value="roles" className="w-full overflow-x-auto">
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

					<TabsContent value="settings">
						<Settings />
					</TabsContent>

					<TabsContent value="events" className="w-full overflow-x-auto">
						<div>
							<Card>
								<CardContent style={{ backgroundColor: '#0D1525' }}>
									<EventsContent />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	)
}

export default Page
