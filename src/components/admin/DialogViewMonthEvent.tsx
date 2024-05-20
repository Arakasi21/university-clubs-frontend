import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Event } from '@/types/event'

type EventDialogProps = {
	month: string | null
	events: Event[]
	isOpen: boolean
	onClose: () => void
	onEventClick: (event: Event) => void
}

export function EventDialog({ month, events, isOpen, onClose, onEventClick }: EventDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{month} Events</DialogTitle>
					<DialogDescription>Here are the events for the month of {month}.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{events.map((event, index) => (
						<Card
							key={index}
							className="m-4 cursor-pointer bg-muted/70"
							onClick={() => onEventClick(event)}
						>
							<CardHeader className="pb-3">
								<CardTitle className="text-center text-lg">{event.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-center">{event.end_date}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<DialogFooter>
					<Button onClick={onClose}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
