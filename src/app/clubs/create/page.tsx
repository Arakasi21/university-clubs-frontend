'use client'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Club name must be at least 2 characters.',
	}),
	description: z.string().min(10, {
		message: 'Description must be at least 10 characters',
	}),
	club_type: z.string(),
})

export default function Page() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	})

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const apiUrl = 'http://localhost:5000/clubs'
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(values),
			})

			if (!response.ok) {
				let errorData = await response.json()

				toast.error('Failed to make request to create club', {
					description: errorData.error,
				})
			}

			toast.success('Request to create club successfully made!', {
				action: {
					label: 'X',
					onClick: () => {},
				},
			})
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to create club.',
			})
			console.log(e)
		}
	}

	return (
		<>
			<Nav />
			<div className="flex min-h-screen flex-col items-center justify-between p-24">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<FormField
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Club Name</FormLabel>
									<FormControl>
										<Input placeholder="name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="club_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select club type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Volunteer">Volunteer</SelectItem>
											<SelectItem value="Gaming">Gaming</SelectItem>
											<SelectItem value="Athletic">Athletic</SelectItem>
											<SelectItem value="Dance & Music">Dance & Music</SelectItem>
											<SelectItem value="Speaking">Speaking</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Create</Button>
					</form>
				</Form>
			</div>
		</>
	)
}
