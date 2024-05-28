import useUserStore from '@/store/user'
import { User } from '@/types/user'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { ImageCropper } from '@/components/ImgCropper'

const AvatarEditForm: React.FC<AvatarEditFormProps> = ({ user, ...props }) => {
	const [image, setImage] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(user ? user.avatar_url : null)
	const onCropRef = useRef<(() => Promise<null | Blob>) | null>(null)

	const axiosAuth = useAxiosInterceptor()
	const { setUser, jwt_token } = useUserStore()

	const updateUserAvatar = async () => {
		try {
			if (!onCropRef.current) {
				throw new Error('Crop function is not defined')
			}
			onCropRef.current().then(async (croppedImgBlob) => {
				const formData = new FormData()
				formData.append('avatar', croppedImgBlob ? croppedImgBlob : '')

				const response = await axiosAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.id}/avatar`,
					{
						method: 'PATCH',
						data: formData,
					},
				)

				if (!response.status.toString().startsWith('2')) {
					toast.error('Change avatar error', {
						description: response.data.error,
					})
					return
				}

				setUser(response.data.user, jwt_token)
				toast.success('Your avatar has been changed!')
			})
		} catch (e) {
			console.log(e)
			toast.error('An error occurred while updating the avatar.')
		}
	}

	useEffect(() => {
		setImageUrl(user ? user.avatar_url : null)
	}, [user])

	return (
		<div {...props} className="overflow-hidden">
			<Card>
				<CardHeader>
					<CardTitle>Change Avatar</CardTitle>
				</CardHeader>
				<CardContent>
					<Dialog>
						<DialogTrigger asChild>
							<Image
								src={imageUrl || ''}
								alt={`${user?.first_name}'s avatar`}
								width={400}
								height={100}
								className="cursor-pointer"
							/>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit Avatar</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="image" className="text-right">
										Choose image
									</Label>
									<Input
										id="image"
										type="file"
										accept="image/*"
										onChange={(e) => {
											const imageFile = e.target.files?.[0]
											if (imageFile) {
												setImageUrl(URL.createObjectURL(imageFile))
												setImage(imageFile)
											}
										}}
									/>
								</div>
								{imageUrl && <ImageCropper imageUrl={imageUrl} onCropRef={onCropRef} />}
							</div>
							<DialogFooter>
								<Button type="button" onClick={updateUserAvatar}>
									Set new profile picture
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</CardContent>
			</Card>
		</div>
	)
}

interface AvatarEditFormProps {
	user: User | null
	className?: string
}

export default AvatarEditForm
