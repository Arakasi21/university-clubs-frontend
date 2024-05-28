export type EventStatusMapping = {
	[key: string]: { color: string; label: string }
}

export const eventStatusMapping: EventStatusMapping = {
	DRAFT: { color: 'bg-gray-500', label: 'Draft' },
	PENDING: { color: 'bg-yellow-500', label: 'Pending' },
	APPROVED: { color: 'bg-green-500', label: 'Approved' },
	REJECTED: { color: 'bg-red-500', label: 'Rejected' },
	IN_PROGRESS: { color: 'bg-green-900', label: 'In Progress' },
}

export function getEventStatus(status: string) {
	return eventStatusMapping[status] || { color: 'bg-gray-500', label: 'Unknown' }
}
