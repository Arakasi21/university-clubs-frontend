'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PaperclipIcon, Share2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Post } from '@/types/post'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import Nav from '@/components/NavBar'

const PostPage = ({ params }: { params: { postID: number } }) => {
	const [loading, setLoading] = useState(true)
	const [post, setPost] = useState<Post | null>(null)

	const fetchPostInfo = useCallback(() => {
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${params.postID}`)
			.then(async (res) => {
				const data = await res.json()
				if (!res.ok) {
					toast.error('Post not found', {
						description: data.error,
					})
					return
				}
				setPost(data.post)
				setLoading(false)
			})
			.catch((error) => console.log(error.message))
	}, [params.postID])

	useEffect(() => {
		fetchPostInfo()
	}, [fetchPostInfo])

	if (loading) {
		return <div>Loading...</div>
	}

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<>
			<Nav />
			<div className="md:mx-15 mx-5 my-5 max-w-[1200px] overflow-auto bg-white p-4 dark:bg-[#020817] sm:mx-10 lg:mx-20 xl:mx-auto">
				<h2 className="mb-4 text-lg font-semibold">Post</h2>
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
								<div className="font-medium">{post.club.name}</div>
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
														transform: 'scale(1.1)', // Slightly scale up the background image
													}}
												/>
												<div className="absolute inset-0 h-full w-full bg-black opacity-50"></div>
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
						<h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
						<p
							className="mb-4 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400"
							dangerouslySetInnerHTML={{ __html: post.description }}
						></p>
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
		</>
	)
}

export default PostPage
