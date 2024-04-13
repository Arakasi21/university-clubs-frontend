'use client'
import Nav from '@/components/nav'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import UserAvatar from '@/components/userAvatar'
import { IClub, IClubMember } from '@/interface/club'
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
import HandleDialog from './_components/HandleDialog'

type Columns = {
	clubs: IClub
	owner: IClubMember
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
	const [data, setData] = useState([] as { club: IClub; owner: IClubMember }[])

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(25)
	const [firstPage, setFirstPage] = useState(1)
	const [lastPage, setLastPage] = useState(1)
	const [totalRecords, setTotalRecords] = useState(25)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedClub, setSelectedClub] = useState<IClub>()

	const fetchPendingClubs = useCallback(() => {
		fetch(`http://localhost:5000/clubs/pending?page=${page}&page_size=${pageSize}`, {
			credentials: 'include',
		})
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
				}

				setData(data.items as { club: IClub; owner: IClubMember }[])
				setFirstPage(data.metadata.first_page)
				setLastPage(data.metadata.last_page)
				setTotalRecords(data.metadata.total_records)
			})
			.catch((error) => console.log(error.message))
	}, [page, pageSize])

	useEffect(() => {
		fetchPendingClubs()
	}, [page, pageSize, fetchPendingClubs])

	const handleRowClick = (club: IClub) => {
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
			<Table>
				<TableHeader>
					{/*<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Owner</TableHead>
					</TableRow>*/}
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
					{/*{table.getRowModel().rows.map(row => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</TableRow>
					))}*/}
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
			{selectedClub && (
				<HandleDialog
					isOpen={isDialogOpen}
					selectedClub={selectedClub}
					onClose={() => {
						setIsDialogOpen(false)
					}}
				/>
			)}
		</div>
	)
}

export default Page
