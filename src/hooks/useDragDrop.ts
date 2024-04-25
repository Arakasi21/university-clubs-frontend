import { ClubRole } from '@/types/club'
import React, { useCallback } from 'react'

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

	const handleDrop = useCallback(
		async (e: React.DragEvent, role: ClubRole) => {
			e.preventDefault()
			const draggedRole = JSON.parse(e.dataTransfer.getData('application/my-app'))
			const response = await fetch(`http://localhost:5000/clubs/${club?.id}/roles`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					roles: [
						{ id: draggedRole.id, position: role.position },
						{ id: role.id, position: draggedRole.position },
					],
				}),
			})
			if (response.ok) {
				fetchClubInfo()
			}
		},
		[club, fetchClubInfo],
	)

	return { handleDragStart, handleDragOver, handleDrop }
}
