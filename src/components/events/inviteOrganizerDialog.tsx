import React, { useCallback, useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import useEventStore from '@/store/event'
import { ClubMember } from '@/types/club'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Organizer } from '@/types/event'
import useUserStore from '@/store/user'
import { OrganizerInvite } from '@/types/invite'

interface InviteOrganizerDialogProps {
	eventID: string
	fetchInvites: () => Promise<void>
	organizerInvites: OrganizerInvite[]
}

export function InviteOrganizerDialog({
	eventID,
	fetchInvites,
	organizerInvites,
}: InviteOrganizerDialogProps) {
	const axiosAuth = useAxiosInterceptor()
	const { event } = useEventStore()
	const { user } = useUserStore()

	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [pageNumber, setPageNumber] = useState(1)
	const [pageSize, setPageSize] = useState(25)
	const [hasMorePages, setHasMorePages] = useState(true)
	const [currentOrganizer, setCurrentOrganizer] = useState<Organizer | null>(
		event?.organizers.find((organizer) => organizer.id === user?.id) || null,
	)

	const [userList, setUserList] = useState<ClubMember[]>([])

	const searchMembers = useCallback(
		async (searchQuery: string) => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${currentOrganizer?.club_id}/members?query=${searchQuery}&page=${pageNumber}&page_size=${pageSize}`,
				)
				if (response.status === 200) {
					setUserList(response.data.members)
					setHasMorePages(response.data.metadata.last_page > pageNumber)
				} else {
					toast.error('Failed to fetch clubs')
				}
			} catch (error) {
				toast.error('Failed to fetch clubs')
			}
		},
		[query, pageNumber, pageSize],
	)

	const handleInvite = async (userId: number) => {
		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventID}/organizers`,
				{
					user_id: userId,
					club_id: currentOrganizer?.club_id,
				},
			)

			if (response.status === 204) {
				toast.success('Invite sent successfully')
				await fetchInvites()
			} else {
				toast.error('Failed to send invite')
			}
		} catch (error) {
			toast.error('Failed to send invite')
		}
	}

	const fetchMembers = useCallback(
		debounce((query: string) => {
			searchMembers(query)
		}, 300),
		[],
	)

	const handlePageChange = useCallback(
		(newPage: any) => {
			setPageNumber(newPage)
			searchMembers(query)
		},
		[query],
	)

	const renderPaginationItems = () => {
		let pages: number[] = []
		if (pageNumber < 4) {
			pages = [1, 2, 3, 4].filter((pageNumber) => pageNumber <= pageNumber || hasMorePages)
		} else {
			pages = [pageNumber - 1, pageNumber, pageNumber + 1].filter(
				(pageNumber) => pageNumber <= pageNumber || (pageNumber === pageNumber + 1 && hasMorePages),
			)
		}
		return pages.map((pageNumber) => (
			<PaginationItem key={pageNumber}>
				<PaginationLink
					href="#"
					onClick={(e) => {
						e.preventDefault()
						handlePageChange(pageNumber)
					}}
					isActive={pageNumber === pageNumber}
				>
					{pageNumber}
				</PaginationLink>
			</PaginationItem>
		))
	}

	useEffect(() => {
		searchMembers(query)
		setCurrentOrganizer(event?.organizers.find((organizer) => organizer.id === user?.id) || null)
	}, [])

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className="ml-auto">Invite Users</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Invite Users</DialogTitle>
						<DialogDescription>Search for and invite clubs to your network.</DialogDescription>
					</DialogHeader>
					<div className="border-t pt-4">
						<div className="flex items-center gap-2">
							<Input
								className="flex-1"
								placeholder="Search for clubs..."
								type="search"
								onChange={(e) => {
									setQuery(e.target.value)
									setPageNumber(1)
									fetchMembers(e.target.value)
								}}
							/>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => {
									searchMembers(query)
								}}
							>
								<SearchIcon className="h-5 w-5" />
							</Button>
						</div>
					</div>
					<div className="space-y-4 py-4">
						<div className="grid gap-4">
							{userList.map((member) => (
								<div className="flex items-center justify-between gap-4" key={member.id}>
									<div className="flex items-center gap-4">
										<Link href={`/users/${member.id}`}>
											<img
												src={member?.avatar_url || '/main_photo.jpeg'}
												alt={member.first_name}
												className="w-14 rounded-full"
											/>
										</Link>
										<div>
											<div className="font-medium">
												{member.first_name} {member.last_name}{' '}
											</div>
										</div>
									</div>
									{event?.organizers.find((organizer) => organizer.id === member.id) ? (
										<Button disabled>Already Organizer</Button>
									) : organizerInvites.find((invite) => invite.user.id === member.id) ? (
										<Button disabled>Invite Pending</Button>
									) : (
										<Button onClick={() => handleInvite(member.id)}>Invite</Button>
									)}
								</div>
							))}
							{userList.length === 0 && (
								<div className="text-center text-gray-500 dark:text-gray-400">No users found</div>
							)}
						</div>
					</div>
					<DialogFooter className="border-t pt-4">
						<Pagination className="pt-4">
							<PaginationContent>
								<PaginationItem>
									{pageNumber > 1 && (
										<PaginationPrevious
											href="#"
											onClick={(e) => {
												e.preventDefault()
												handlePageChange(pageNumber - 1)
											}}
										/>
									)}
								</PaginationItem>
								{renderPaginationItems()}
								{hasMorePages && (
									<PaginationItem>
										<PaginationNext
											href="#"
											onClick={(e) => {
												e.preventDefault()
												handlePageChange(pageNumber + 1)
											}}
										/>
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default InviteOrganizerDialog
