'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Post } from '@/types/post'
import PostItem from '@/components/PostItem'

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
						.map((post) => <PostItem post={post} key={post.id} />)
				)}
			</div>
		</div>
	)
}

export default Posts
