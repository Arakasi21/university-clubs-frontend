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
import { Club } from '@/types/club'
import axios from 'axios'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import debounce from 'lodash.debounce'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { CollaboratorInvite } from '@/types/invite'
import useEventStore from '@/store/event'

interface InviteCollaboratorDialogProps {
	eventID: string
	fetchInvites: () => Promise<void>
	invitedClubs: CollaboratorInvite[]
}

const InviteCollaboratorDialog: React.FC<InviteCollaboratorDialogProps> = ({
	eventID,
	fetchInvites,
	invitedClubs,
}) => {
	const axiosAuth = useAxiosInterceptor()
	const { event } = useEventStore()

	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [pageNumber, setPageNumber] = useState(1)
	const [pageSize, setPageSize] = useState(25)
	const [hasMorePages, setHasMorePages] = useState(true)

	const [clubList, setClubList] = useState<Club[]>([])

	const searchClubs = useCallback(
		async (searchQuery: string) => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?query=${searchQuery}&page=${pageNumber}&page_size=${pageSize}`,
				)
				if (response.status === 200) {
					setClubList(response.data.clubs)
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

	const handleInvite = async (clubId: number) => {
		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventID}/collaborators`,
				{
					club_id: clubId,
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

	const fetchEvents = useCallback(
		debounce((query: string) => {
			searchClubs(query)
		}, 300),
		[],
	)

	const handlePageChange = useCallback(
		(newPage: any) => {
			setPageNumber(newPage)
			searchClubs(query)
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
		searchClubs(query)
	}, [])

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Invite Clubs</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Invite Clubs</DialogTitle>
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
									fetchEvents(e.target.value)
								}}
							/>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => {
									searchClubs(query)
								}}
							>
								<SearchIcon className="h-5 w-5" />
							</Button>
						</div>
					</div>
					<div className="space-y-4 py-4">
						<div className="grid gap-4">
							{clubList.map((club) => (
								<div className="flex items-center justify-between gap-4" key={club.id}>
									<div className="flex items-center gap-4">
										<Link href={`/clubs/${club.id}`}>
											<img
												src={club?.logo_url || '/main_photo.jpeg'}
												alt={club.name}
												className="w-10 rounded-full"
											/>
										</Link>
										<div>
											<div className="font-medium">{club.name} </div>
											<div className="overflow-hidden overflow-ellipsis text-sm text-gray-500 dark:text-gray-400">
												{club.description}
											</div>
										</div>
									</div>
									{event?.collaborator_clubs.find((collab) => collab.id === club.id) ? (
										<Button variant="outline" disabled>
											Already a collaborator
										</Button>
									) : invitedClubs.find((invite) => invite.club.id === club.id) ? (
										<Button variant="outline" disabled>
											Invited
										</Button>
									) : (
										<Button onClick={() => handleInvite(club.id)} variant="default" size="sm">
											Invite
										</Button>
									)}
								</div>
							))}
							{clubList.length === 0 && (
								<div className="text-center text-gray-500 dark:text-gray-400">No clubs found</div>
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

export default InviteCollaboratorDialog
