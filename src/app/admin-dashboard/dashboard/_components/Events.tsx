import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ListEvents from '@/components/admin/ListEvents'

export default function Events() {
	return (
		<div>
			<Tabs defaultValue="students" className="grid flex-1 items-start gap-4 p-4 sm:py-8 md:gap-8">
				<ListEvents />
			</Tabs>
		</div>
	)
}
