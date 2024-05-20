import React, { useState } from 'react'
import GeneralSettings from '@/components/clubs/settings/GeneralSettings'
import BanSection from '@/components/clubs/settings/BanSection'
import PluginDirectory from '@/components/clubs/settings/PluginDirectory'
import DangerZone from '@/components/clubs/settings/DangerZone'
import useUserRolesStore from '@/store/useUserRoles'
import useClub from '@/hooks/useClub'
import useUserStore from '@/store/user'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Permissions } from '@/types/permissions'
import { toast } from 'sonner'
import { Club, ClubMember } from '@/types/club'

interface SettingsProps {
	memberPerms: Permissions
	club: Club
	onUpdate: () => void
	clubMembers: ClubMember[]
}

export default function Settings({ memberPerms, club, onUpdate, clubMembers }: SettingsProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const { permissions } = useUserRolesStore()
	const { user } = useUserStore()
	const { isOwner } = useClub({ clubID: club.id, user })
	const axiosAuth = useAxiosInterceptor()

	// redirect to main page
	const handleDeleteClub = async () => {
		const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})

		if (response.status.toString().startsWith('2')) {
			toast.success('Club deleted successfully')
			toast.info('Redirect to main page')
		} else {
			toast.error('Failed to delete club', { description: response.data.error })
		}
		setIsDeleteDialogOpen(false)
	}

	return (
		<div className="flex min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col gap-4 rounded-lg bg-muted/40 p-4 md:gap-8 md:p-10">
			<div className="mx-auto grid w-full max-w-6xl gap-2">
				<h1 className="text-3xl font-semibold">Settings</h1>
			</div>
			<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
				<GeneralSettings club={club} permissions={permissions} />
				<div className="grid gap-6">
					<BanSection clubID={club.id} permissions={permissions} />
					<PluginDirectory />
					<DangerZone
						isOwner={isOwner}
						isDeleteDialogOpen={isDeleteDialogOpen}
						setIsDeleteDialogOpen={setIsDeleteDialogOpen}
						handleDeleteClub={handleDeleteClub}
					/>
				</div>
			</div>
		</div>
	)
}
