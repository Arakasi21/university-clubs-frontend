import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Club, ClubRole } from '@/types/club'

import React, { MouseEvent, useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { PermissionsList } from '@/types/permissions'
import { Checkbox } from '@/components/ui/checkbox'
import { permissionsToHex, permissionsToStringArr } from '@/helpers/permissions'
import useUserRolesStore from '@/store/useUserRoles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAxiosInterceptor } from '@/helpers/fetch_api'

const roleFormSchema = z.object({
	name: z
		.string()
		.min(4, { message: 'Role name must be at least 4 characters.' })
		.max(20, { message: 'Role name can not be more than 20 characters' }),
	color: z.string(),
	permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
})

const RoleEditForm: React.FC<{
	club: Club
	role: ClubRole
	onClose: () => void
	onUpdateSuccess: () => void
}> = ({ club, role, onClose, onUpdateSuccess }) => {
	const form = useForm<z.infer<typeof roleFormSchema>>({
		resolver: zodResolver(roleFormSchema),
		defaultValues: {
			name: role.name,
			color: `#${role.color.toString(16).padStart(6, '0')}`,
			permissions: permissionsToStringArr(role.permissions).map((p) => p.id),
		},
	})
	const { permissions } = useUserRolesStore()
	const axiosAuth = useAxiosInterceptor()
	const updateRole = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const values = form.getValues()
		const hexColor = values.color
		const decimalColor = parseInt(hexColor.slice(1), 16)

		const updatedValues = {
			...values,
			color: decimalColor,
			permissions: permissionsToHex(values.permissions),
		}

		try {
			const response = await axiosAuth(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${club.id}/roles/${role.id}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					data: JSON.stringify(updatedValues),
				},
			)

			if (response.status !== 200) {
				toast.error('Failed to update role', { description: response.data.error })
				return
			}

			toast.success('Role successfully updated!')
			onUpdateSuccess() // fetchClubInfo()
			onClose()
		} catch (error) {
			toast.error('ERROR', { description: 'An error occurred while trying to update role.' })
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={updateRole} onClick={(e) => e.stopPropagation()}>
				<FormField
					name="name"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Role Name</FormLabel>
							<FormControl>
								<Input placeholder="Role Name" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name="color"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Role Color</FormLabel>
							<FormControl>
								<Input type="color" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="permissions"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-base">Permissions</FormLabel>
							</div>
							{PermissionsList.map((permission) => (
								<FormField
									key={permission.id}
									control={form.control}
									name="permissions"
									render={({ field }) => (
										<FormItem
											key={permission.id}
											className="flex flex-row items-start space-x-3 space-y-0"
										>
											<FormControl>
												<Checkbox
													checked={field.value.includes(permission.id)}
													disabled={(permissions & permission.hex) == 0} // member have permissions to edit
													onCheckedChange={(checked) => {
														const newValue = checked
															? [...field.value, permission.id]
															: field.value.filter((val) => val !== permission.id)
														field.onChange(newValue)
													}}
												/>
											</FormControl>
											<FormLabel className="justify-center font-normal">
												{permission.label}
											</FormLabel>
										</FormItem>
									)}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="mt-8" type="submit">
					Update Role
				</Button>
			</form>
		</Form>
	)
}

// member roles: Moder , lower, member
// const membersHighestRole= membersHighestRole(member.roles) = Moder
// if membersHighestRole.position < role.position{
// show edit role

//if member has permission to manage roles
// pos:3 Admin {} -> moder, lower
// pos:2 Moder {} -> lower
// pos:1 Lower {}
// pos:0 member

export function DialogUpdateClubRole({
	club,
	role,
	onUpdateSuccess,
}: {
	club: Club
	role: ClubRole
	onUpdateSuccess: () => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const toggleDialog = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		event.stopPropagation()
		setIsOpen(!isOpen)
	}
	const handleUpdateSuccess = () => {
		onUpdateSuccess()
		console.log('handleUpdateSuccess Role updated successfully')
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant={'ghost'} onClick={toggleDialog}>
					Edit Role
				</Button>
			</DialogTrigger>
			{isOpen && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Role</DialogTitle>
					</DialogHeader>
					<RoleEditForm
						role={role}
						club={club}
						onClose={() => setIsOpen(false)}
						onUpdateSuccess={handleUpdateSuccess}
					/>
				</DialogContent>
			)}
		</Dialog>
	)
}
