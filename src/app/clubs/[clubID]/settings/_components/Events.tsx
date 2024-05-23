import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuContent,
	DropdownMenu,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectGroup,
	SelectContent,
	Select,
} from '@/components/ui/select'
import { PopoverTrigger, PopoverContent, Popover } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
	PaginationPrevious,
	PaginationItem,
	PaginationLink,
	PaginationEllipsis,
	PaginationNext,
	PaginationContent,
	Pagination,
} from '@/components/ui/pagination'

export default function EventsContent() {
	return (
		<div className="flex flex-col">
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
				<div className="flex items-center">
					<h1 className="text-lg font-semibold md:text-2xl">Events</h1>
					<div className="ml-auto flex items-center gap-4">
						<div className="relative w-full max-w-md">
							<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
							<Input
								className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
								placeholder="Search events..."
								type="search"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="sm" variant="outline">
									<FilterIcon className="mr-2 h-4 w-4" />
									Filter
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[300px]">
								<DropdownMenuLabel>Filter by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="grid gap-4">
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
														<span className="text-[0.65rem] font-semibold uppercase">
															Start Date
														</span>
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
						<Button className="ml-auto" size="sm">
							Create Event
						</Button>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					<div className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
						<h3 className="text-lg font-medium">Company Picnic</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">June 15, 2023 - 12:00 PM</p>
						<div className="mt-4 flex items-center justify-between">
							<Button size="sm">View</Button>
							<Button size="sm" variant="outline">
								Edit
							</Button>
						</div>
					</div>
					<div className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
						<h3 className="text-lg font-medium">Team Offsite</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">July 10, 2023 - 9:00 AM</p>
						<div className="mt-4 flex items-center justify-between">
							<Button size="sm">View</Button>
							<Button size="sm" variant="outline">
								Edit
							</Button>
						</div>
					</div>
					<div className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
						<h3 className="text-lg font-medium">Holiday Party</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">December 15, 2023 - 7:00 PM</p>
						<div className="mt-4 flex items-center justify-between">
							<Button size="sm">View</Button>
							<Button size="sm" variant="outline">
								Edit
							</Button>
						</div>
					</div>
					<div className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-800">
						<h3 className="text-lg font-medium">Quarterly Review</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">September 1, 2023 - 2:00 PM</p>
						<div className="mt-4 flex items-center justify-between">
							<Button size="sm">View</Button>
							<Button size="sm" variant="outline">
								Edit
							</Button>
						</div>
					</div>
				</div>
				<div className="mt-8 flex justify-center">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#" isActive>
									2
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">3</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</main>
		</div>
	)
}

function FilterIcon() {
	return (
		<svg
			{}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
	)
}

function SearchIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	)
}
