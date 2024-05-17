'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StudentsRow, { StudentsRowProps } from '@/components/studentsRow'
import debounce from 'lodash.debounce'
import SearchAdmin from '@/components/st/SearchAdmin'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

export default function Students() {
	const [students, setStudents] = useState<StudentsRowProps['student'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)

	const fetchStudents = useCallback(
		debounce((search: string, page: number, updateStudents: typeof setStudents) => {
			console.log('Fetching students with search term:', search, 'and page:', page)
			fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search?query=${search}&page=${page}&page_size=10`,
			)
				.then((response) => response.json())
				.then((data) => {
					console.log('Fetched students:', data.users)
					updateStudents(data.users || [])
				})
				.catch((error) => console.error('Error fetching students:', error))
		}, 300),
		[],
	)

	useEffect(() => {
		fetchStudents(searchTerm, currentPage, setStudents)

		return () => {
			fetchStudents.cancel()
		}
	}, [searchTerm, currentPage, fetchStudents])

	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}, [])

	const handlePageChange = useCallback((newPage: number) => {
		setCurrentPage(newPage)
	}, [])

	return (
		<div>
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle className="pb-4">Students</CardTitle>
					<SearchAdmin onSearch={handleSearch} />
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="hidden md:table-cell">Avatar</TableHead>
								<TableHead className="hidden md:table-cell">Name</TableHead>
								<TableHead className="hidden md:table-cell">Surname</TableHead>
								<TableHead className="hidden md:table-cell">Email</TableHead>
								<TableHead className="hidden md:table-cell">Barcode</TableHead>
								<TableHead className="hidden md:table-cell">Major</TableHead>
								<TableHead className="hidden md:table-cell">Group</TableHead>
								<TableHead className="hidden md:table-cell">Year</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{students.map((student) => (
								<StudentsRow key={student.id} student={student} onUpdate={() => {}} />
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
							{[...Array(3)].map((_, index) => {
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
