import { Post } from '@/types/post'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'

export default function ClubPosts(props: { post: Post }) {
	return (
		<Card>
			<CardContent className="flex w-full flex-wrap items-center justify-between gap-2 overflow-hidden rounded-lg p-4 dark:bg-gray-700 sm:flex-nowrap sm:gap-4">
				<div className="flex flex-col">
					<h3 className="text-md font-medium">{props.post.title}</h3>
					<p className="text-sm font-normal text-muted-foreground">
						{new Date(props.post.created_at).toLocaleString()}
					</p>
				</div>
				<div className="flex flex-row items-end">
					<Link href={`/posts/${props.post.id}`}>
						<Button
							className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-900/90"
							variant="outline"
						>
							View
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
