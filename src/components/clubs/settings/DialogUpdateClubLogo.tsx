import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import useClubStore from '@/store/club'
import { Input } from '@/components/ui/input'
import { ImageCropper } from '@/components/ImgCropper'

export function DialogUpdateClubLogo() {
	const { club } = useClubStore()

	const [imageUrl, setImageUrl] = useState<string | null>(club?.logo_url ? club?.logo_url : null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const onCropRef = useRef<(() => Promise<null | Blob>) | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const axiosAuth = useAxiosInterceptor()
	const updateClubLogo = async () => {
		try {
			if (!onCropRef.current) {
				console.log('Crop function is not defined')
				toast.error('An error occurred while updating the club logo.')
				return
			}
			onCropRef.current().then(async (croppedImgBlob) => {
				const formData = new FormData()
				formData.append('logo', croppedImgBlob ? croppedImgBlob : '')

				const response = await axiosAuth(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club?.id}/logo`,
					{
						method: 'PATCH',
						data: formData,
					},
				)

				if (response.status !== 200) {
					toast.error('Change logo error', {
						description: response.data.error,
					})
				}

				toast.success('Club logo successfully have changed!')
				setIsDialogOpen(false)
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
				Upload Club Logo
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col sm:max-w-[525px]">
					<DialogHeader className="">
						<DialogTitle>Update Club Logo</DialogTitle>
					</DialogHeader>

					<div className="flex justify-center">
						{imageUrl && <ImageCropper imageUrl={imageUrl} onCropRef={onCropRef} />}
					</div>
					<Button type="button" onClick={updateClubLogo} className="w-max">
						Set new club logo
					</Button>
				</DialogContent>
			</Dialog>
		</>
	)
}
