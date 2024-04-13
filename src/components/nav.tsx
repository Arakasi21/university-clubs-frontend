'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import useUserStore from '@/store/user'
import DropdownForLoggedIn from '@/components/ui/dropdown_for_logged_in'

export default function Nav() {
	const { isLoggedIn, user, purgeUser } = useUserStore()

	const logOutHandle = async () => {
		await fetch('http://localhost:5000/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})
			.then(() => {
				purgeUser()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<header>
			<nav className=" ">
				{/* <nav className="bg-white border-gray-200 dark:bg-gray-900 ">*/}
				<div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-3">
					<Link href="../" className="flex items-center space-x-3 rtl:space-x-reverse">
						<Image src="" className="h-8" alt="" />
						<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
							UCMS AITU
						</span>
					</Link>

					<div
						className="hidden w-full max-w-xl items-center justify-items-stretch md:order-1 md:flex"
						id="navbar-cta"
					>
						<div className="relative flex w-full max-w-[700px] items-center ">
							<Search size={20} className=" absolute left-3  text-muted-foreground" />
							<Input
								className=" w-full rounded-full pl-10 focus-visible:ring-blue-600"
								placeholder="Search"
							/>
						</div>
					</div>

					<div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
						{isLoggedIn ? (
							<DropdownForLoggedIn user={user!} logout={logOutHandle} />
						) : (
							<Link href={'/sign-in'}>
								<Button>Log in</Button>
							</Link>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}
