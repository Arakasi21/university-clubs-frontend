'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IClub } from '@/interface/club'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { decimalToRgb } from '@/helpers/helper'
import Nav from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Role name must be at least 2 characters.',
	}),
	color: z.number(),
})

export function Page({ params }: { params: { clubID: number } }) {
	const colorOptions = [
		{ value: 16711680, label: 'Red' },
		{ value: 65280, label: 'Green' },
		{ value: 255, label: 'Blue' },
		{ value: 16777215, label: 'White' },
		{ value: 16776960, label: 'Yellow' },
	]

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
	const [club, setClub] = useState<IClub>()
	const fetchClubInfo = useCallback(() => {
		fetch(`http://localhost:5000/clubs/${params.clubID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})

					throw new Error(data.error || 'Failed to Fetch club info')
				}

				setClub(data.club)
			})
			.catch((error) => console.log(error.message))
	}, [params.clubID])

	useEffect(() => {
		fetchClubInfo()
	}, [fetchClubInfo, params.clubID])

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
														form.setValue('color', colorValue)
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
