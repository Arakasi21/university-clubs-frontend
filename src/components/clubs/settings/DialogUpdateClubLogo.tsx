import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
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
	logo: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.',
		),
})

export type ClubLogoFormProps = {
	club: Club
}

const ClubLogoEditForm: React.FC<ClubLogoFormProps> = ({ club, ...props }) => {
	const [imagePreview, setImagePreview] = useState<string | null>(
		club.logo_url ? club.logo_url : '/main_photo.jpeg',
	)

	const axiosAuth = useAxiosInterceptor()

	useEffect(() => {
		setImagePreview(club.logo_url ? club.logo_url : '/main_photo.jpeg')
	}, [club])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			logo: club?.logo_url,
		},
	})

	const updateClubLogo = async (values: z.infer<typeof formSchema>) => {
		try {
			if (!values.logo) {
				toast.error('Select image')
				return
			}

			const formData = new FormData()
			formData.append('logo', values.logo)

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
		} catch (e) {
			console.log(e)
		}
	}
	return (
		<div {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(updateClubLogo)}>
					{club ? (
						<FormField
							control={form.control}
							name="logo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Image
											src={imagePreview ? imagePreview : '/main_photo.jpeg'}
											alt={`${club.name}'s logo`}
											width={250}
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
												setImagePreview(
													file ? URL.createObjectURL(file) : club?.logo_url || '/main_photo.jpeg',
												)
											}}
										/>
									</FormControl>
									<Button type="submit" className="w-full">
										Set new club logo
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

export type DialogUpdateClubLogoProps = {
	club: Club
}

export function DialogUpdateClubLogo({ club }: DialogUpdateClubLogoProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-40" variant="secondary">
					Update Club Logo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Club Logo</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<ClubLogoEditForm club={club} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
