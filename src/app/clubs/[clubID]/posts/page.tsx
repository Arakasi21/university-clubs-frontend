'use client'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClub from '@/hooks/useClub'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import ClubImage from '@/components/clubs/ClubImage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/types/post'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaperclipIcon, PencilIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { DialogCreatePost } from '@/components/clubs/posts/DialogCreatePost'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

function Page({ params }: { params: { clubID: number } }) {
	const axiosAuth = useAxiosInterceptor()
	const { user } = useUserStore()
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(true)
	const { club, fetchClubInfo, isOwner } = useClub({
		clubID: params.clubID,
		user: user,
	})

	const [isEditMode, setIsEditMode] = useState(false)
	const [selectedPost, setSelectedPost] = useState<Post | null>(null)
	const handleEditPost = (post: Post) => {
		setSelectedPost(post)
		setIsEditMode(true)
	}

	const handleCancelEdit = () => {
		setSelectedPost(null)
		setIsEditMode(false)
	}

	const handleSavePost = async (updatedPost: Post) => {
		try {
			await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${updatedPost.id}`,
				updatedPost,
			)
			toast.success('Post updated successfully')
			setPosts((prevPosts) =>
				prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
			)
			setSelectedPost(null)
			setIsEditMode(false)
		} catch (error) {
			console.error('Error:', error)
			toast.warning('Failed to update post')
		}
	}

	const handleDeletePost = async (postId: string) => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${postId}`,
			)
			if (response.status !== 200) {
				toast.warning('Failed to delete post', { description: response.data.error })
				return
			}
			toast.success('Post successfully deleted!')
			setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
		} catch (error) {
			console.error('ERROR', { description: 'An error occurred while trying to delete post.' })
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		if (selectedPost) {
			setSelectedPost({ ...selectedPost, [name]: value })
		}
	}

	const fetchClubPosts = useCallback(async () => {
		try {
			const response = await axiosAuth.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/posts?page=1&page_size=20`,
			)
			setPosts(response.data.posts)
			setLoading(false)
		} catch (error) {
			console.error('Error:', error)
			setLoading(false)
		}
	}, [params.clubID])

	useEffect(() => {
		fetchClubPosts()
	}, [fetchClubPosts])

	useEffect(() => {
		// Ensure re-render when posts are updated, including when the last post is deleted
	}, [posts])

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<Nav />
			<div className="absolute h-[320px] w-full overflow-hidden rounded-sm dark:shadow-2xl dark:shadow-[#020817]/40">
				<img
					className="z-1 h-full w-full object-cover object-center"
					height={600}
					src={club?.banner_url}
					alt={club?.name}
					style={{ aspectRatio: '1920/600', objectFit: 'cover' }}
					width={1920}
				/>
				<div className="z-1 absolute inset-0 bg-gradient-to-b from-transparent/30 to-[#ffffff]/100 dark:bg-gradient-to-b dark:from-transparent/30 dark:to-[#020817]/80" />
				<div className="z-1 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#ffffff]/40 dark:bg-gradient-to-t dark:from-[#020817]/90" />
			</div>
			<div className="sm:mx-o relative z-30 mx-5 max-w-6xl py-12 sm:p-12 md:mx-auto">
				<BackgroundClubImage club={club} />
				<div className="rounded-lg bg-accent dark:bg-[#0c1125]">
					<div className="flex items-center justify-between gap-4 p-6">
						<div className="flex items-center">
							<div className="flex shrink-0 overflow-hidden rounded-full">
								<ClubImage club={club} width={84} height={84} />
							</div>
							<div className="pl-4">
								<CardTitle>{club?.name}</CardTitle>
								<CardDescription>{club?.description}</CardDescription>
							</div>
						</div>
					</div>
				</div>
				<Card className="mt-4 bg-accent dark:bg-[#0D1525]">
					<CardHeader className="flex gap-4">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center">
								<div>
									<CardTitle>Club Posts</CardTitle>
									<CardDescription className="flex items-center justify-between">
										Manage club posts. You can create, edit, and delete posts.
									</CardDescription>
								</div>
							</div>
							<div className="flex flex-row gap-3">
								<div className="flex gap-3">
									{club && <DialogCreatePost club={club} onCreateSuccess={fetchClubPosts} />}
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6">
							{posts.length === 0 ? (
								<div>No posts available.</div>
							) : (
								posts.map((post) => (
									<Card key={post.id}>
										<CardContent className="mt-6">
											{!isEditMode || selectedPost?.id !== post.id ? (
												<div className="grid gap-4 border-b pb-4 last:border-b-0 last:pb-0">
													<div className="flex items-center justify-between">
														<h1 className="text-xl font-bold">{post.title}</h1>
														<div className="flex items-center gap-2 text-sm text-gray-500">
															<div>
																Created:{' '}
																{new Date(post.created_at).toLocaleDateString('en-US', {
																	year: 'numeric',
																	month: 'long',
																	day: 'numeric',
																})}
															</div>
															<div>
																Updated:{' '}
																{post.updated_at
																	? new Date(post.updated_at).toLocaleDateString('en-US', {
																			year: 'numeric',
																			month: 'long',
																			day: 'numeric',
																		})
																	: null}
															</div>
														</div>
													</div>
													<p className="text-gray-500">{post.description}</p>
													<div className="flex items-center gap-2">
														{post.tags.map((tag) => (
															<Badge key={tag} variant="default">
																{tag}
															</Badge>
														))}
													</div>
													{post.cover_images?.length === 0 && <div>No images attached.</div>}
													<div className="grid grid-cols-3 gap-4">
														{post.cover_images?.map((image) => (
															<div className="flex flex-col gap-2" key={image.url}>
																<img
																	src={image.url}
																	alt="Post Cover"
																	width={400}
																	height={300}
																	className="aspect-[4/3] rounded-lg object-cover"
																/>
															</div>
														))}
													</div>
													{post.attached_files?.length === 0 && <div>No files attached.</div>}
													<div className="flex items-center gap-2">
														{post.attached_files?.map((file) => (
															<div className="flex items-center gap-2" key={file.name}>
																<PaperclipIcon className="h-4 w-4 text-gray-500" />
																<div className="text-gray-500">
																	<Link
																		href={file.url}
																		className="hover:underline"
																		prefetch={false}
																	>
																		{file.name}
																	</Link>
																</div>
															</div>
														))}
													</div>
													<div className="flex items-center justify-end gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleEditPost(post)}
														>
															<PencilIcon className="mr-2 h-4 w-4" />
															Edit
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() => handleDeletePost(post.id)}
														>
															<TrashIcon className="mr-2 h-4 w-4" />
															Delete
														</Button>
													</div>
												</div>
											) : (
												<div className="grid gap-4 border-b pb-4 last:border-b-0 last:pb-0">
													<div className="flex items-center justify-between">
														<Input
															name="title"
															value={selectedPost.title}
															onChange={handleInputChange}
															className="text-xl font-bold"
														/>
													</div>
													<Textarea
														name="description"
														value={selectedPost.description}
														onChange={handleInputChange}
														className="text-gray-500 dark:text-gray-400"
													/>
													<div className="flex items-center gap-2">
														{selectedPost.tags.map((tag, index) => (
															<div
																key={index}
																className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
															>
																{tag}
															</div>
														))}
													</div>
													<div className="grid grid-cols-3 gap-4">
														{selectedPost.cover_images?.map((image, index) => (
															<img
																key={index}
																src={image.url}
																alt={`Post Cover ${index}`}
																width={400}
																height={300}
																className="aspect-[4/3] rounded-lg object-cover"
															/>
														))}
													</div>
													<div className="flex items-center gap-2">
														<PaperclipIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
														{selectedPost.attached_files?.map((attachment, index) => (
															<div key={index} className="text-gray-500 dark:text-gray-400">
																<Link
																	href={attachment.url}
																	className="hover:underline"
																	prefetch={false}
																>
																	{attachment.name}
																</Link>
															</div>
														))}
													</div>
													{/* TODO ADD FILE ATTACHMENT */}
													<div className="flex items-center gap-2"></div>
													<div className="flex items-center justify-end gap-2">
														<Button
															size="sm"
															variant="outline"
															className="dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
															onClick={handleCancelEdit}
														>
															Cancel
														</Button>
														<Button
															size="sm"
															className="dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
															onClick={() => handleSavePost(selectedPost)}
														>
															Save
														</Button>
													</div>
												</div>
											)}
										</CardContent>
									</Card>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default Page
