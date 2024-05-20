import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck, GraduationCap, Users } from 'lucide-react'
import React from 'react'

export function StatsComponent(props: { totalUsers: number; totalClubs: number }) {
	return (
		<>
			<Card x-chunk="dashboard-01-chunk-1">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Number of UCMS Users</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						className="text-2xl font-bold"
					>
						{props.totalUsers}
					</div>
					<p className="mt-3 text-xs text-green-500 text-muted-foreground">{`+${0}% from last month`}</p>
				</CardContent>
			</Card>
			<Card x-chunk="dashboard-01-chunk-2">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Number of Clubs</CardTitle>
					<GraduationCap className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						className="text-2xl font-bold"
					>
						{props.totalClubs}
					</div>
					<p className="mt-3 text-xs text-green-500 text-muted-foreground">+0% from last year</p>
				</CardContent>
			</Card>
			<Card x-chunk="dashboard-01-chunk-3">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Active Events</CardTitle>
					<CalendarCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						className="text-2xl font-bold"
					>
						0
					</div>
					<p className="mt-3 text-xs text-muted-foreground">+0 since last week</p>
				</CardContent>
			</Card>
		</>
	)
}
