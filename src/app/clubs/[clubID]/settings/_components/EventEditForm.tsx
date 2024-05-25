import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DownloadIcon, FileIcon } from 'lucide-react'

export default function EventEditForm() {
	const [isEditing, setIsEditing] = useState(false)

	const toggleEditMode = () => {
		setIsEditing(!isEditing)
	}

	return (
		<div className="flex min-h-screen w-full flex-col">
			<div className="flex min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col gap-4 bg-gray-100/40 p-4 dark:bg-gray-800/40 md:gap-8 md:p-10">
				<div className="flex w-full flex-col">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="col-span-2 grid flex-1 items-start gap-4 sm:col-span-1">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold">Event Details</h2>
								<div className="flex gap-2">
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline">
												{isEditing ? 'Save Changes' : 'Edit Event Details'}
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[600px]">
											<DialogHeader>
												<DialogTitle>
													{isEditing ? 'Edit Event Details' : 'Event Details'}
												</DialogTitle>
												<DialogDescription>
													{isEditing
														? 'Update the details of the selected event.'
														: 'View and edit the details of the selected event.'}
												</DialogDescription>
											</DialogHeader>
											<div className="grid gap-4 py-4">
												{isEditing ? <EditEventDetails /> : <ViewEventDetails />}
											</div>
											<DialogFooter>
												{!isEditing && (
													<Button onClick={toggleEditMode} variant="outline">
														Edit
													</Button>
												)}
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function ViewEventDetails() {
	return (
		<>
			<DetailRow label="Title" value="Annual Charity Gala" />
			<DetailRow
				label={'Description'}
				value={'Join us for our annual charity gala to support local organizations.'}
			/>
			<DetailRow label="Start Date" value="2023-06-15" />
			<DetailRow label="End Date" value="2023-06-16" />
			<DetailRow label="Location" value="Grand Ballroom, Acme Hotel" />
			<DetailRow label="Participants" value="John Doe, Jane Smith, Bob Johnson" />
			<DetailFiles />
		</>
	)
}

function EditEventDetails() {
	return (
		<>
			<EditRow label="Title" defaultValue="Annual Charity Gala" id="title" />
			<EditTextarea
				label="Description"
				defaultValue="Join us for our annual charity gala to support local organizations."
				id="description"
			/>
			<EditRow label="Start Date" defaultValue="2023-06-15" id="start-date" type="date" />
			<EditRow label="End Date" defaultValue="2023-06-16" id="end-date" type="date" />
			<EditRow label="Location" defaultValue="Grand Ballroom, Acme Hotel" id="location" />
			<EditTextarea
				label="Participants"
				defaultValue="John Doe, Jane Smith, Bob Johnson"
				id="participants"
			/>
			<DetailFiles />
		</>
	)
}

interface DetailRowProps {
	label: string
	value: string
}

function DetailRow({ label, value }: DetailRowProps) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label className="text-right">{label}</Label>
			<div className="col-span-3 font-medium">{value}</div>
		</div>
	)
}

interface EditRowProps {
	label: string
	defaultValue: string
	id: string
	type?: string
}

function EditRow({ label, defaultValue, id, type = 'text' }: EditRowProps) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label className="text-right" htmlFor={id}>
				{label}
			</Label>
			<Input className="col-span-3" defaultValue={defaultValue} id={id} type={type} />
		</div>
	)
}

interface EditTextareaProps {
	label: string
	defaultValue: string
	id: string
}

function EditTextarea({ label, defaultValue, id }: EditTextareaProps) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label className="text-right" htmlFor={id}>
				{label}
			</Label>
			<Textarea className="col-span-3" defaultValue={defaultValue} id={id} />
		</div>
	)
}

function DetailFiles() {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label className="text-right">Attached Files</Label>
			<div className="col-span-3 space-y-2">
				<FileDetail name="event-flyer.pdf" />
				<FileDetail name="event-photo.jpg" />
			</div>
		</div>
	)
}

interface FileDetailProps {
	name: string
}

function FileDetail({ name }: FileDetailProps) {
	return (
		<div className="flex items-center gap-2">
			<FileIcon className="h-4 w-4" />
			<span>{name}</span>
			<Button className="ml-auto" size="icon" variant="ghost">
				<DownloadIcon className="h-4 w-4" />
			</Button>
		</div>
	)
}
