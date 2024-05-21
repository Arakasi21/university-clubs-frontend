import React from 'react'
import GeneralSettings from '@/components/clubs/settings/GeneralSettings'
import BanSection from '@/components/clubs/settings/BanSection'
import EventCreationComponent from '@/components/clubs/settings/EventCreationComponent'
import DangerZone from '@/components/clubs/settings/DangerZone'
import useUserRolesStore from '@/store/useUserRoles'
import useClubStore from '@/store/club'
import { Loader } from 'lucide-react'
import GetEventComponent from '@/components/clubs/settings/GetEventComponent'

export default function Settings() {
	const { club, isOwner } = useClubStore()
	const { permissions, highestRole } = useUserRolesStore()

	if (club == null) {
		return <Loader />
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
					<EventCreationComponent clubID={club.id} />
					<GetEventComponent />
					<DangerZone />
				</div>
			</div>
		</div>
	)
}
