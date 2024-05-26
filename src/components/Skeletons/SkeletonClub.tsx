import { Skeleton } from '@/components/ui/skeleton'
import ClubImage from '@/components/clubs/ClubImage'

export default function SceletonClub() {
	return (
		<>
			<div className="flex min-h-screen flex-col bg-white text-white dark:bg-[#020817]">
				<div className="px-6 py-12">
					<div className="mx-auto max-w-6xl">
						{/* Banner Section */}
						<Skeleton className="h-40 w-full rounded-t-lg" />

						{/* Club Details Section */}
						<div className="flex items-center justify-between gap-4 rounded-b-lg bg-[#0c1125] p-6">
							<div className="flex items-center gap-2">
								<div className="h-20 w-20 rounded-full">
									<Skeleton className="w-84 h-20" />
								</div>
								<div className="pl-4">
									<Skeleton className="h-6 w-48" />
								</div>
							</div>
							<div className="flex flex-row gap-3">
								<Skeleton className="h-10 w-28" />
								<Skeleton className="h-10 w-28" />
							</div>
						</div>
					</div>

					{/* Club Members Card */}
					<div className="mx-96 mt-8">
						<Skeleton className="h-24 w-full" />
					</div>

					{/* Events, Posts, Achievements Cards */}
					<div className="mx-96 mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 ">
						{[...Array(3)].map((_, index) => (
							<div key={index} className=" rounded-lg bg-[#0c1125]">
								<Skeleton className="h-32 px-4" />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
