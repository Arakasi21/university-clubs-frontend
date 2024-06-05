'use client'
import { Button } from '@/components/ui/button'
import DropdownForLoggedIn from '@/components/ui/dropdown_for_logged_in'
import useUserStore from '@/store/user'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'

export default function Nav() {
	const { isLoggedIn, user, purgeUser } = useUserStore()
	const router = useRouter()

	const logOutHandle = async () => {
		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
			method: 'POST',
			credentials: 'include',
		})
			.then(() => {
				purgeUser()
				router.push('/')
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<header className="sticky top-0 z-50 border-b bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
			<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link className="flex items-center gap-2" href="/">
					<span className="text-lg font-semibold tracking-tight transition duration-300">
						UCMS AITU
					</span>
				</Link>
				<nav className="hidden space-x-4 sm:flex">
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:bg-gray-200 dark:hover:bg-accent"
						href={'/explore/clubs'}
					>
						Clubs
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:bg-gray-200 dark:hover:bg-accent"
						href={'/explore/events'}
					>
						Events
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:bg-gray-200 dark:hover:bg-accent"
						href="#"
					>
						Community
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:bg-gray-200 dark:hover:bg-accent"
						href={'/explore/faq'}
					>
						FAQ
					</Link>
				</nav>
				<div className="flex items-center gap-2">
					{isLoggedIn ? (
						<DropdownForLoggedIn user={user!} logout={logOutHandle} />
					) : (
						<>
							<Link href={'/sign-in'}>
								<Button
									className="hidden bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/70 sm:inline-flex"
									variant="secondary"
								>
									Sign In
								</Button>
							</Link>
						</>
					)}
					<Sheet>
						<SheetTrigger asChild>
							<Button className="sm:hidden" size="icon" variant="outline">
								<MenuIcon className="h-6 w-6" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent className="w-auto max-w-xs" side="right">
							<div className="grid gap-4 p-4">
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
									href={'/explore/clubs'}
								>
									Clubs
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#040a2f]"
									href={'/explore/events'}
								>
									Events
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#040a2f]"
									href="#"
								>
									Community
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#040a2f]"
									href="#"
								>
									About
								</Link>
								<div className="flex flex-col gap-2">
									{!isLoggedIn ? (
										<Link href={'/sign-in'}>
											<Button
												className="inline-flex bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/70"
												variant="secondary"
											>
												Sign In
											</Button>
										</Link>
									) : (
										<DropdownForLoggedIn user={user!} logout={logOutHandle} />
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
