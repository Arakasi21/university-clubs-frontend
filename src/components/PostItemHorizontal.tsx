import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DownloadIcon,
	FileIcon,
	FileImage,
	FileQuestionIcon,
	FileText,
	PaperclipIcon,
	Share2Icon,
	TagIcon,
} from 'lucide-react'
import { Post, PostFile } from '@/types/post'
import React from 'react'
import Link from 'next/link'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useTheme } from 'next-themes'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { GetFileIcon } from '@/app/clubs/[clubID]/posts/_components/PostItem'

export type PostItemHorizontalProps = {
	post: Post
}

export default function PostItemHorizontal({ post }: PostItemHorizontalProps) {
	const theme = useTheme()
	const limitWords = (text: string, limit: number) => {
		return text.split(' ').slice(0, limit).join(' ')
	}
	const downloadFile = (file: PostFile) => {
		const link = document.createElement('a')
		link.href = file.url
		link.download = file.name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<div className="border-current/40 mx-auto w-full max-w-6xl rounded-sm border px-4 py-2 md:px-6 md:py-4 lg:py-5">
			<div className="flex md:flex-row">
				<div className="flex flex-col" />
				<div className="flex flex-col">
					<Link href={`/posts/${post.id}`}>
						<h2 className="text-2xl font-bold text-black dark:text-foreground">{post.title}</h2>
					</Link>
					<div className="flex items-center gap-2">
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
					<div className="flex flex-wrap gap-2">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost" size="icon">
									<PaperclipIcon
										className="h-4 w-4"
										color={theme.theme === 'dark' ? 'white' : 'black'}
									/>
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
						{post.tags?.map((tag, index) => (
							<div
								className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
								key={index}
							>
								<TagIcon className="h-4 w-4" />
								{tag}
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 pt-2">
						<Link href={`/posts/${post.id}`}>
							<Button variant={'link'}>
								<p>&rarr; Go to post</p>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
