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
import { decimalToRgb } from '@/helpers/helper'
import useClub from '@/hooks/useClub'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import useUserStore from '@/store/user'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useUserRolesStore from '@/store/useUserRoles'
import { hasPermission } from '@/helpers/permissions'
import { Permissions } from '@/types/permissions'
import Error from 'next/error'

const formSchema = z.object({
	name: z.string().min(4, {
		message: 'Role name must be at least 4 characters.',
	}),
	color: z.number(),
})

const colorOptions = [
	{ value: 16711680, label: 'Red' },
	{ value: 65280, label: 'Green' },
	{ value: 255, label: 'Blue' },
	{ value: 16777215, label: 'White' },
	{ value: 16776960, label: 'Yellow' },
]

export function Page({ params }: { params: { clubID: number } }) {
	const { user } = useUserStore()
	const { club, loading } = useClub({
		clubID: params.clubID,
		user: user,
	})
	const { memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})
	const { roles, permissions, highestRole } = useUserRolesStore()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			color: 423534,
		},
	})

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const apiUrl = `http://localhost:5000/clubs/${params.clubID}/roles`
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(values),
			})

			if (!response.ok) {
				let errorData = await response.json()

				toast.error('Failed to make request to create role', {
					description: errorData.error,
				})
			}

			toast.success('Role successfully created!', {
				action: {
					label: 'X',
					onClick: () => {},
				},
			})
		} catch (e) {
			toast.error('ERROR', {
				description: 'An error occurred while trying to make request to create role.',
			})
			console.log(e)
		}
	}

	//if do not have any permissions or not owner return nonauth
	if (!hasPermission(permissions, Permissions.manage_roles) && !loading) {
		return <Error statusCode={401} />
	}
	return (
		<>
			<Nav />
			<div>
				<div className="flex flex-wrap justify-center gap-6">
					<div
						style={{ backgroundImage: `url(${club?.banner_url ?? '/main_photo.jpeg'})` }}
						className="relative h-40 w-screen bg-center bg-no-repeat"
					/>

					<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
						<div className="flex flex-wrap justify-center gap-6">
							<Link href={`/clubs/${club?.id}/settings/roles`}>
								<Button variant={'default'}>Return to roles</Button>
							</Link>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="w-60">
								<div className="mb-6 text-center"> </div>

								<FormField
									name="name"
									render={({ field }) => (
										<FormItem className="mb-4">
											<FormLabel>Role Name</FormLabel>
											<FormControl>
												<Input placeholder="name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="color"
									render={({ field }) => (
										<FormItem className="mb-8">
											<FormLabel>Role Color</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => {
														// New code to handle color selection
														const colorValue = colorOptions.find(
															(option) => option.label === value,
														)?.value
														form.setValue('color', colorValue ?? 0)
													}}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Select role color" />
													</SelectTrigger>
													<SelectContent>
														{colorOptions.map((option) => (
															<SelectItem key={option.value} value={option.label}>
																<div
																	style={{
																		backgroundColor: decimalToRgb(option.value),
																		width: '16px',
																		height: '16px',
																		marginRight: '8px',
																		display: 'inline-block',
																		borderRadius: '8px',
																	}}
																></div>
																<span>{option.label}</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Create</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</>
	)
}

export default Page
