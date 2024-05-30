import { MutableRefObject, RefObject, useEffect, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import getCroppedImg from '@/helpers/cropper'

export type ImageCropperProps = {
	imageUrl: string | null
	onCropRef: MutableRefObject<(() => Promise<null | Blob>) | null>
	aspect?: number
	width?: number
	height?: number
	borderRadius?: string
}

export const ImageCropper = ({
	imageUrl,
	onCropRef,
	aspect = 1,
	width = 300,
	height = 300,
	borderRadius = '50%',
}: ImageCropperProps) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1.15)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
		x: 0,
		y: 0,
		height: 0,
		width: 0,
	})

	const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}

	const onCrop = () => {
		if (!imageUrl) {
			throw new Error('Image URL is not defined')
		}
		return getCroppedImg(imageUrl, croppedAreaPixels)
	}

	useEffect(() => {
		if (onCropRef) {
			onCropRef.current = onCrop
		}
	}, [imageUrl, croppedAreaPixels, onCropRef])

	return (
		<Cropper
			image={imageUrl || undefined}
			crop={crop}
			zoom={zoom}
			aspect={aspect}
			onCropChange={setCrop}
			onCropComplete={onCropComplete}
			onZoomChange={setZoom}
			style={{
				containerStyle: {
					position: 'relative',
					height,
					width,
				},
				mediaStyle: {
					display: 'block',
					flex: 1,
				},
				cropAreaStyle: {
					borderRadius,
					height,
					width,
				},
			}}
		/>
	)
}
