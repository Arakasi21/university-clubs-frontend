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
import { ArrowUpDown, Badge, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import HandleDialog from './_components/HandleDialog'
import useUserStore from '@/store/user'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { router } from 'next/client'

type Columns = {
	club: IClub
	owner: IClubMember
}

const columns: ColumnDef<Columns>[] = [
	{
		accessorKey: 'user',
		header: 'Barcode',
		cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'profile',
		header: () => <div className="text">Name</div>,
		cell: ({ row }) => <div className="lowercase">{row.getValue('first_name')}</div>,
	},
]
function Page({ params }: { params: { clubID: number } }) {
	const [data, setData] = useState([] as IClubMember[])
	const { user } = useUserStore()
	const [club, setClub] = useState<IClub>()
	const [loading, setLoading] = useState(true)
	const [isOwner, setIsOwner] = useState(false)

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
	const [selectedUser, setSelectedUser] = useState<IClubMember>()

	const fetchClubInfo = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${params.clubID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClub(data.club)
				setIsOwner(data.club.owner_id == user?.id)
				setLoading(false)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID, user?.id])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])

	const fetchPendingClubs = useCallback(() => {
		console.log(params.clubID)
		fetch(`http://localhost:5000/clubs/${params.clubID}/join?page=${page}&page_size=${pageSize}`, {
			credentials: 'include',
		})
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
				}

				setData(data.users)
				setFirstPage(data.metadata.first_page)
				setLastPage(data.metadata.last_page)
				setTotalRecords(data.metadata.total_records)
			})
			.catch((error) => console.log(error.message))
	}, [page, pageSize])

	useEffect(() => {
		fetchPendingClubs()
	}, [page, pageSize, fetchPendingClubs])

	const handleRowClick = (user: IClubMember) => {
		setSelectedUser(user)
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

	//TODO: change later
	if (!isOwner) {
		return null
	}

	return (
		<div>
			<Nav />
			<div
				style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
				className="relative h-40 w-screen bg-center bg-no-repeat"
			/>

			<Tabs
				className="grid flex-1 items-start gap-4 p-4 sm:px-64 sm:py-8 md:gap-8"
				defaultValue="all"
			>
				<Link href={`/clubs/${club?.id}/settings`}>
					<Button variant={'outline'}>Return to settings</Button>
				</Link>
				<TabsContent value="all">
					<Card x-chunk="dashboard-06-chunk-0">
						<CardHeader>
							<CardTitle>Requested to join members</CardTitle>
							<CardDescription>
								Manage your members requests. You can either accept / reject.
							</CardDescription>
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
											key={c.id}
											onClick={() => {
												handleRowClick(c)
											}}
										>
											<TableCell>{c.barcode}</TableCell>
											<TableCell>
												<Link
													href={`/user/${c.id}`}
													className="flex flex-row items-center space-x-2.5"
												>
													<UserAvatar user={c} />
													<p>
														{c.last_name} {c.first_name}
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

			{selectedUser && (
				<HandleDialog
					isOpen={isDialogOpen}
					selectedUser={selectedUser}
					club={club ?? ({} as IClub)}
					onClose={() => {
						setIsDialogOpen(false)
					}}
				/>
			)}
		</div>
	)
}

export default Page
