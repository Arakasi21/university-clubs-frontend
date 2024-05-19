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
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
	const axiosAuth = useAxiosInterceptor()

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs`
		try {
			const response = await axiosAuth(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: JSON.stringify(values),
			})

			if (!response.status.toString().startsWith('2')) {
				toast.error('Failed to make request to create club', {
					description: response.data.error,
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
				<Card className="bg-black/5">
					<CardHeader>
						<CardTitle>Create Club</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="w-100">
								<div className="mb-6 text-center">
									{' '}
									<p className="break-words text-sm text-gray-400">
										You need to wait some time for an admin approval after submitting this form
									</p>
								</div>

								<FormField
									name="name"
									render={({ field }) => (
										<FormItem className="mb-4">
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
										<FormItem className="mb-4">
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
										<FormItem className="mb-8">
											<FormLabel>Type</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Select club type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Sport">Sport</SelectItem>
													<SelectItem value="Cultural">Cultural</SelectItem>
													<SelectItem value="Media">Media</SelectItem>
													<SelectItem value="Intellectual">Intellectual</SelectItem>
													<SelectItem value="Creative">Creative</SelectItem>
													<SelectItem value="Entertainment">Entertainment</SelectItem>
													<SelectItem value="SocialActivity">Social Activity</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button className="w-full" type="submit">
									Create
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
