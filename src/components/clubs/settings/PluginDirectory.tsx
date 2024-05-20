import React from 'react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export default function PluginDirectory() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Plugins Directory</CardTitle>
				<CardDescription>
					The directory within your project, in which your plugins are located.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="flex flex-col gap-4">
					<Input placeholder="Project Name" defaultValue="/content/plugins" />
					<div className="flex items-center space-x-2">
						<Checkbox id="include" defaultChecked />
						<label htmlFor="include" className="text-sm font-medium">
							Allow administrators to change the directory.
						</label>
					</div>
				</form>
			</CardContent>
			<CardFooter className="border-t px-6 py-4">
				<Button>Save</Button>
			</CardFooter>
		</Card>
	)
}
