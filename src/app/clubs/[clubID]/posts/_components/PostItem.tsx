import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
	DownloadIcon,
	FileIcon,
	FileImage,
	FileQuestionIcon,
	FileText,
	PaperclipIcon,
	PencilIcon,
	PencilLineIcon,
	TrashIcon,
	UploadCloudIcon,
	UploadIcon,
	XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Image, Post, PostFile } from '@/types/post'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { Label } from '@/components/ui/label'

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
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)

	const [newTag, setNewTag] = useState('')
	const [imageFile, setImageFile] = useState<File>()
	const [file, setFile] = useState<File>()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [draggedItem, setDraggedItem] = useState<Image>()

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
		if (tags?.toString() != post.tags?.toString()) data.tags = tags
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
		if (tags?.toString() != post.tags?.toString()) {
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
			setTags((prevState) => {
				if (!prevState) {
					return [newTag]
				}

				if (prevState.includes(newTag)) {
					toast.error('Tag already exists')
					return prevState
				}
				return [...prevState, newTag]
			})
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

			handleImageUpload().then((uploadedImage) => {
				if (!uploadedImage) {
					return
				}

				addCoverImage({
					name: uploadedImage.name,
					url: uploadedImage.url,
					type: uploadedImage.type,
					position: cover_images.length + 1,
				})
				setIsDialogOpen(false)
			})
		} catch (e) {
			toast.error('Failed to change cover image')
		}
	}

	const handleUpdateAttachedFiles = async () => {
		try {
			if (!file) {
				toast.error('No file selected')
				return
			}

			await handleFileUpload().then((uploadedFile) => {
				if (!uploadedFile) {
					return
				}

				addAttachedFile({
					name: uploadedFile.name,
					url: uploadedFile.url,
					type: uploadedFile.type,
				})
			})
		} catch (e) {
			toast.error('Failed to upload file')
		}
	}

	const handleDeleteCoverImage = async (image: Image) => {
		try {
			if (!image) {
				toast.error('No image selected')
				return
			}

			handleDeleteFile(image.url).then(() => {
				deleteCoverImage(image.url)
			})
		} catch (e) {
			toast.error('Failed to delete cover image')
		}
	}

	const handleDeleteAttachedFile = async (file: PostFile) => {
		try {
			if (!file) {
				toast.error('No file selected')
				return
			}

			handleDeleteFile(file.url).then((response) => {
				if (!response) {
					return
				}

				deleteAttachedFile(file.url)
			})
		} catch (e) {
			toast.error('Failed to delete attached file')
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
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/upload/images`,
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

	const handleFileUpload = async () => {
		if (!file) {
			toast.error('No file selected')
			return
		}
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axiosAuth.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/upload`,
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

			toast.success('File successfully uploaded!')
			return new Promise<PostFile>((resolve) => resolve(response.data as PostFile))
		} catch (error) {
			toast.error('Failed to upload file')
		}
	}

	const handleDeleteFile = async (url: string) => {
		try {
			const response = await axiosAuth.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/upload?url=${url}`,
			)

			if (response.status !== 200) {
				toast.error('Failed to upload image')
				return
			}

			toast.success('File successfully deleted!')
			return new Promise<PostFile>((resolve) => resolve(response.data as PostFile))
		} catch (error) {
			toast.error('Failed to delete file')
		}
	}

	const addCoverImage = (coverImage: Image) => {
		setCoverImages((prevState) => [...prevState, coverImage])
	}

	const deleteCoverImage = (url: string) => {
		setCoverImages((presState) => presState.filter((cv) => cv.url != url))
	}

	const addAttachedFile = (file: PostFile) => {
		setAttachedFiles((prevState) => [...prevState, file])
	}

	const deleteAttachedFile = (url: string) => {
		setAttachedFiles((prevState) => prevState.filter((file) => file.url != url))
	}

	const downloadFile = (file: PostFile) => {
		const link = document.createElement('a')
		link.href = file.url
		link.download = file.name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const handleDragStart = (e: any, image: Image) => {
		setIsDragging(true)
		setDraggedItem(image)
		e.dataTransfer.effectAllowed = 'move'
	}
	const handleDragOver = (e: any) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}
	const handleDrop = (e: any, targetImage: Image) => {
		e.preventDefault()
		setIsDragging(false)
		const updatedImages = cover_images.map((image) => {
			if (image.url === draggedItem?.url) {
				return { ...targetImage, position: targetImage.position }
			} else if (image.url === targetImage.url) {
				return { ...draggedItem, position: image.position }
			} else {
				return image
			}
		}) as Image[]
		updatedImages.sort((a, b) => a.position - b.position)
		setCoverImages(updatedImages)
	}
	const handleDragEnd = () => {
		setIsDragging(false)
		setDraggedItem(undefined)
	}

	const handleBack = () => {
		setIsEditDialogOpen(false)
	}

	useEffect(() => {
		haveChanged()
	}, [title, description, tags, attached_files, cover_images])

	useEffect(() => {}, [setAttachedFiles, setCoverImages])

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
						<div className="flex items-center gap-2">
							<p className="text-gray-500 dark:text-gray-400">tags: </p>
							{post.tags ? (
								post.tags.map((tag) => (
									<div
										key={tag}
										className="py-1text-sm rounded-md bg-gray-100 px-2 font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
									>
										#{tag}
									</div>
								))
							) : (
								<span>No tags</span>
							)}
						</div>
						<div>
							{isExpanded ? (
								<p className="mb-4 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
									{post.description}
								</p>
							) : (
								<p className="mb-4 line-clamp-4 overflow-hidden whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
									{post.description}
								</p>
							)}
							<Button size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
								{isExpanded ? 'Show Less' : 'Read More'}
							</Button>
						</div>
						{post.attached_files?.length === 0 && <div>No files attached.</div>}
						<div className="flex items-center gap-2">
							{post.attached_files?.map((file) => (
								<div className="flex items-center gap-2" key={file.name}>
									<PaperclipIcon className="h-4 w-4 text-gray-500" />
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
						</div>
						<div className="flex items-center justify-end gap-2">
							<Link href={`/posts/${post.id}`}>
								<Button size="sm" variant="default">
									View
								</Button>
							</Link>
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
									<Carousel className="w-full max-w-full">
										<CarouselContent onClick={() => setIsDropdownShown(!isDropdownShown)}>
											{cover_images
												.sort((a, b) => a.position - b.position)
												.map((image) => (
													<CarouselItem key={image.position} className="h-full w-full">
														<div className="h-full w-full p-1">
															<Card className="h-full w-full">
																<CardContent className="relative flex h-full w-full items-center justify-center p-6">
																	<Button
																		variant="ghost"
																		size="icon"
																		className="absolute right-2 top-2 z-10 rounded-full bg-gray-900/50 text-gray-50 hover:bg-gray-900 dark:bg-gray-50/50 dark:text-gray-900 dark:hover:bg-gray-50"
																		onClick={() => {
																			setIsEditDialogOpen(true)
																		}}
																	>
																		<PencilLineIcon className="h-4 w-4" />
																		<span className="sr-only">Edit</span>
																	</Button>

																	<img
																		className="h-full max-h-[500px] w-full rounded-xl object-cover"
																		src={image.url}
																		alt="alt"
																	/>
																</CardContent>
															</Card>
														</div>
													</CarouselItem>
												))}
										</CarouselContent>
										<CarouselPrevious />
										<CarouselNext />
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
										<Button
											type="button"
											onClick={handleUpdateCoverImage}
											className="w-max bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
										>
											Update
										</Button>
									</DialogContent>
								</Dialog>
								<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
									<DialogContent className="flex max-w-[80vw] flex-col md:max-w-[70vw] lg:max-w-[60vw]">
										<div className="flex w-full">
											<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
												{cover_images
													.sort((a, b) => a.position - b.position)
													.map((image) => (
														<div
															key={image.position}
															className={`relative max-h-full max-w-full overflow-hidden rounded-lg border ${
																isDragging && draggedItem?.url === image.url
																	? 'cursor-grabbing opacity-50'
																	: 'cursor-grab'
															}`}
															draggable
															onDragStart={(e) => handleDragStart(e, image)}
															onDragOver={handleDragOver}
															onDrop={(e) => handleDrop(e, image)}
															onDragEnd={handleDragEnd}
														>
															<img
																src={image.url}
																alt={`Image ${image.name}`}
																className="absolute inset-0 h-[300px] w-full object-cover blur-lg filter"
															/>
															<img
																src={image.url}
																alt={`Image ${image.name}`}
																className="relative m-auto h-[230px] rounded-md object-scale-down drop-shadow-md"
															/>
															<div className="absolute right-2 top-2 flex gap-2">
																<Button
																	className="hover:bg-accent-foreground/40"
																	variant="ghost"
																	size="icon"
																	onClick={() => handleDeleteCoverImage(image)}
																>
																	<TrashIcon className="  h-5 w-5 text-red-700 dark:text-red-500" />
																	<span className="sr-only">Delete</span>
																</Button>
															</div>
														</div>
													))}
											</div>
										</div>
										<div className="flex items-center justify-between border-t bg-white p-4 dark:bg-gray-950">
											<Button variant="outline" onClick={handleBack}>
												Back
											</Button>
											<Button
												className="bg-blue-200 text-gray-900 hover:bg-blue-200/70 dark:bg-[#1B2436] dark:text-white dark:hover:bg-[#1B2436]/80"
												onClick={handleSavePost}
											>
												Save
											</Button>
											<Button variant="outline" onClick={handleChangeImage}>
												Add more photos
											</Button>
										</div>
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
							{tags?.map((tag, index) => (
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
							<div className="grid gap-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium">Attached Files</h3>
								</div>
								<div className="grid gap-2">
									{attached_files?.map((file, index) => (
										<div
											className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 dark:bg-gray-800"
											key={index}
										>
											<div className="flex items-center gap-3">
												<GetFileIcon type={file.type} />
												<div>
													<p className="font-medium">{file.name}</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="ghost"
													size="icon"
													className="text-gray-500 dark:text-gray-400"
													onClick={() => {
														downloadFile(file)
													}}
												>
													<DownloadIcon className="h-5 w-5" />
													<span className="sr-only">Download file</span>
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="text-red-500"
													onClick={() => {
														handleDeleteAttachedFile(file)
													}}
												>
													<XIcon className="h-5 w-5" />
													<span className="sr-only">Delete file</span>
												</Button>
											</div>
										</div>
									))}
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline">
											<UploadIcon className="mr-2 h-4 w-4" />
											Upload file
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Upload File</DialogTitle>
											<DialogDescription>
												Select a file to upload to your project.
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="space-y-1">
												<Label htmlFor="file">File</Label>
												<Input
													id="file"
													type="file"
													onChange={(e) => {
														setFile(e.target.files?.[0])
													}}
												/>
											</div>
										</div>
										<DialogFooter>
											<Button type="submit" onClick={handleUpdateAttachedFiles}>
												Upload
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>
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

export default PostItem
