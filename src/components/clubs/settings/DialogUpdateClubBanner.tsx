import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Club } from '@/types/club'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

const MAX_FILE_SIZE = 5000000 // ~5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formSchema = z.object({
	banner: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.',
		),
})

export type ClubBannerFormProps = {
	club: Club
}

const ClubBannerEditForm: React.FC<ClubBannerFormProps> = ({ club, ...props }) => {
	const [imagePreview, setImagePreview] = useState<string | null>(
		club ? club.banner_url : '/main_photo.jpeg',
	)

	const axiosAuth = useAxiosInterceptor()

	useEffect(() => {
		setImagePreview(club ? club.banner_url : null)
	}, [club])
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			banner: club?.banner_url,
		},
	})

	const updateClubBanner = async (values: z.infer<typeof formSchema>) => {
		try {
			if (!values.banner) {
				toast.error('Select image')
				return
			}

			const formData = new FormData()
			formData.append('banner', values.banner)

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
			}

			toast.success('Club banner successfully have changed!')
		} catch (e) {
			console.log(e)
		}
	}
	return (
		<div {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(updateClubBanner)}>
					{club ? (
						<FormField
							control={form.control}
							name="banner"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Image
											src={imagePreview ? imagePreview : '/main_photo.jpeg'}
											alt={`${club.name}'s banner`}
											width={400}
											height={200}
										/>
									</FormLabel>
									<FormControl>
										<Input
											type="file"
											ref={field.ref}
											name={field.name}
											onBlur={field.onBlur}
											onChange={(e) => {
												const file = e.target.files?.[0]
												field.onChange(file)
												setImagePreview(file ? URL.createObjectURL(file) : club?.banner_url)
											}}
										/>
									</FormControl>
									<Button type="submit" className="w-full">
										Set new banner picture
									</Button>
								</FormItem>
							)}
						/>
					) : (
						<Skeleton className="h-12 w-12 rounded-full" />
					)}
				</form>
			</Form>
		</div>
	)
}

export type DialogUpdateClubBannerProps = {
	club: Club
}

export function DialogUpdateClubBanner({ club }: DialogUpdateClubBannerProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-40" variant="secondary">
					Update Club banner
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Club banner</DialogTitle>
					<DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<ClubBannerEditForm club={club} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
