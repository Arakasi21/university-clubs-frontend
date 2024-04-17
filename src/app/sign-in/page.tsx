import LoginForm from '@/app/sign-in/_components/LoginForm'
import Nav from '@/components/NavBar'
import Link from 'next/link'

export default function LoginPage() {
	return (
		<main>
			<Nav />
			<LoginForm />
		</main>
	)
}
