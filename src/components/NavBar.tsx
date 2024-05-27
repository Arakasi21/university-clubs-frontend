'use client'
import { Button } from '@/components/ui/button'
import DropdownForLoggedIn from '@/components/ui/dropdown_for_logged_in'
import { Input } from '@/components/ui/input'
import useUserStore from '@/store/user'
import { MenuIcon, Search } from 'lucide-react'
import Image from 'next/image'
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
		<header className="sticky top-0 z-50 border-b bg-gray-900 text-white backdrop-blur-sm dark:bg-gray-900">
			<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link className="flex items-center gap-2" href="/">
					<span className="text-lg font-semibold tracking-tight text-gray-50">UCMS AITU</span>
				</Link>
				<nav className="hidden space-x-4 sm:flex">
					<Link
						className="text-grey-50 rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:bg-accent/80"
						href={'/explore/clubs'}
					>
						Clubs
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-accent"
						href="#"
					>
						Events
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-accent"
						href="#"
					>
						Community
					</Link>
					<Link
						className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-accent"
						href="#"
					>
						About
					</Link>
				</nav>
				<div className="flex items-center gap-2">
					{isLoggedIn ? (
						<DropdownForLoggedIn user={user!} logout={logOutHandle} />
					) : (
						<>
							<Link href={'/sign-in'}>
								<Button className="hidden sm:inline-flex" variant="secondary">
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
						<SheetContent className="w-full max-w-xs" side="right">
							<div className="grid gap-4 p-4">
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-[#040a2f]"
									href={'/explore/clubs'}
								>
									Explore
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-[#040a2f]"
									href="#"
								>
									Events
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-[#040a2f]"
									href="#"
								>
									Community
								</Link>
								<Link
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-50 hover:bg-[#040a2f]"
									href="#"
								>
									About
								</Link>
								<div className="flex flex-col gap-2">
									{!isLoggedIn ? (
										<Link href={'/sign-in'}>
											<Button className="inline-flex" variant="secondary">
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
