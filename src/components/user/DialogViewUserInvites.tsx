import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'
import usePendingUserInvites from '@/hooks/usePendingUserInvites'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
type DialogViewClubInvites = {
	userId: number | undefined
}

function DialogViewUserInvites({ userId }: DialogViewClubInvites) {
	const userIdNumber = userId ?? 0
	const {
		pendingUserInvites,
		eventInvites,
		fetchPendingUserInvites,
		setPendingUserInvites,
		setEventInvites,
	} = usePendingUserInvites(userIdNumber)
	const axiosAuth = useAxiosInterceptor()

	const handleAccept = async (inviteId: string) => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/invites/${inviteId}/handle`,
				{ method: 'POST', data: JSON.stringify({ action: 'accept' }) },
			)
			console.log(response.data)
			if (response.status.toString().startsWith('2')) {
				setPendingUserInvites(pendingUserInvites - 1)
				if (eventInvites) {
					setEventInvites(eventInvites.filter((invite) => invite.id !== inviteId))
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleReject = async (inviteId: string) => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/invites/${inviteId}/handle`,
				{ method: 'POST', data: JSON.stringify({ action: 'reject' }) },
			)
			console.log(response.data)
			if (response.status.toString().startsWith('2')) {
				setPendingUserInvites(pendingUserInvites - 1)
				if (eventInvites) {
					setEventInvites(eventInvites.filter((invite) => invite.id !== inviteId))
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">
					Invites{' '}
					{pendingUserInvites > 0 && (
						<span
							className={pendingUserInvites > 0 ? 'text-red-500' : ''}
						>{`(+${pendingUserInvites})`}</span>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Event Invites</DialogTitle>
					<DialogDescription>Review and respond to your upcoming event invites.</DialogDescription>
				</DialogHeader>
				{eventInvites && (
					<div className="space-y-3">
						{eventInvites.map((invite) => (
							<div className="grid gap-2 bg-gray-900" key={invite.id}>
								<div>
									{invite.event.collaborator_clubs.map((club) => (
										<div key={club.id}>
											<div className="grid grid-cols-[50px_1fr_auto] items-center rounded-lg border p-2">
												<div className="rounded-full">
													{invite.event.cover_images?.[0]?.url ? (
														<img
															src={invite.event.cover_images[0].url}
															alt={invite.event.title}
															className="h-10 w-10 rounded-full"
														/>
													) : (
														<div className="h-12 w-12 rounded-full bg-gray-700" />
													)}
												</div>
												<div className="flex-1 space-y-1">
													<p className="text-sm font-medium">{invite.event.title}</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">{club.name}</p>
												</div>

												<div className="flex gap-2">
													<Button
														size="sm"
														className="bg-gray-900 text-green-500"
														variant="outline"
														onClick={() => handleAccept(invite.id)}
													>
														Accept
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-red-500"
														onClick={() => handleReject(invite.id)}
													>
														Reject
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default DialogViewUserInvites
