import { Skeleton } from '@/components/ui/skeleton'

export default function SceletonMain() {
	return (
		<>
			<div className="mx-96 grid grid-cols-1 gap-8  pt-14 md:grid-cols-2 lg:grid-cols-2">
				<div className="flex flex-col space-y-3">
					<Skeleton className="h-10 w-[480px]" />
					<Skeleton className="h-10 w-[250px] pb-4" />
					<div className="flex flex-col space-y-3 pt-4">
						<Skeleton className="h-4 w-[350px]" />
						<Skeleton className="h-4 w-[480px]" />
						<Skeleton className="h-4 w-[480px]" />
						<Skeleton className="h-4 w-[300px]" />
					</div>

					<div className="space-y-2 pt-4">
						<Skeleton className="h-8 w-[100px] pt-8" />
					</div>
				</div>
				<div className="pt-8">
					<Skeleton className="h-56 w-[480px] pt-20" />
				</div>
			</div>
			<div className="mx-96 grid grid-cols-1 pt-20 md:grid-cols-2 lg:grid-cols-3">
				<div className="flex flex-col  pt-20">
					<Skeleton className="h-[250px] w-[300px] rounded-xl" />
				</div>
				<div className="flex flex-col pt-20">
					<Skeleton className="h-[250px] w-[300px] rounded-xl" />
				</div>
				<div className="flex flex-col pt-20">
					<Skeleton className="h-[250px] w-[300px] rounded-xl" />
				</div>
			</div>
		</>
	)
}
