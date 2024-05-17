import React, { useCallback, useEffect, useState } from 'react'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { toast } from 'sonner'
import { Ban } from '@/types/BAN'
import UserLink from '@/components/st/UserLink'

function BanTable({ clubID }: { clubID: number }) {
	const axiosAuth = useAxiosInterceptor()
	const [BanList, setBanList] = useState<Ban[] | null>([])
	const [page] = useState(1)
	const [pageSize] = useState(25)
	const [, setFirstPage] = useState(1)
	const [, setLastPage] = useState(1)
	const [, setTotalRecords] = useState(25)

	const fetchBannedUsers = useCallback(async () => {
		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${clubID}/bans?page=${page}&page_size=${pageSize}`,
				{
					method: 'GET',
				},
			)

			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to get banned users', {
					description: response.data.error,
				})
				return
			}
			setBanList(response.data.list)

			setFirstPage(response.data.metadata.first_page)
			setLastPage(response.data.metadata.last_page)
			setTotalRecords(response.data.metadata.total_records)
		} catch (e) {
			console.log(e)
		}
	}, [clubID, page, pageSize])

	useEffect(() => {
		fetchBannedUsers()
	}, [fetchBannedUsers])
	return (
		<div>
			<Table>
				<TableCaption>List of banned users</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">User</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>By who</TableHead>
						<TableHead className="text-right">Reason</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{BanList == null ? (
						<TableCaption>No bans(yet)</TableCaption>
					) : (
						BanList.map((ban) => (
							<TableRow key={ban.user.id}>
								<TableCell className="font-medium">
									<UserLink user={ban.user} />
								</TableCell>
								<TableCell>{new Date(ban.banned_at).toLocaleDateString()}</TableCell>
								<TableCell>
									<UserLink user={ban.admin} />
								</TableCell>
								<TableCell className="text-right">{ban.reason}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export default BanTable
