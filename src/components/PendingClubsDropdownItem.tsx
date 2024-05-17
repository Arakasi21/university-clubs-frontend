import React from 'react'
import { GavelIcon, LayoutDashboard } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import usePendingClubs from '@/hooks/usePendingClubs'
import { useRouter } from 'next/navigation'
import { GrUserAdmin } from 'react-icons/gr'

function PendingClubsDropdownItem() {
	const router = useRouter()
	const pendingClubs = usePendingClubs()
	return (
		<>
			<DropdownMenuItem
				onClick={() => {
					router.push(`/clubs/handle`)
				}}
				className="flex flex-row space-x-4"
			>
				<GavelIcon />
				<p>
					Handle new Clubs{' '}
					{pendingClubs > 0 && (
						<span className={pendingClubs > 0 ? 'text-red-500' : ''}>{`(+${pendingClubs})`}</span>
					)}
				</p>
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => {
					router.push(`/admin-dashboard/dashboard`)
				}}
				className="flex flex-row space-x-4"
			>
				<LayoutDashboard />
				<p>
					Admin Dashboard{' '}
					{pendingClubs > 0 && (
						<span className={pendingClubs > 0 ? 'text-red-500' : ''}>{`(+${pendingClubs})`}</span>
					)}
				</p>
			</DropdownMenuItem>
		</>
	)
}

export default PendingClubsDropdownItem
