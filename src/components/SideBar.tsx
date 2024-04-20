import { FC, ReactNode, useContext } from 'react'
import { MoreVertical, ChevronLast, ChevronFirst } from 'lucide-react'
import { SidebarContext, SidebarContextType } from '@/helpers/context'

interface SidebarProps {
	children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
	const { expanded, setExpanded } = useContext(SidebarContext) as SidebarContextType

	return (
		<aside className="h-screen">
			<nav className="flex h-full flex-col border-r bg-background shadow-sm">
				<div className="flex items-center justify-between p-4 pb-2">
					{/*<img*/}
					{/*	src="https://img.logoipsum.com/243.svg"*/}
					{/*	className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}*/}
					{/*	alt=""*/}
					{/*/>*/}
					<button
						onClick={() => setExpanded?.(!expanded)}
						className="rounded-lg bg-background p-1.5 hover:bg-blue-200 dark:hover:bg-blue-950"
					>
						{expanded ? <ChevronFirst /> : <ChevronLast />}
					</button>
				</div>

				<ul className="flex-1 px-3">{children}</ul>

				<div className="flex border-t p-3">
					<img
						src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
						alt=""
						className="h-10 w-10 rounded-md"
					/>
					<div
						className={`
              flex items-center justify-between
              overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'w-0'}
          `}
					>
						{/*<div className="leading-4">*/}
						{/*	<h4 className="font-semibold">John Doe</h4>*/}
						{/*	<span className="text-xs text-gray-600">johndoe@gmail.com</span>*/}
						{/*</div>*/}
						<MoreVertical size={20} />
					</div>
				</div>
			</nav>
		</aside>
	)
}

interface SidebarItemProps {
	icon: ReactNode
	text: string
	active?: boolean
	alert?: boolean
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, active, alert }) => {
	const { expanded } = useContext(SidebarContext) as SidebarContextType

	return (
		<li
			className={`
        group relative my-1 flex cursor-pointer items-center
        rounded-md px-3 py-2
        font-medium transition-colors
        ${
					active
						? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
						: 'text-gray-600 hover:bg-indigo-50'
				}
    `}
		>
			{icon}
			<span className={`overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'w-0'}`}>
				{text}
			</span>
			{alert && (
				<div
					className={`absolute right-2 h-2 w-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}
				/>
			)}

			{!expanded && (
				<div
					className={`
          invisible absolute left-full ml-6 -translate-x-3 rounded-md
          bg-indigo-100 px-2 py-1
          text-sm text-indigo-800 opacity-20 transition-all
          group-hover:visible group-hover:translate-x-0 group-hover:opacity-100
      `}
				>
					{text}
				</div>
			)}
		</li>
	)
}

export { Sidebar, SidebarItem }
