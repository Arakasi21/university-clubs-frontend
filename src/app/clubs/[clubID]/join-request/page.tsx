'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import UserAvatar from '@/components/userAvatar'
import useClub from '@/hooks/useClub'
import { Club, ClubMember } from '@/types/club'
import {
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
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import BackgroundClubImage from '@/components/st/BackgroundClubImage'
import HandleJoinDialog from '@/components/st/HandleJoinDialog'
function Page({ params }: { params: { clubID: number } }) {
	const [data, setData] = useState([] as ClubMember[])
	const { user } = useUserStore()
	const { club, isOwner } = useClub({ clubID: params.clubID, user: user })

	const [page] = useState(1)
	const [pageSize] = useState(25)
	const [, setFirstPage] = useState(1)
	const [, setLastPage] = useState(1)
	const [, setTotalRecords] = useState(25)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<ClubMember>()

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
	}, [page, pageSize, params.clubID])

	const onHandle = (userID: number, status: 'approved' | 'rejected') => {
		fetch(`http://localhost:5000/clubs/${club?.id}/members`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ user_id: userID, status: status }),
		})
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error(`failed to ${status}`, {
						description: data.error,
					})
					return
				}

				toast.success(`${status}!`)
			})
			.catch((error) => console.log(error.message))
			.finally(() => {
				setIsDialogOpen(false)
				fetchPendingClubs()
			})
	}

	useEffect(() => {
		fetchPendingClubs()
	}, [page, pageSize, fetchPendingClubs])

	const handleRowClick = (user: ClubMember) => {
		setSelectedUser(user)
		setIsDialogOpen(true)
	}

	const table = useReactTable({
		data,
		columns: [],
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

	//TODO: change later ? To what
	if (!isOwner) {
		return null
	}

	return (
		<div>
			<Nav />
			<BackgroundClubImage club={club} />

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
				<HandleJoinDialog
					onHandle={onHandle}
					isOpen={isDialogOpen}
					selectedUser={selectedUser}
					club={club ?? ({} as Club)}
					onClose={() => {
						setIsDialogOpen(false)
					}}
				/>
			)}
		</div>
	)
}

export default Page
