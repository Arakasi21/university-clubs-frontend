import React, { useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BanTable from '@/app/clubs/[clubID]/settings/_components/BanTable'
import { Permissions } from '@/types/permissions'
import { hasPermission } from '@/helpers/permissions'

export default function BanSection({
	clubID,
	permissions,
}: {
	clubID: number
	permissions: Permissions
}) {
	const [openedTab, setOpenedTab] = useState<string | null>(null)
	const handleTabClick = (tabValue: string) => {
		setOpenedTab(openedTab === tabValue ? null : tabValue)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Banned Users</CardTitle>
			</CardHeader>
			<CardFooter className="border-t px-6 py-4">
				<Tabs className="w-full ">
					<TabsList>
						<TabsTrigger
							value="ban"
							onClick={() => handleTabClick('ban')}
							className={openedTab === 'ban' ? 'activeTabStyle' : 'defaultTabStyle'}
							disabled={!hasPermission(permissions, Permissions.manage_membership)}
						>
							Banlist
						</TabsTrigger>
					</TabsList>
					{openedTab === 'ban' && (
						<TabsContent value="ban">
							<BanTable clubID={clubID} />
						</TabsContent>
					)}
				</Tabs>
			</CardFooter>
		</Card>
	)
}
