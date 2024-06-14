'use client'
import { CardDescription, CardTitle } from '@/components/ui/card'
import useClub from '@/hooks/useClub'
import useUserClubStatus from '@/hooks/useUserClubStatus'
import useMemberRoles from '@/hooks/useMemberRoles'
import useUserStore from '@/store/user'
import useUserRolesStore from '@/store/useUserRoles'
import ClubImage from '@/components/clubs/ClubImage'
import Nav from '@/components/NavBar'
import React, { useCallback, useEffect, useState } from 'react'
import SceletonClub from '@/components/Skeletons/SkeletonClub'
import { Event } from '@/types/event'
import { Post } from '@/types/post'
import ClubMembersCard from '@/components/clubs/ClubMembersCard'
import ClubMembersDialog from '@/components/clubs/ClubMembersDialog'
import ClubPageButtons from '@/components/clubs/ClubPageButtons'
import BackgroundClubImage from '@/components/clubs/BackgroundClubImage'
import {
	FaFacebookF,
	FaGithub,
	FaGlobe,
	FaInstagram,
	FaLinkedinIn,
	FaTelegramPlane,
	FaTiktok,
	FaTwitter,
	FaYoutube,
} from 'react-icons/fa'
import EventItemHorizontal from '@/components/EventItemHorizontal'
import PostItemHorizontal from '@/components/PostItemHorizontal'

function Page({ params }: { params: { clubID: number } }) {
	const { isLoggedIn, user } = useUserStore()
	const { club, clubMembers, isOwner, loading } = useClub({ clubID: params.clubID, user })
	const { handleJoinRequest, handleLeaveClub, memberStatus } = useUserClubStatus({
		clubID: params.clubID,
	})

	const { permissions } = useUserRolesStore()

	useMemberRoles({
		club: club || null,
		user: user,
		userStatus: memberStatus,
		shouldFetch: memberStatus === 'MEMBER',
	})

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const openClubMembersDialog = () => setIsDialogOpen(true)
	const closeDialog = () => setIsDialogOpen(false)
	const [clubEvents, setClubEvents] = useState<Event[] | null>([])
	const [clubPosts, setClubPosts] = useState<Post[] | null>([])

	const fetchClubEvents = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/events?page=1&page_size=30`,
				{
					method: 'GET',
				},
			)

			if (response.ok) {
				const data = await response.json()
				setClubEvents(data.events)
			} else {
				console.log('There is no fetched events')
			}
		} catch (err) {
			console.error('Network Error: Unable to fetch events')
		}
	}, [params.clubID])

	const fetchClubPosts = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/clubs/${params.clubID}/posts?page=1&page_size=30`,
				{
					method: 'GET',
				},
			)

			if (response.ok) {
				const data = await response.json()
				setClubPosts(data.posts)
			} else {
				console.log('There is no fetched posts')
			}
		} catch (err) {
			console.error('Network Error: Unable to fetch posts')
		}
	}, [params.clubID])

	useEffect(() => {
		fetchClubEvents()
		fetchClubPosts()
	}, [fetchClubEvents, fetchClubPosts])

	const getDomain = (url: string) => {
		try {
			const domain = new URL(url)
			const parts = domain.hostname.split('.')
			parts.pop()
			return parts.join('.').replace('www.', '')
		} catch (error) {
			console.error(`Invalid URL: ${url}`)
			return url
		}
	}

	const getSocialIcon = (url: string) => {
		const domain = getDomain(url)
		if (url.includes('t.me')) {
			return <FaTelegramPlane size={20} />
		}
		switch (domain) {
			case 'instagram':
				return <FaInstagram size={20} />
			case 'twitter':
				return <FaTwitter size={20} />
			case 'facebook':
				return <FaFacebookF size={20} />
			case 'linkedin':
				return <FaLinkedinIn size={20} />
			case 'youtube':
				return <FaYoutube size={20} />
			case 'github':
				return <FaGithub size={20} />
			case 'tiktok':
				return <FaTiktok size={20} />
			default:
				return <FaGlobe />
		}
	}

	return (
		<>
			<Nav />

			<div className="flex min-h-screen flex-col bg-white text-white dark:bg-[#020817]">
				{loading ? (
					<SceletonClub />
				) : (
					<div className="relative">
						<div className="absolute h-[320px] w-full overflow-hidden rounded-sm dark:shadow-2xl dark:shadow-[#020817]/40">
							<img
								className="z-1 h-full w-full object-cover object-center"
								height={600}
								src={club?.banner_url}
								alt={''}
								style={{
									aspectRatio: '1920/600',
									objectFit: 'cover',
								}}
								width={1920}
							/>
							<div className="z-1 absolute inset-0 bg-gradient-to-b from-transparent/30 to-[#ffffff]/100 dark:bg-gradient-to-b dark:from-transparent/30 dark:to-[#020817]/80" />
							<div className="z-1 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#ffffff]/40 dark:bg-gradient-to-t dark:from-[#020817]/90" />
						</div>

						<div className="md:mx-15 relative z-30 mx-5 my-5 max-w-[1200px] pt-24 sm:mx-10 lg:mx-20 xl:mx-auto">
							<BackgroundClubImage club={club} />
							<div className="z-50 rounded-lg border bg-accent dark:border-none dark:bg-[#0c1125]">
								<div className="flex items-center justify-between gap-4 p-6">
									<div className="flex items-center gap-2">
										<div className="hidden aspect-square shrink-0 overflow-hidden rounded-full sm:flex">
											<ClubImage club={club} width={84} height={84} />
										</div>
										<div className="pl-4">
											<CardTitle className="text-gray-900 dark:text-white">{club?.name}</CardTitle>
											<CardDescription>{club?.description}</CardDescription>
											<CardDescription className="cursor-pointer pt-2">
												<div onClick={openClubMembersDialog}>{club?.num_of_members} members</div>
												<div className="flex flex-row space-x-3 pt-4">
													{club?.social_links?.map((link, index) => (
														<a
															key={index}
															href={link}
															target="_blank"
															rel="noopener noreferrer"
															className=" text-2xl transition-colors duration-200 hover:text-blue-500"
														>
															{getSocialIcon(link)}
														</a>
													))}
												</div>
											</CardDescription>
										</div>
									</div>
									<ClubPageButtons
										memberPerms={permissions}
										club={club as any}
										loggedIn={isLoggedIn}
										loading={loading}
										memberStatus={memberStatus}
										onClick={handleJoinRequest}
										owner={isOwner}
										onClick1={handleLeaveClub}
									/>
								</div>
							</div>
							{/*CLUBS MEMBERS CARD*/}
							<ClubMembersCard club={club!} clubMembers={clubMembers!} />
							<div className="mt-8 grid grid-cols-1 gap-6 ">
								{clubEvents &&
									clubPosts &&
									[...clubEvents, ...clubPosts]
										.sort((a, b) => {
											const aDate = new Date(a.created_at)
											const bDate = new Date(b.created_at)

											return aDate.getTime() - bDate.getTime()
										})
										.map((item, index) =>
											'club_id' in item ? (
												<EventItemHorizontal key={index} event={item as Event} />
											) : (
												<PostItemHorizontal key={index} post={item as Post} />
											),
										)}
							</div>
						</div>
					</div>
				)}
			</div>
			<ClubMembersDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				club={club}
				clubMembers={clubMembers}
			/>
		</>
	)
}

export default Page
