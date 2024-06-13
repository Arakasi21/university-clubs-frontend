import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
	name: z.string(),
	description: z.string(),
	club_type: z.string(),
	social_links: z.array(z.string()).max(4, 'Maximum of 4 social links'),
})

const ClubInfoEditForm: React.FC = (props) => {
	const axiosAuth = useAxiosInterceptor()
	const { club } = useClubStore()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: club?.name,
			description: club?.description,
			club_type: club?.club_type,
			social_links: club?.social_links || [''], // Default value for social links
		},
	})

	const updateClubInfo = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axiosAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}`, {
				method: 'PATCH',
				data: values,
			})

			if (!response.status.toString().startsWith('2')) {
				toast.error('Update club info error', {
					description: response.data.error,
				})
			} else {
				toast.success('Club info successfully updated!')
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div className="w-full" {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(updateClubInfo)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="pb-4">
								<FormLabel>Club Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="pb-4">
								<FormLabel>Club Description</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						name="club_type"
						render={({ field }) => (
							<FormItem className="mb-8 w-full ">
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
					<FormField
						control={form.control}
						name="social_links"
						render={({ field }) => (
							<FormItem className="pb-4">
								<FormLabel>Social Links</FormLabel>
								{field.value.map((link, index) => (
									<div key={index} className="flex items-center space-x-2">
										<FormControl>
											<Input
												value={link}
												onChange={(e) => {
													const newLinks = [...field.value]
													newLinks[index] = e.target.value
													field.onChange(newLinks)
												}}
											/>
										</FormControl>
										<Button
											className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
											type="button"
											onClick={() => {
												const newLinks = field.value.filter((_, i) => i !== index)
												field.onChange(newLinks)
											}}
										>
											Remove
										</Button>
									</div>
								))}
								{field.value.length < 4 && (
									<Button
										className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
										type="button"
										onClick={() => field.onChange([...field.value, ''])}
									>
										Add Link
									</Button>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
					>
						Update Club Info
					</Button>
				</form>
			</Form>
		</div>
	)
}

export function DialogUpdateClubInfo() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="w-40 bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
					variant="secondary"
				>
					Update Club Info
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md md:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Club Info</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<ClubInfoEditForm />
				</div>
			</DialogContent>
		</Dialog>
	)
}
