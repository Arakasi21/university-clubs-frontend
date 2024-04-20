import React, { FC, ReactNode, useContext } from 'react'
import { ChevronLast, ChevronFirst } from 'lucide-react'
import { SidebarContext, SidebarContextType } from '@/helpers/context'
import Image from 'next/image'

interface SidebarProps {
	children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
	const { expanded, setExpanded } = useContext(SidebarContext) as SidebarContextType

	return (
		<aside className="h-screen">
			<nav className="flex h-full flex-col border-r bg-background shadow-sm">
				<div className="flex items-center justify-between p-4 pb-2">
					<div
						className={`justify-center overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}
					>
						<Image
							src={'/aitu-logo-3-400x205.png'}
							alt=""
							width={100}
							height={50}
							className="w-32 dark:brightness-200 dark:grayscale"
						/>
					</div>
					<button
						onClick={() => setExpanded?.(!expanded)}
						className="context rounded-lg bg-background p-1.5 align-baseline hover:bg-blue-200 dark:hover:bg-blue-950"
					>
						{expanded ? <ChevronFirst /> : <ChevronLast />}
					</button>
				</div>

				<ul className="flex-1 px-3">{children}</ul>
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
			<span className={`overflow-hidden transition-all ${expanded ? 'ml-3 w-40' : 'w-0'}`}>
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
