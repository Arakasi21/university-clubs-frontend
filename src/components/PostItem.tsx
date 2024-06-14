import React from 'react'
import { Post } from '@/types/post'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { truncateText } from '@/helpers/truncateText'
import { Button } from '@/components/ui/button'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useTheme } from 'next-themes'

export type PostItemProps = {
	post: Post
}

function PostItem({ post }: PostItemProps) {
	const theme = useTheme()
	const limitWords = (text: string, limit: number) => {
		return text.split(' ').slice(0, limit).join(' ')
	}
	return (
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
				<p className="py-4 text-gray-500 dark:text-gray-400">
					<MarkdownPreview
						source={limitWords(post.description, 100)}
						style={{
							padding: 0,
							backgroundColor: 'inherit',
							color: theme.theme === 'dark' ? '#d1d5db' : '#333',
						}}
						className="light:bg-foreground line-clamp-4 overflow-hidden whitespace-pre-line bg-foreground text-sm text-gray-500 dark:bg-accent dark:text-gray-400"
					/>
				</p>
				<div className="flex items-center gap-2">
					<Link href={`/posts/${post.id}`}>
						<Button variant={'link'}>
							<p>&rarr; Go to post</p>
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}

export default PostItem
