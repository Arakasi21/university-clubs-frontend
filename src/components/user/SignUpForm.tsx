'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const formSchema = z
	.object({
		first_name: z.string().min(1, { message: 'First name is required' }).max(30),
		last_name: z.string().min(1, { message: 'Last name is required' }).max(30),
		email: z.string().email({ message: 'Invalid email format' }).max(60),
		password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(30),
		passwordConfirmation: z.string(),
		barcode: z.string().min(1, { message: 'Barcode is required' }).max(10),
		major: z.string().min(1, { message: 'Major is required' }).max(40),
		group_name: z.string().min(1, { message: 'Group name is required' }).max(10),
		year: z.coerce.number().min(1).max(3),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords must match',
		path: ['passwordConfirmation'],
	})

export default function SignUp() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			barcode: '',
			major: '',
			group_name: '',
			year: 0,
		},
	})

	const router = useRouter()

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})

			if (!response.ok) {
				let errorData = await response.json()

				toast.error('Signup error', {
					description: errorData.error,
				})
			}

			toast('Signup successful!', {
				action: {
					label: 'Okay',
					onClick: () => console.log('Okay'),
				},
			})
			router.push('/')
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to Sign up.' })
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
					<CardDescription>Fill out all the fields to complete registration.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="flex w-full max-w-md flex-col gap-4"
						>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="first_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Your first name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="last_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Your last name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input type="email" placeholder="Your email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="Your password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="passwordConfirmation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="Confirm your password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="barcode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Barcode</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Your barcode" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="major"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Major</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Your major" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="group_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Group Name</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Your group name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Year</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Your year" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Create an account
							</Button>
						</form>
					</Form>
					{/*<Button*/}
					{/*	onClick={() => {*/}
					{/*		OpenIDConnectLoginHandler()*/}
					{/*	}}*/}
					{/*	variant="outline"*/}
					{/*	className="w-full"*/}
					{/*>*/}
					{/*	<p>OpenID Connect</p>*/}
					{/*</Button>*/}
					<div className="mt-2 text-center text-sm">
						Already have an account?{' '}
						<Link href="/sign-in" className="underline">
							Log in
						</Link>
					</div>
				</CardContent>
			</Card>
		</main>
	)
}
