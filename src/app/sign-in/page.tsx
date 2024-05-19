import LoginForm from '@/components/user/LoginForm'
import Nav from '@/components/NavBar'

export default function LoginPage() {
	return (
		<main className="overflow-hidden">
			<Nav />
			<LoginForm />
		</main>
	)
}
