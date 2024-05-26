'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SearchAdmin from '@/components/admin/SearchAdmin'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import debounce from 'lodash.debounce'
import EventsRow, { EventsRowProps } from '@/components/admin/eventsRow'
import { EventFilters } from '@/types/event'
import { useRouter } from 'next/navigation'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

export default function Events() {
	const router = useRouter()
	const [events, setEvents] = useState<EventsRowProps['event'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [page, setPage] = useState(10)
	const [hasMorePages, setHasMorePages] = useState(true)
	const [filter, setFilter] = useState<EventFilters>({} as EventFilters)
	const axiosAuth = useAxiosInterceptor()

	function createQueryString(filters: EventFilters) {
		const params = new URLSearchParams()

		// Add each filter to the params only if it has a value
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined) {
				// Check if value is not undefined
				if (Array.isArray(value)) {
					// If the value is an array, add each item as a separate param
					value.forEach((item) => params.append(key, item))
				} else if (value instanceof Date) {
					// If the value is a Date, convert it to an ISO string
					params.append(key, value.toISOString())
				} else {
					// Otherwise, just add the value as a string
					params.append(key, value.toString())
				}
			}
		})

		return params.toString()
	}

	// /events/admin?&page=1&page_size=10&clubId=${filter?.clubId}&userId=${filter?.userId}&status${filter?.status}=&tags=${filter?.tags}&from_date=${filter?.from_date}&till_date=${filter?.till_date}&sort_by=${filter?.sort_by}&sort_order=${filter?.sort_order}`
	const fetchEvents = debounce((search, page, setEvents, setHasMorePages) => {
		axiosAuth
			.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/admin?page=1&page_size=10&type=&clubId=&userId=&status=&tags=`,
			)
			.then((response) => {
				console.log('Fetched events:', response.data.events)
				setEvents(response.data.events)
				setHasMorePages(response.data.events && response.data.events.length > 0)
			})
			.catch((error) => console.error('Error fetching events:', error))
	}, 300)

	useEffect(() => {
		fetchEvents(searchTerm, currentPage, setEvents, setHasMorePages)
	}, [searchTerm, currentPage])

	// useEffect(() => {
	// 	const queryString = createQueryString(filter)
	// 	router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/admin?${queryString}`, undefined)
	// }, [filter])

	const handleSearch = (value: string) => {
		setSearchTerm(value)
		setCurrentPage(1) // Reset to the first page on new search
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	const renderPaginationItems = () => {
		let pages: any[]
		if (currentPage < 2) {
			pages = [1, 2, 3].filter((pageNumber) => pageNumber <= currentPage || hasMorePages)
		} else {
			pages = [currentPage - 1, currentPage, currentPage + 1].filter(
				(pageNumber) =>
					pageNumber <= currentPage || (pageNumber === currentPage + 1 && hasMorePages),
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
					isActive={pageNumber === currentPage}
				>
					{pageNumber}
				</PaginationLink>
			</PaginationItem>
		))
	}
	return (
		<div>
			<Card className="bg-muted/40" x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle className="pb-4">Events</CardTitle>
					<SearchAdmin onSearch={handleSearch} />
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="hidden md:table-cell">ID</TableHead>
								<TableHead className="hidden md:table-cell">Title</TableHead>
								<TableHead className="hidden md:table-cell">Description</TableHead>
								<TableHead className="hidden md:table-cell">Start date</TableHead>
								<TableHead className="hidden md:table-cell">End date</TableHead>
								<TableHead className="hidden md:table-cell">Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{events.map((event) => (
								<EventsRow
									key={event.id}
									event={event}
									onUpdate={() => {
										fetchEvents(searchTerm, currentPage, setEvents, setHasMorePages)
									}}
								/>
							))}
						</TableBody>
					</Table>
					<Pagination className="pt-4">
						<PaginationContent>
							<PaginationItem>
								{currentPage > 1 && (
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault()
											handlePageChange(currentPage - 1)
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
											handlePageChange(currentPage + 1)
										}}
									/>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
				</CardContent>
			</Card>
		</div>
	)
}
