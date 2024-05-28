import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import { ImageCropper } from '@/components/ImgCropper'

export function DialogUpdateClubBanner() {
	const { club } = useClubStore()

	const [logoUrl, setLogoUrl] = useState(club?.logo_url)
	const [imageUrl, setImageUrl] = useState<string | null>(club?.logo_url ? club?.logo_url : null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const onCropRef = useRef<(() => Promise<null | Blob>) | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const axiosAuth = useAxiosInterceptor()

	const updateClubBanner = async () => {
		try {
			if (!onCropRef.current) {
				throw new Error('Crop function is not defined')
			}
			onCropRef.current().then(async (croppedImgBlob) => {
				const formData = new FormData()
				formData.append('banner', croppedImgBlob ? croppedImgBlob : '')

				const response = await axiosAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/banner`,
					{
						method: 'PATCH',
						data: formData,
					},
				)

				if (response.status !== 200) {
					toast.error('Change banner error', {
						description: response.data.error,
					})
				} else {
					toast.success('Club banner successfully have changed!')
				}
			})
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
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

			<Button
				onClick={() => {
					inputRef.current?.click()
				}}
				className="w-40"
				variant="secondary"
			>
				Upload Club Banner
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col sm:max-w-[425px]">
					<DialogHeader className="">
						<DialogTitle>Update Club Banner</DialogTitle>
					</DialogHeader>

					<div className="flex justify-center">
						{imageUrl && (
							<ImageCropper
								imageUrl={imageUrl}
								onCropRef={onCropRef}
								aspect={25 / 4}
								borderRadius="0"
								width={450}
								height={200}
							/>
						)}
					</div>
					<Button type="button" onClick={updateClubBanner} className="w-max">
						Set new club Banner
					</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}
