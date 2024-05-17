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
import { Separator } from '@/components/ui/separator'

type DetailedEventDialogProps = {
	event: Event | null
	isOpen: boolean
	onClose: () => void
}

export function DetailedEventDialog({ event, isOpen, onClose }: DetailedEventDialogProps) {
	if (!event) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[1425px]">
				<DialogHeader>
					<DialogTitle>{event.title}</DialogTitle>
					<DialogDescription>{event.club.name}</DialogDescription>
				</DialogHeader>
				<Card className="m-4 bg-muted/70">
					<CardHeader className="pb-3">
						<CardTitle className="text-center text-lg">
							{new Date(event.startdate).toLocaleDateString()}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{event.description || 'No description provided.'}</p>
						<br />
						<Separator />
						<br />
						<p>
							Location:{' '}
							<a href={event.locationlink} target="_blank" rel="noopener noreferrer">
								{event.locationlink}
							</a>
						</p>
						<br />
						<Separator />
						<br />
						<p>
							Participants: {event.participantscount}/{event.maxparticipants}
						</p>
						<br />
						<Separator />
						<br />

						<div className="col-span-3 flex justify-between">
							{event.attachedimages.map((image, index) => (
								<img key={index} src={image} alt={`Event Media ${index}`} className="mt-2" />
							))}
							{event.attachedimages.map((image, index) => (
								<img key={index} src={image} alt={`Event Media ${index}`} className="mt-2" />
							))}
							{event.attachedimages.map((image, index) => (
								<img key={index} src={image} alt={`Event Media ${index}`} className="mt-2" />
							))}
						</div>
					</CardContent>
				</Card>
				<DialogFooter>
					<Button onClick={onClose}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
