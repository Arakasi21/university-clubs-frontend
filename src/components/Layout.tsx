import { PropsWithChildren } from 'react'
import Nav from './NavBar'
import { Sidebar, SidebarItem } from './SideBar'
import Footer from '@/components/footer'
import { LayoutDashboard, UserCircle, Boxes, Settings } from 'lucide-react'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Nav />
			<div className="flex">
				<div className="fixed left-0 z-30 h-screen overscroll-x-none">
					<Sidebar>
						<SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
						<SidebarItem icon={<UserCircle size={20} />} text="Users" />
						<SidebarItem icon={<Boxes size={20} />} text="Inventroy" />
						<SidebarItem icon={<Settings size={20} />} text="Settings" />
					</Sidebar>
				</div>

				<div className=" mx-10 my-10 flex w-fit flex-grow flex-col justify-start gap-6 overflow-y-auto">
					{children}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default Layout
