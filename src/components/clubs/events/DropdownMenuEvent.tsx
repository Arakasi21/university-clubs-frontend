import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FilterIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export default function DropdownMenuEvent() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="outline">
					<FilterIcon className="mr-2 h-4 w-4" />
					Filter
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-full">
				<DropdownMenuLabel>Filter by</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="grid grid-cols-3  gap-4 p-4">
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="tags">
							Tags
						</Label>
						<Select id="tags" multiple>
							<SelectTrigger className="h-auto">
								<SelectValue placeholder="Select tags" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="team-building">Team Building</SelectItem>
									<SelectItem value="company-event">Company Event</SelectItem>
									<SelectItem value="social">Social</SelectItem>
									<SelectItem value="training">Training</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="status">
							Status
						</Label>
						<Select id="status">
							<SelectTrigger className="h-auto">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="upcoming">Upcoming</SelectItem>
									<SelectItem value="past">Past</SelectItem>
									<SelectItem value="all">All</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="date-range">
							Date Range
						</Label>
						<div className="flex gap-2">
							<Popover>
								<PopoverTrigger asChild>
									<Button className="h-auto flex-col items-start" variant="outline">
										<span className="text-[0.65rem] font-semibold uppercase">Start Date</span>
										<span className="font-normal">2023-06-01</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="max-w-[276px] p-0">
									<Calendar />
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button className="h-auto flex-col items-start" variant="outline">
										<span className="text-[0.65rem] font-semibold uppercase">End Date</span>
										<span className="font-normal">2023-12-31</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="max-w-[276px] p-0">
									<Calendar />
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="sort-by">
							Sort By
						</Label>
						<Select id="sort-by">
							<SelectTrigger className="h-auto">
								<SelectValue placeholder="Select sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="date-asc">Date (Ascending)</SelectItem>
									<SelectItem value="date-desc">Date (Descending)</SelectItem>
									<SelectItem value="name-asc">Name (A-Z)</SelectItem>
									<SelectItem value="name-desc">Name (Z-A)</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="sort-order">
							Sort Order
						</Label>
						<Select id="sort-order">
							<SelectTrigger className="h-auto">
								<SelectValue placeholder="Select sort order" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="asc">Ascending</SelectItem>
									<SelectItem value="desc">Descending</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label className="text-sm font-medium" htmlFor="user">
							User
						</Label>
						<Select id="user">
							<SelectTrigger className="h-auto">
								<SelectValue placeholder="Select user" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="john-doe">John Doe</SelectItem>
									<SelectItem value="jane-smith">Jane Smith</SelectItem>
									<SelectItem value="bob-johnson">Bob Johnson</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="mt-4 flex justify-end gap-2">
					<Button size="sm" variant="outline">
						Clear
					</Button>
					<Button size="sm">Apply</Button>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
