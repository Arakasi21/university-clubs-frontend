'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PaperclipIcon, Share2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Post } from '@/types/post'

function Posts() {
	const [loadingPosts, setLoadingPosts] = useState(true)
	const [posts, setPosts] = useState<Post[]>()

	const fetchPosts = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts?page=1&page_size=30`, { method: 'GET' })
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('not found', {
						description: data.error,
					})
					return
				}
				setPosts(data.posts)
				setLoadingPosts(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	useEffect(() => {
		fetchPosts()
	}, [fetchPosts])

	return (
		<div className="overflow-auto bg-white p-4 dark:bg-gray-950">
			<h2 className="mb-4 text-lg font-semibold">Posts</h2>
			<div className="grid gap-4">
				{loadingPosts ? (
					<div>Loading...</div>
				) : (
					posts?.map((post) => (
						<div key={post.id}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<img
											src={post.club.logo_url}
											alt="Club Logo"
											width={40}
											height={40}
											className="rounded-full"
										/>
										<div className="font-medium">{post.club.name}</div>
									</div>
								</CardHeader>
								<CardContent className="p-4">
									{post.cover_images ? (
										<img
											src={post.cover_images[0].url}
											alt="Post Cover"
											width={800}
											height={400}
											className="h-40 w-full rounded-t-lg object-cover"
										/>
									) : (
										<img
											src="/placeholder.svg"
											alt="Post Cover"
											width={800}
											height={400}
											className="h-40 w-full rounded-t-lg object-cover"
										/>
									)}

									<div className="mb-2 mt-4 flex items-center gap-2">
										{post.tags ? (
											post.tags.map((tag) => (
												<div
													key={tag}
													className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
												>
													{tag}
												</div>
											))
										) : (
											<span>No tags</span>
										)}
									</div>
									<h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
									<p className="mb-4 text-gray-500 dark:text-gray-400">{post.description}</p>
									<div className="flex items-center gap-2">
										<Button variant="ghost" size="icon">
											<PaperclipIcon className="h-4 w-4" />
											<span className="sr-only">Attachments</span>
										</Button>
										<Button variant="ghost" size="icon">
											<Share2Icon className="h-4 w-4" />
											<span className="sr-only">Share</span>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default Posts
