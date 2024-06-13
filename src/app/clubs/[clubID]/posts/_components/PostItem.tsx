import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PaperclipIcon, PencilIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Image, Post, PostFile } from '@/types/post'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

export type PostItemProps = {
	post: Post
	onUpdate: (updatedPost: Post) => void
	onDelete: (postId: string) => void
}

function PostItem({ post, onUpdate, onDelete }: PostItemProps) {
	const axiosAuth = useAxiosInterceptor()

	//booleans
	const [isInEditMode, setIsInEditMode] = useState(false)
	const [isChanged, setIsChanged] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isDropdownShown, setIsDropdownShown] = useState(false)

	const [newTag, setNewTag] = useState('')
	const [imageFile, setImageFile] = useState<File | undefined>(undefined)
	const inputRef = useRef<HTMLInputElement | null>(null)

	//partial update
	const [title, setTitle] = useState(post.title)
	const [description, setDescription] = useState(post.description)
	const [tags, setTags] = useState(post.tags)
	const [cover_images, setCoverImages] = useState(post.cover_images || [])
	const [attached_files, setAttachedFiles] = useState(post.attached_files || [])

	const partialUpdateData = () => {
		let data: any = {}

		if (title != post.title) data.title = title
		if (description != post.title) data.description = description
		if (tags.toString() != post.tags.toString()) data.tags = tags
		if (cover_images != post.cover_images) data.cover_images = cover_images
		if (attached_files != post.attached_files) data.attached_files = attached_files

		return data
	}

	const haveChanged = () => {
		if (title != post.title) {
			setIsChanged(true)
			return
		}
		if (description != post.title) {
			setIsChanged(true)
			return
		}
		if (tags.toString() != post.tags.toString()) {
			setIsChanged(true)
			return
		}
		if (cover_images != post.cover_images) {
			setIsChanged(true)
			return
		}
		if (attached_files != post.attached_files) {
			setIsChanged(true)
			return
		}

		setIsChanged(false)
	}

	//handle post
	const handleEditPost = () => {
		setIsInEditMode(true)
	}

	const handleCancelEdit = () => {
		setIsInEditMode(false)
	}

	const handleSavePost = async () => {
		try {
			let response = await axiosAuth.patch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${post.id}`,
				partialUpdateData(),
			)

			if (response.status !== 200) {
				throw new Error(response.data.error)
			}

			onUpdate(response.data.post)
			toast.success('Post updated successfully')
		} catch (error: any) {
			console.error('Error:', error)
			toast.error('Failed to update post', { description: error.message })
		}
	}

	const handleDeletePost = async (postId: string) => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${postId}`,
			)
			if (response.status !== 200) {
				throw new Error(response.data.error)
			}

			onDelete(postId)
			setIsChanged(false)
			toast.success('Post successfully deleted!')
		} catch (error: any) {
			console.error('Error:', error)
			toast.error('Failed to update post', { description: error.message })
		}
	}

	// handle tags
	const handleDeleteTag = (tag: string) => {
		setTags((prevState) => prevState.filter((t) => t !== tag))
	}

	const handleAddTag = () => {
		if (newTag.trim() !== '') {
			setTags((prevState) => [...prevState, newTag])
			setNewTag('')
			return
		}

		toast.error('Cannot add empty tag')
	}

	const handleChangeImage = () => {
		setIsDropdownShown(false)
		inputRef.current?.click()
		setIsDialogOpen(true)
	}

	const handleUpdateCoverImage = async () => {
		try {
			if (!imageFile) {
				toast.error('No image selected')
				return
			}

			const uploadedImage = await handleImageUpload()
			if (!uploadedImage) {
				return
			}

			addCoverImage({
				name: uploadedImage.name,
				url: uploadedImage.url,
				type: uploadedImage.type,
				position: cover_images.length + 1,
			})

			handleSavePost()
		} catch (e) {
			toast.error('Failed to change cover image')
		}
	}

	const handleDeleteCoverImage = async (image: Image) => {
		try {
			if (!image) {
				toast.error('No image selected')
				return
			}

			handleDeleteFile(image.url)
				.then(() => {
					deleteCoverImage(image.url)
				})
				.then(() => {
					handleSavePost()
				})
		} catch (e) {
			toast.error('Failed to delete cover image')
		}
	}

	const handleImageUpload = async () => {
		if (!imageFile) {
			toast.error('No image selected')
			return
		}
		const formData = new FormData()
		formData.append('image', imageFile)

		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/lolkek/upload/images`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			)

			if (response.status !== 200) {
				toast.error('Failed to upload image')
				return
			}

			toast.success('Image successfully uploaded!')
			return new Promise<PostFile>((resolve) => resolve(response.data as PostFile))
		} catch (error) {
			toast.error('Failed to upload image')
		}
	}

	const handleDeleteFile = async (url: string) => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/lolkek/upload/files`,
				{
					url: url,
				},
			)

			if (response.status !== 200) {
				toast.error('Failed to upload image')
				return
			}

			toast.success('Image successfully deleted!')
			return new Promise<PostFile>((resolve) => resolve(response.data as PostFile))
		} catch (error) {
			toast.error('Failed to delete image')
		}
	}

	const addCoverImage = (coverImage: Image) => {
		setCoverImages((prevState) => [...prevState, coverImage])
	}

	const deleteCoverImage = (url: string) => {
		setCoverImages((presState) => presState.filter((cv) => cv.url != url))
	}

	useEffect(() => {
		haveChanged()
	}, [title, description, tags, attached_files, cover_images])

	return (
		<Card key={post.id}>
			<CardContent className="mt-6">
				{!isInEditMode ? (
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
								<Badge
									key={tag}
									variant="default"
									className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
								>
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
										<Link href={file.url} className="hover:underline" prefetch={false}>
											{file.name}
										</Link>
									</div>
								</div>
							))}
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button size="sm" variant="outline" onClick={handleEditPost}>
								<PencilIcon className="mr-2 h-4 w-4" />
								Edit
							</Button>
							<Button size="sm" variant="destructive" onClick={() => handleDeletePost(post.id)}>
								<TrashIcon className="mr-2 h-4 w-4" />
								Delete
							</Button>
						</div>
					</div>
				) : (
					<div className="grid gap-4 border-b pb-4 last:border-b-0 last:pb-0">
						<section className="mb-4">
							<div className="rounded-lg bg-accent p-6 dark:bg-[#030a20] sm:p-8">
								<h3 className="text-xl font-semibold">Cover Image</h3>
								<p className=" mb-4 text-sm text-gray-400"> Upload a cover image for your event.</p>

								{cover_images && cover_images.length > 0 ? (
									<Carousel className="w-full max-w-xs">
										<CarouselContent onClick={() => setIsDropdownShown(!isDropdownShown)}>
											{cover_images
												.sort((a, b) => a.position - b.position)
												.map((image) => (
													<CarouselItem key={image.position}>
														<div className="w-full p-1">
															<Card className="w-full">
																<CardContent className="w-fullflex relative aspect-square items-center justify-center p-6">
																	<Button
																		variant="ghost"
																		size="icon"
																		className="absolute right-2 top-2 z-10 rounded-full bg-gray-900/50 text-gray-50 hover:bg-gray-900 dark:bg-gray-50/50 dark:text-gray-900 dark:hover:bg-gray-50"
																		onClick={() => {
																			handleDeleteCoverImage(image)
																		}}
																	>
																		<XIcon className="h-4 w-4" />
																		<span className="sr-only">Delete</span>
																	</Button>
																	<img className=" object-cover" src={image.url} alt="alt" />
																</CardContent>
															</Card>
														</div>
													</CarouselItem>
												))}
										</CarouselContent>
										<CarouselPrevious />
										<CarouselNext />

										{isDropdownShown && (
											<div className="absolute right-4 top-12 z-10 w-48 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800">
												<button
													className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
													onClick={() => {}} //todo: handle delete cover image
												>
													Delete Cover Image
												</button>
												<button
													className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
													onClick={handleChangeImage}
												>
													Change Cover Image
												</button>
											</div>
										)}
									</Carousel>
								) : (
									<button
										className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
										onClick={handleChangeImage}
									>
										Change Cover Image
									</button>
								)}

								<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
									<DialogContent className="flex flex-col sm:max-w-[425px]">
										<DialogHeader className="">
											<DialogTitle>Update cover image</DialogTitle>
										</DialogHeader>

										<div className="flex justify-center" onClick={() => inputRef.current?.click()}>
											{imageFile && (
												<div className="group relative w-full max-w-[400px]">
													<img
														src={URL.createObjectURL(imageFile)}
														alt="Preview"
														className="rounded-lg object-cover"
													/>
													<div className=" absolute inset-0 flex items-center justify-center rounded-lg bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
														<p className="font-medium text-white">Select another image</p>
													</div>
												</div>
											)}
											<div className={imageFile ? 'hidden' : ''}>
												<div
													onClick={() => inputRef.current?.click()}
													className="hover:border-primary-500 dark:hover:border-primary-400 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors dark:border-gray-600"
												>
													<UploadCloudIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
													<p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
														Drag and drop files here or{' '}
														<button className="text-primary-500 dark:text-primary-400 font-medium hover:underline">
															browse
														</button>
													</p>
												</div>
												<Input
													id="image"
													ref={inputRef}
													type="file"
													accept="image/*"
													hidden={true}
													onChange={(e) => {
														setImageFile(e.target.files?.[0])
													}}
												/>
											</div>
										</div>
										<Button type="button" onClick={handleUpdateCoverImage} className="w-max">
											Update
										</Button>
									</DialogContent>
								</Dialog>
							</div>
						</section>
						<div className="flex items-center justify-between">
							<Input
								name="title"
								value={title}
								onChange={(e) => {
									setTitle(e.target.value)
								}}
								className="text-xl font-bold"
							/>
						</div>
						<Textarea
							name="description"
							value={description}
							onChange={(e) => {
								setDescription(e.target.value)
							}}
							className="text-gray-500 dark:text-gray-400"
						/>
						<div className="flex items-center gap-2">
							{tags.map((tag, index) => (
								<div
									key={index}
									className="flex flex-row justify-center rounded-md bg-gray-100 px-2 py-2 align-middle text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
								>
									<p className=" mr-1 flex text-base">{tag}</p>

									<button
										onClick={() => {
											handleDeleteTag(tag)
										}}
									>
										<XIcon size={20} color="#FF0000" className="pt-0.5" />
									</button>
								</div>
							))}
							<div className="flex items-center gap-2">
								<Input
									type="text"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									className="rounded-md px-2 py-1 text-sm"
									placeholder="Enter new tag"
								/>
								<Button
									disabled={newTag == ''}
									className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#ffffff] dark:hover:bg-[#ffffff]/90"
									variant="default"
									onClick={handleAddTag}
								>
									Add Tag
								</Button>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<PaperclipIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
							{attached_files?.map((attachment, index) => (
								<div key={index} className="text-gray-500 dark:text-gray-400">
									<Link href={attachment.url} className="hover:underline" prefetch={false}>
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
								className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
								onClick={handleSavePost}
								disabled={!isChanged}
							>
								Save
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default PostItem
