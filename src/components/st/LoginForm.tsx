'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import useUserStore from '@/store/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const formSchema = z.object({
	email: z.string().email({ message: 'Invalid email format' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export default function Login() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const { setUser } = useUserStore()

	const router = useRouter()

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(values),
			})

			if (!response.ok) {
				const errorData = await response.json()

				toast.error('SignIn error', {
					description: errorData.error,
				})
			}

			const data = await response.json()

			setUser(data.user)

			toast('You Signed In successfully!')
			router.push('/')
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to log in.' })
		}
	}

	const OpenIDConnectLoginHandler = async () => {
		try {
			// Make a request to your backend to get the Microsoft login URL
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/microsoft/login`, {
				method: 'POST',
			})
			const data = await response.json()

			if (!response.ok) {
				// If the response is not OK, handle the error
				toast.error('ERROR', { description: data.error })
				return
			}

			// If the response is OK, redirect the user to the Microsoft login page
			// Note: The backend should respond with a URL for redirection
			window.location.href = data.url
		} catch (error) {
			// Handle any other errors
			toast.error('ERROR', { description: 'An error occurred while trying to log in.' })
		}
	}

	return (
		<main className="flex flex-col items-center justify-between p-24">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Enter your email below to login to your account.</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="flex w-full max-w-md flex-col gap-4"
						>
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
							<Button type="submit" className="w-full">
								Log in
							</Button>
						</form>
					</Form>
					<Button
						onClick={() => {
							OpenIDConnectLoginHandler()
						}}
						variant="outline"
						className="w-full"
					>
						<p>OpenID Connect</p>
					</Button>
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link href="/sign-up" className="underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</main>
	)
}
