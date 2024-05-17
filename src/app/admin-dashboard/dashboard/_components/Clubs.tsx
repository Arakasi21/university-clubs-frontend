'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import debounce from 'lodash.debounce'
import ClubsRow, { ClubsRowProps } from '@/components/clubsRow'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import SearchAdmin from '@/components/st/SearchAdmin'
import axios from 'axios'

export default function Clubs() {
	const [clubs, setClubs] = useState<ClubsRowProps['club'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	// const [totalPages, setTotalPages] = useState

	const fetchClubs = debounce((search, page, setClubs) => {
		axios
			.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs?page=1&page_size=25`)
			.then((response) => {
				console.log('Fetched clubs:', response.data.club)
				setClubs(response.data.club || [])
			})
			.catch((error) => console.error('Error fetching clubs:', error))
	}, 300)

	// const fetchClubs = debounce((search, page, setClubs) => {
	// 	console.log('Fetching clubs with search term:', search, 'and page:', page)
	// 	fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs?page=${page}&page_size=10`)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			console.log('Fetched students:', data.club)
	// 			setClubs(data.club || [])
	// 		})
	// 		.catch((error) => console.error('Error fetching students:', error))
	// }, 300)

	useEffect(() => {
		fetchClubs(searchTerm, currentPage, setClubs)

		return () => {
			fetchClubs.cancel()
		}
	}, [searchTerm, currentPage])

	const handleSearch = (value: string) => {
		setSearchTerm(value)
		setCurrentPage(1) // Reset to the first page on new search
	}

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	return (
		<div>
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle className="pb-4">Clubs</CardTitle>
					<SearchAdmin onSearch={handleSearch} />
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								{/*<TableHead className="hidden md:table-cell">Logo</TableHead>*/}
								<TableHead className="hidden md:table-cell">Name</TableHead>
								{/*<TableHead className="hidden md:table-cell">Description</TableHead>*/}
								{/*<TableHead className="hidden md:table-cell">Type</TableHead>*/}
								{/*<TableHead className="hidden md:table-cell">Members</TableHead>*/}
							</TableRow>
						</TableHeader>
						<TableBody>
							{clubs.map((club) => (
								<ClubsRow key={club.id} club={club} onUpdate={() => {}} />
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
							{[...Array(5)].map((_, index) => {
								const pageNumber = index + 1
								return (
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
								)
							})}
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={(e) => {
										e.preventDefault()
										handlePageChange(currentPage + 1)
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</CardContent>
			</Card>
		</div>
	)
}
