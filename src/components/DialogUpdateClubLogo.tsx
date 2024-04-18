import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
		club ? club.logo_url : '/main_photo.jpeg',
	)

	useEffect(() => {
		setImagePreview(club ? club.logo_url : null)
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

			const response = await fetch(`http://localhost:5000/clubs/${club?.id}/logo`, {
				method: 'PATCH',
				credentials: 'include',
				body: formData,
			})

			if (!response.ok) {
				const errorData = await response.json()

				toast.error('Change logo error', {
					description: errorData.error,
				})
			}

			const data = await response.json()

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
											width={200}
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
												setImagePreview(file ? URL.createObjectURL(file) : club?.logo_url)
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
				<Button variant="secondary">Update Club Logo</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Club Logo</DialogTitle>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<ClubLogoEditForm club={club} />
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
