import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonClubs() {
	return (
		<>
			<div className="flex justify-center pt-10">
				<Skeleton className="h-12 w-[450px]" />
			</div>
			<div className="mx-96 grid grid-cols-1 pt-8 md:grid-cols-2 lg:grid-cols-3">
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
				<div className="flex flex-col space-y-3 pt-8">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
				<div className="flex flex-col space-y-3 pt-8">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
				<div className="flex flex-col space-y-3 pt-8">
					<Skeleton className="h-[300px] w-[350px] rounded-xl" />
				</div>
			</div>
		</>
	)
}
