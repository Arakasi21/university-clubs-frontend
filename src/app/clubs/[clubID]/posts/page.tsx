'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClub from '@/hooks/useClub'
import useUserStore from '@/store/user'
import Nav from '@/components/NavBar'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import ClubImage from '@/components/clubs/ClubImage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/types/post'
import { DialogCreatePost } from '@/components/clubs/posts/DialogCreatePost'
import PostItem from '@/app/clubs/[clubID]/posts/_components/PostItem'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function Page({ params }: { params: { clubID: number } }) {
	const axiosAuth = useAxiosInterceptor()
	const { user } = useUserStore()

	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(true)
	const { club, fetchClubInfo, isOwner } = useClub({
		clubID: params.clubID,
		user: user,
	})

	const handleDeletePost = (postId: string) => {
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
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

	const onUpdate = (updatedPost: Post) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
		)
	}

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
						<div>
							<Link href={`/clubs/${club?.id}`}>
								<Button size="sm" variant="secondary">
									Back to Club Page
								</Button>
							</Link>
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
								posts
									?.slice()
									.reverse()
									.map((post) => (
										<PostItem
											post={post}
											key={post.id}
											onUpdate={onUpdate}
											onDelete={handleDeletePost}
										/>
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
