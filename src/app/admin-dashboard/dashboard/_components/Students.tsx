'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StudentsRow, { StudentsRowProps } from '@/components/admin/studentsRow'
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

export default function Students() {
	const [students, setStudents] = useState<StudentsRowProps['student'][]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [hasMorePages, setHasMorePages] = useState(true)

	const fetchStudents = useCallback(
		debounce(
			(
				search: string,
				page: number,
				updateStudents: typeof setStudents,
				updateHasMorePages: typeof setHasMorePages,
			) => {
				console.log('Fetching students with search term:', search, 'and page:', page)
				fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search?query=${search}&page=${page}&page_size=10`,
				)
					.then((response) => response.json())
					.then((data) => {
						console.log('Fetched students:', data.users)
						const sortedStudents = data.users.sort(
							(a: StudentsRowProps['student'], b: StudentsRowProps['student']) => {
								const rolePriority: { [key: string]: number } = {
									DSVR: 1,
									ADMIN: 2,
									MODER: 3,
									USER: 4,
								}
								return rolePriority[a.role] - rolePriority[b.role]
							},
						)
						updateStudents(sortedStudents || [])
						updateHasMorePages(data.users && data.users.length > 0)
					})
					.catch((error) => console.error('Error fetching students:', error))
			},
			100,
		),
		[currentPage, searchTerm],
	)

	useEffect(() => {
		fetchStudents(searchTerm, currentPage, setStudents, setHasMorePages)
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

	const renderPaginationItems = () => {
		let pages = []
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
								<StudentsRow
									key={student.id}
									student={student}
									onUpdate={() => {
										fetchStudents(searchTerm, currentPage, setStudents, setHasMorePages)
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
