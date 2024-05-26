import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonMain() {
	return (
		<>
			<div className="grid grid-cols-1 gap-8 px-6 pt-14 md:grid-cols-2 lg:grid-cols-2 xl:px-96">
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<div className="flex flex-col space-y-3 pt-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
					<div className="space-y-2 pt-4">
						<Skeleton className="h-8 w-24 pt-8" />
					</div>
				</div>
				<div className="pt-8">
					<Skeleton className="h-56 w-full pt-20" />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 px-6 pt-20 md:grid-cols-2 lg:grid-cols-3 xl:px-96">
				<Skeleton className="h-64 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</>
	)
}
