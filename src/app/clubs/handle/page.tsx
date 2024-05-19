'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import UserAvatar from '@/components/user/userAvatar'
import { Club, ClubMember } from '@/types/club'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import HandleDialog from '@/components/user/HandleDialog'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

type Columns = {
	club: Club
	owner: ClubMember
}

const columns: ColumnDef<Columns>[] = [
	{
		accessorKey: 'clubs',
		header: 'Name',
		cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'clubs',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue('type')}</div>,
	},
	{
		accessorKey: 'owner',
		header: () => <div className="text-right">Owner</div>,
		cell: ({ row }) => <div className="lowercase">{row.getValue('first_name')}</div>,
	},
]
function Page() {
	const [data, setData] = useState([] as { club: Club; owner: ClubMember }[])

	const [page] = useState(1)
	const [pageSize] = useState(25)
	const [, setFirstPage] = useState(1)
	const [, setLastPage] = useState(1)
	const [, setTotalRecords] = useState(25)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const axiosAuth = useAxiosInterceptor()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedClub, setSelectedClub] = useState<Club>()

	const fetchPendingClubs = useCallback(() => {
		axiosAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/pending?page=${page}&page_size=${pageSize}`,
			{},
		)
			.then(async (res) => {
				if (!res.status.toString().startsWith('2')) {
					toast.error('not found', {
						description: res.data.error,
					})
				}
				setData(res.data.items as { club: Club; owner: ClubMember }[])
				setFirstPage(res.data.metadata.first_page)
				setLastPage(res.data.metadata.last_page)
				setTotalRecords(res.data.metadata.total_records)
			})
			.catch((error) => console.log(error.message))
	}, [page, pageSize])

	useEffect(() => {
		fetchPendingClubs()
	}, [page, pageSize, fetchPendingClubs])

	const handleRowClick = (club: Club) => {
		setSelectedClub(club)
		setIsDialogOpen(true)
	}

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div>
			<Nav />

			<Tabs
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				defaultValue="all"
			>
				<TabsContent value="all">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Pending clubs</CardTitle>
							<CardDescription>Approve / reject club creation request</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											))}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{data?.map((c) => (
										<TableRow
											key={c.club.id}
											onClick={() => {
												handleRowClick(c.club)
											}}
										>
											<TableCell>{c.club.name}</TableCell>
											<TableCell>{c.club.club_type}</TableCell>
											<TableCell>
												<Link
													href={`/user/${c.owner.id}`}
													className="flex flex-row items-center space-x-2.5"
												>
													<UserAvatar user={c.owner} />
													<p>
														{c.owner.last_name} {c.owner.first_name}
													</p>
												</Link>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
			{selectedClub && (
				<HandleDialog
					isOpen={isDialogOpen}
					selectedClub={selectedClub}
					onClose={() => {
						setIsDialogOpen(false)
						fetchPendingClubs()
					}}
				/>
			)}
		</div>
	)
}

export default Page
