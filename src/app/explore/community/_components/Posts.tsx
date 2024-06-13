'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Post } from '@/types/post'
import Link from 'next/link'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { truncateText } from '@/helpers/truncateText'

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
		<div className="overflow-auto bg-white p-4 dark:bg-[#020817]">
			<h2 className="mb-4 text-lg font-semibold">Posts</h2>
			<div className="grid gap-4">
				{loadingPosts ? (
					<div>Loading...</div>
				) : (
					posts
						?.slice()
						.reverse()
						.map((post) => (
							<div key={post.id}>
								<Card>
									<CardHeader>
										<div className="flex justify-between px-4">
											<div className="flex items-center gap-3">
												<img
													src={post.club.logo_url}
													alt="Club Logo"
													width={40}
													height={40}
													className="rounded-full"
												/>
												<Link href={`/clubs/${post.club.id}`}>
													<div className="font-medium">{post.club.name}</div>
												</Link>
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-500">
												<div>
													Created:{' '}
													{new Date(post.created_at).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													})}
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="p-8 pt-0">
										{post.cover_images?.length === 0 && <div>No images attached.</div>}
										<div className="relative">
											<Carousel>
												<CarouselContent>
													{post.cover_images?.map((image, index) => (
														<CarouselItem key={index} className="relative h-full w-full rounded-xl">
															<div className="absolute inset-0 h-full w-full overflow-hidden rounded-xl">
																<img
																	src={image.url}
																	alt={image.name}
																	className="absolute inset-0 h-full w-full rounded-xl object-cover blur-2xl filter"
																	style={{
																		transform: 'scale(1.1)',
																	}}
																/>
																<div className="absolute inset-0 h-full w-full bg-black opacity-50"></div>{' '}
																{/* Optional dark overlay for better contrast */}
															</div>
															<img
																src={image.url}
																alt={image.name}
																className="relative z-10 h-full max-h-[500px] w-full rounded-xl object-scale-down"
															/>
														</CarouselItem>
													))}
												</CarouselContent>
												{post.cover_images && post.cover_images.length > 1 && (
													<>
														<CarouselPrevious>Previous</CarouselPrevious>
														<CarouselNext>Next</CarouselNext>
													</>
												)}
											</Carousel>
										</div>

										<div className="mb-2 mt-4 flex items-center gap-2">
											{post.tags ? (
												post.tags.map((tag) => (
													<div
														key={tag}
														className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
													>
														#{tag}
													</div>
												))
											) : (
												<span>No tags</span>
											)}
										</div>
										<h3 className="mb-2 text-xl font-semibold">
											<Link href={`/posts/${post.id}`}>{post.title}</Link>
										</h3>
										<p
											className="mb-2 line-clamp-4 overflow-hidden whitespace-pre-line text-sm text-gray-500 dark:text-gray-400"
											dangerouslySetInnerHTML={{ __html: truncateText(post.description, 50) }}
										></p>
										<div className="flex items-center gap-2">
											<Link href={`/posts/${post.id}`}>
												<Button variant={'link'}>
													<p>&rarr; Go to post</p>
												</Button>
											</Link>
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
