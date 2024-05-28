import useUserStore from '@/store/user'
import { User } from '@/types/user'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { ImageCropper } from '@/components/ImgCropper'

const AvatarEditForm: React.FC<AvatarEditFormProps> = ({ user, ...props }) => {
	const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url)
	const [imageUrl, setImageUrl] = useState<string | null>(user ? user.avatar_url : null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const onCropRef = useRef<(() => Promise<null | Blob>) | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

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
				setAvatarUrl(response.data.user.avatar_url)
				toast.success('Your avatar has been changed!')
			})
		} catch (e) {
			console.log(e)
			toast.error('An error occurred while updating the avatar.')
		}
	}

	useEffect(() => {
		setImageUrl(user ? user.avatar_url : null)
		setAvatarUrl(user ? user.avatar_url : '')
	}, [user])

	return (
		<div {...props} className="overflow-hidden">
			<Card>
				<CardHeader>
					<CardTitle>Change Avatar</CardTitle>
				</CardHeader>
				<div className="hidden">
					<Input
						id="image"
						ref={inputRef}
						type="file"
						accept="image/*"
						hidden={true}
						onChange={(e) => {
							const imageFile = e.target.files?.[0]
							if (imageFile) {
								setImageUrl(URL.createObjectURL(imageFile))
								setIsDialogOpen(true)
							}
						}}
					/>
				</div>

				<CardContent>
					<div className="relative inline-block">
						<Image
							src={avatarUrl || ''}
							alt={`${user?.first_name}'s avatar`}
							width={400}
							height={100}
							className="cursor-pointer rounded-full"
						/>
						<Button
							onClick={() => {
								inputRef.current?.click()
							}}
							className="rounded-2 absolute bottom-0 left-0 mb-2 ml-2 border px-2 py-1"
						>
							Upload a photo..
						</Button>
					</div>

					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogContent className="flex flex-col sm:max-w-[425px]">
							<DialogHeader className="">
								<DialogTitle>Edit Avatar</DialogTitle>
							</DialogHeader>

							<div className="flex justify-center">
								{imageUrl && <ImageCropper imageUrl={imageUrl} onCropRef={onCropRef} />}
							</div>
							<Button type="button" onClick={updateUserAvatar} className="w-max">
								Set new profile picture
							</Button>
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
