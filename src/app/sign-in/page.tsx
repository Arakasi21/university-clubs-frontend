import Nav from '@/components/nav'
import LoginForm from '@/app/sign-in/_components/LoginForm'
import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
	return (
		<main>
			<Nav />
			<LoginForm />
			<div className="top-0 flex items-center justify-center">
				<p className="">New in our university?</p>
				<Link href={'/sign-up'} className="text-blue-500">
					Sign up
				</Link>
			</div>
		</main>
	)
}
