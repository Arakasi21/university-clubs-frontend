import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonClubs() {
	return (
		<>
			<div className="flex justify-center px-4 pt-10">
				<Skeleton className="h-12 w-full md:w-[450px]" />
			</div>
			<div className="grid grid-cols-1 gap-6 px-4 pt-8 md:grid-cols-2 lg:grid-cols-3 xl:px-96">
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-72 w-full rounded-xl" />
			</div>
		</>
	)
}
