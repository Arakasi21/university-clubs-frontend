import { ClubRole } from '@/types/club'
import React, { useCallback } from 'react'
import { FetchWithAuth } from '@/helpers/fetch_api'
import useUserStore from '@/store/user'

interface UseDragDropProps {
	club: any
	fetchClubInfo: () => void
}

export const useDragDrop = ({ club, fetchClubInfo }: UseDragDropProps) => {
	const handleDragStart = useCallback((e: React.DragEvent, role: ClubRole) => {
		e.dataTransfer.setData(
			'application/my-app',
			JSON.stringify({ id: role.id, position: role.position }),
		)
		e.dataTransfer.dropEffect = 'move'
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
	}, [])
	const { jwt_token, setUser } = useUserStore()
	const handleDrop = useCallback(
		async (e: React.DragEvent, role: ClubRole) => {
			e.preventDefault()
			const draggedRole = JSON.parse(e.dataTransfer.getData('application/my-app'))
			const response = await FetchWithAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/roles`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						roles: [
							{ id: draggedRole.id, position: role.position },
							{ id: role.id, position: draggedRole.position },
						],
					}),
				},
				jwt_token,
				setUser,
			)
			if (response.ok) {
				fetchClubInfo()
			}
		},
		[club, fetchClubInfo],
	)

	return { handleDragStart, handleDragOver, handleDrop }
}
