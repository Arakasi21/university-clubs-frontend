import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Club } from '@/types/club'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Textarea } from '@/components/ui/textarea'

// Define the schema for form validation
const postFormSchema = z.object({
	title: z
		.string()
		.min(4, { message: 'Title must be at least 4 characters.' })
		.max(100, { message: 'Title cannot be more than 100 characters' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
	tags: z.string().optional(),
	// Add more fields if necessary, e.g., cover_images, attached_files
})

const PostCreateForm: React.FC<{
	club: Club
	onClose: () => void
	onCreateSuccess: () => void
}> = ({ club, onClose, onCreateSuccess }) => {
	const form = useForm<z.infer<typeof postFormSchema>>({
		resolver: zodResolver(postFormSchema),
		defaultValues: {
			title: '',
			description: '',
			tags: '',
		},
	})

	const axiosAuth = useAxiosInterceptor()

	const createPost = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const values = form.getValues()

		const postData = {
			title: values.title,
			description: values.description,
			tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
		}

		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}/posts`,
				postData,
			)

			if (response.status !== 201) {
				toast.error('Failed to create post', { description: response.data.error })
				return
			}

			toast.success('Post successfully created!')
			onCreateSuccess() // Fetch club posts again
			onClose()
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to create post.' })
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={createPost} onClick={(e) => e.stopPropagation()}>
				<FormField
					name="title"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Title" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name="description"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="Description" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name="tags"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Tags (comma separated)</FormLabel>
							<FormControl>
								<Input placeholder="Tags" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					className="mt-8 bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
					type="submit"
				>
					Create Post
				</Button>
			</form>
		</Form>
	)
}

export function DialogCreatePost({
	club,
	onCreateSuccess,
}: {
	club: Club
	onCreateSuccess: () => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const toggleDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsOpen(!isOpen)
	}
	const handleCreateSuccess = () => {
		onCreateSuccess()
		console.log('Post created successfully')
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant={'default'}
					className="right-0 w-40 bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
					onClick={toggleDialog}
				>
					Create Post
				</Button>
			</DialogTrigger>
			{isOpen && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Post</DialogTitle>
					</DialogHeader>
					<PostCreateForm
						club={club}
						onClose={() => setIsOpen(false)}
						onCreateSuccess={handleCreateSuccess}
					/>
				</DialogContent>
			)}
		</Dialog>
	)
}
