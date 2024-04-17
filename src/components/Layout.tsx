import { PropsWithChildren } from 'react'
import Nav from './NavBar'
import SideBar from './SideBar'
import Footer from '@/components/footer'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Nav />
			<div className="flex ">
				<div className="sticky top-3 w-1/6 flex-none overscroll-none border-r border-solid bg-background ">
					<SideBar />
				</div>

				<div className="my-10 ms-40 flex w-fit flex-grow flex-col justify-start gap-6 overflow-y-auto">
					{children}
				</div>
			</div>
		</>
	)
}

export default Layout
