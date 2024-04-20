import { createContext } from 'react'

export interface SidebarContextType {
	expanded: boolean
	setExpanded?: (value: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType>({
	expanded: false,
})
