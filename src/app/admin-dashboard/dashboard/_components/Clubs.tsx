'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import debounce from 'lodash.debounce'
import ClubsRow, { ClubsRowProps } from '@/components/admin/clubsRow'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import SearchAdmin from '@/components/admin/SearchAdmin'
import axios from 'axios'

export default function Clubs() {
	const [clubs, setClubs] = useState<ClubsRowProps['club'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [hasMorePages, setHasMorePages] = useState(true)

	const fetchClubs = debounce((search, page, setClubs, setHasMorePages) => {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/?query=${search}&page=${page}&page_size=10&club_types=`,
			)
			.then((response) => {
				console.log('Fetched clubs:', response.data.clubs)
				setClubs(response.data.clubs || [])
				setHasMorePages(response.data.clubs && response.data.clubs.length > 0)
			})
			.catch((error) => console.error('Error fetching clubs:', error))
	}, 300)

	useEffect(() => {
		fetchClubs(searchTerm, currentPage, setClubs, setHasMorePages)
	}, [searchTerm, currentPage])

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
					<CardTitle className="pb-4">Clubs</CardTitle>
					<SearchAdmin onSearch={handleSearch} />
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="hidden md:table-cell">Logo</TableHead>
								<TableHead className="hidden md:table-cell">Name</TableHead>
								<TableHead className="hidden md:table-cell">Description</TableHead>
								<TableHead className="hidden md:table-cell">Type</TableHead>
								<TableHead className="hidden md:table-cell">Members</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{clubs.map((club) => (
								<ClubsRow
									key={club.id}
									club={club}
									onUpdate={() => {
										fetchClubs(searchTerm, currentPage, setClubs, setHasMorePages)
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
