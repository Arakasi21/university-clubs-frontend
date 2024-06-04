'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EventsRow, { EventsRowProps } from '@/components/admin/eventsRow'
import debounce from 'lodash.debounce'
import SearchAdmin from '@/components/admin/SearchAdmin'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'

export default function Events() {
	const [events, setEvents] = useState<EventsRowProps['event'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [hasMorePages, setHasMorePages] = useState(true)
	const axiosAuth = useAxiosInterceptor()

	const fetchEvents = useCallback(
		debounce((search, status, page, updateEvents, updateHasMorePages) => {
			axiosAuth
				.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/admin`, {
					params: {
						query: search,
						status: status === 'ALL' ? undefined : status,
						page,
						page_size: 10,
					},
				})
				.then((response) => {
					updateEvents(response.data.events || [])
					updateHasMorePages(response.data.events && response.data.events.length > 0)
				})
				.catch((error) => console.error('Error fetching events:', error))
		}, 300),
		[],
	)

	useEffect(() => {
		fetchEvents(searchTerm, statusFilter, currentPage, setEvents, setHasMorePages)
		return () => {
			fetchEvents.cancel()
		}
	}, [searchTerm, statusFilter, currentPage, fetchEvents])

	const handleSearch = useCallback((value: any) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}, [])

	const handleStatusFilterChange = useCallback((value: any) => {
		setStatusFilter(value === 'ALL' ? null : value)
		setCurrentPage(1)
	}, [])

	const handlePageChange = useCallback((newPage: any) => {
		setCurrentPage(newPage)
	}, [])

	const renderPaginationItems = () => {
		let pages: any[]
		if (currentPage < 3) {
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
					<div className="flex space-x-4">
						<SearchAdmin onSearch={handleSearch} />
						<div>
							<Select onValueChange={handleStatusFilterChange} value={statusFilter || 'ALL'}>
								<SelectTrigger className="rounded border  px-4 py-2">
									<SelectValue placeholder="All Statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Status</SelectItem>
									<SelectItem value="DRAFT">Draft</SelectItem>
									<SelectItem value="PENDING">Pending</SelectItem>
									<SelectItem value="APPROVED">Approved</SelectItem>
									<SelectItem value="REJECTED">Rejected</SelectItem>
									<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="hidden md:table-cell">ID</TableHead>
								<TableHead className="hidden md:table-cell">Title</TableHead>
								<TableHead className="hidden md:table-cell">Description</TableHead>
								<TableHead className="hidden md:table-cell">Owner</TableHead>
								<TableHead className="hidden md:table-cell">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{events.map((event) => (
								<EventsRow
									key={event.id}
									event={event}
									onUpdate={() => {
										fetchEvents(searchTerm, statusFilter, currentPage, setEvents, setHasMorePages)
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
