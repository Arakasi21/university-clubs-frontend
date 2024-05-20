import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import useUserStore from '@/store/user'
import { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAxiosInterceptor } from '@/helpers/fetch_api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MAX_FILE_SIZE = 5000000 // ~5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formSchema = z.object({
	avatar: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.',
		),
})

const AvatarEditForm: React.FC<AvatarEditFormProps> = ({ user, ...props }) => {
	const editor = useRef(null)

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [imagePreview, setImagePreview] = useState<string | null>(user ? user.avatar_url : null)
	const axiosAuth = useAxiosInterceptor()
	const { setUser } = useUserStore()

	useEffect(() => {
		setImagePreview(user ? user.avatar_url : null)
	}, [user])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			avatar: user?.avatar_url,
		},
	})

	const updateUserAvatar = async (values: z.infer<typeof formSchema>) => {
		try {
			if (!values.avatar) {
				toast.error('Select image')
				return
			}

			const formData = new FormData()
			formData.append('avatar', values.avatar)

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
			}

			setUser(response.data.user, response.data.jwt_token)

			toast.success('Your avatar have changed!')
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div {...props} className="overflow-hidden">
			<Card>
				<CardHeader>
					<CardTitle>Change Avatar</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(updateUserAvatar)}>
							{user ? (
								<FormField
									control={form.control}
									name="avatar"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Image
													src={imagePreview ? imagePreview : ''}
													alt={`${user.first_name}'s avatar`}
													width={400}
													height={100}
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
														setImagePreview(file ? URL.createObjectURL(file) : user?.avatar_url)
														setIsDialogOpen(true)
													}}
												/>
											</FormControl>
											<Button type="submit" className="w-full">
												Set new profile picture
											</Button>
										</FormItem>
									)}
								/>
							) : (
								<Skeleton className="h-12 w-12 rounded-full" />
							)}
						</form>
					</Form>
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
