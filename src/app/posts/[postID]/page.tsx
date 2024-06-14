'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	FileIcon,
	FileImage,
	FileQuestionIcon,
	FileText,
	PaperclipIcon,
	Share2Icon,
} from 'lucide-react'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const PostPage = ({ params }: { params: { postID: number } }) => {
	const [loading, setLoading] = useState(true)
	const [post, setPost] = useState<Post | null>(null)
	const theme = useTheme()

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
				<Card>
					<CardHeader className="pb-2">
						<Link href={`/posts/${post.id}`}>
							<h2 className="pl-2 text-2xl font-bold text-black dark:text-foreground">
								{post.title}
							</h2>
						</Link>
						<div className="flex items-center gap-2 pl-2">
							<p className="text-black/60 dark:text-foreground/40">by </p>
							<Link href={`/clubs/${post.club.id}`} className="flex flex-row items-center gap-2">
								<Avatar className="h-5 w-5">
									<AvatarImage src={post.club.logo_url} />
									<AvatarFallback>
										{post.club.name
											.split(' ')
											.map((word) => word[0].toUpperCase())
											.join('')}
									</AvatarFallback>
								</Avatar>
								<span className="font-medium text-black/60 dark:text-foreground/40">
									{post.club.name}
								</span>
							</Link>
							<span className="font-medium text-black/60 dark:text-foreground/40">
								{' - '}
								{new Date(post.created_at).toLocaleDateString('kz-KZ', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</span>
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
						{/*<h3 className="mb-2 text-xl font-semibold">{post.title}</h3>*/}
						<p className="py-4 text-gray-500 dark:text-gray-400">
							<MarkdownPreview
								source={post.description}
								style={{
									padding: 16,
									backgroundColor: 'inherit',
									color: theme.theme === 'dark' ? '#d1d5db' : '#333',
								}}
								className="light:bg-foreground overflow-hidden whitespace-pre-line bg-foreground text-sm text-gray-500 dark:bg-accent dark:text-gray-400"
							/>
						</p>
						<div className="flex items-center gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="ghost" size="icon">
										<PaperclipIcon className="h-4 w-4" />
										<span className="sr-only">Attachments</span>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Attached Files</DialogTitle>
										<DialogDescription>
											{post.attached_files?.length === 0 && <div>No files attached.</div>}
											{post.attached_files?.map((file) => (
												<div className="flex items-center gap-2 pt-2" key={file.name}>
													<GetFileIcon type={file.type} />
													<div className="text-gray-500">
														<a
															href={file.url}
															className="hover:underline"
															download={file.name}
															target="_blank"
														>
															{file.name}
														</a>
													</div>
												</div>
											))}
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									navigator.clipboard.writeText(`www.ucms.space/posts/${post.id}`)
									toast.success('Link to post saved')
								}}
							>
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

function GetFileIcon({ type }: { type: string }) {
	switch (type) {
		case 'application/pdf':
			return <FileIcon className="h-6 w-6 text-red-500" />
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return <FileText className="h-6 w-6 text-blue-500" />
		case 'image/jpeg':
		case 'image/png':
			return <FileImage className="h-6 w-6 text-green-500" />
		default:
			return <FileQuestionIcon className="h-6 w-6 text-gray-500" />
	}
}

export default PostPage
