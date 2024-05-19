import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Club, ClubMember } from '@/types/club'
import { Separator } from '@/components/ui/separator'
import ClubImage from '@/components/st/ClubImage'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Students from '@/app/admin-dashboard/dashboard/_components/Students'
import Clubs from '@/app/admin-dashboard/dashboard/_components/Clubs'
import Events from '@/app/admin-dashboard/dashboard/_components/Events'
import Reports from '@/app/admin-dashboard/dashboard/_components/Reports'

type DetailedClubDialogProps = {
	club: Club | null
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
	clubMembers: ClubMember[]
}

export function DetailedClubDialog({
	club,
	isOpen,
	onClose,
	onDelete,
	clubMembers,
}: DetailedClubDialogProps) {
	const router = useRouter()
	if (!club) return null
	console.log(club)

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-[825px]">
					<DialogHeader>
						<DialogTitle>{club.name}</DialogTitle>
						<DialogDescription>{club.club_type}</DialogDescription>
					</DialogHeader>
					<Card className="m-4 bg-muted/70">
						<CardHeader className="pb-3">
							<CardTitle className="text-center text-lg">{club.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<Card>
								<CardContent>
									<div className="flex flex-row items-center py-4">
										<ClubImage club={club} height={150} width={150} />
										<p className="py w-80 pl-10">
											{club.description || 'No description provided.'}
										</p>
									</div>

									<p className="py-4">
										Club Type:{' '}
										<Badge variant="default" className=" text-md px-1.5">
											{club.club_type}
										</Badge>
									</p>
									<Separator />

									<p className="items-center py-4">
										Number of Members:{' '}
										<Badge variant="default" className="px-1.5 text-sm">
											{club.num_of_members}
										</Badge>
									</p>
								</CardContent>
							</Card>

							<Tabs defaultValue="students" className="pt-4 " activationMode="manual">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="members">Club Members</TabsTrigger>
									<TabsTrigger value="events">Club Events</TabsTrigger>
								</TabsList>
								<TabsContent value="members">
									<Card>
										<CardHeader>
											<CardTitle>Club Members</CardTitle>
										</CardHeader>
										<CardContent>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Username</TableHead>
														<TableHead>LastName</TableHead>
														<TableHead>Barcode</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{clubMembers.map((member) => (
														<TableRow key={member.id}>
															<TableCell>{member.first_name}</TableCell>
															<TableCell>{member.last_name}</TableCell>
															<TableCell>{member.barcode}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="events">
									<p>Future Events</p>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
					<DialogFooter>
						{/* link to the club */}
						<Link href={`/clubs/${club.id}`} target="_blank">
							<Button>View Club</Button>
						</Link>

						<Button variant={'destructive'} onClick={onDelete}>
							Delete Club
						</Button>
						<Button onClick={onClose}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
