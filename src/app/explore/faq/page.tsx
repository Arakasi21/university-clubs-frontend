import Nav from '@/components/NavBar'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

export default function Component() {
	return (
		<>
			<Nav />
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="mx-auto max-w-3xl space-y-6">
						<div className="text-center">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								{'Frequently Asked Questions'}
							</h2>
							<p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
								{'Get answers to the most common questions about our university clubs.'}
							</p>
						</div>
						<Accordion
							type="single"
							collapsible
							className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
						>
							<AccordionItem value="item-1">
								<AccordionTrigger className="flex items-center justify-between rounded-t-lg bg-gray-100 px-6 py-4 text-lg font-medium transition-colors hover:bg-gray-200 data-[state=open]:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:data-[state=open]:bg-gray-800">
									{'How can i registrate my own club?'}
								</AccordionTrigger>
								<AccordionContent className="space-y-4 rounded-b-lg bg-white px-6 py-4 text-base text-gray-500 shadow-inner dark:bg-gray-950 dark:text-gray-400">
									<p>
										{'There are several things you need to do to register your club:'}
										<br />
										<br />
										{
											'1) Come up with the name of the club, draw a logo and create pages on social networks (you can chat in a telegram, an Instagram page, other social networks are also possible);'
										}
										<br />
										<br />
										{
											'2) Select the goals and define the tasks of your club that you will perform as part of your intra-university activities as a student club. You will need to defend the concept of your club in the DSVR, namely, answer the questions "what will your club do", "what benefits can you bring to our student society", etc. (after completing all other points, of course). Here it is necessary to discuss with the DSVR and get their approval.'
										}
										<br />
										<br />
										{'3) Gather at least 5 people who are ready to join your club'}
									</p>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger className="flex items-center justify-between bg-gray-100 px-6 py-4 text-lg font-medium transition-colors hover:bg-gray-200 data-[state=open]:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:data-[state=open]:bg-gray-800">
									{'What should I do after the DSVR has approved my club?'}
								</AccordionTrigger>
								<AccordionContent className="space-y-4 rounded-b-lg bg-white px-6 py-4 text-base text-gray-500 shadow-inner dark:bg-gray-950 dark:text-gray-400">
									{
										'Following approval from the DSVR, your club will enter a probationary period of one month.'
									}
									<br />
									<br />
									{
										"1) During this probationary period, your club is required to organize and conduct at least one event for AITU students. This event can take the form of a quest, competition, challenge, or any other activity that aligns with the club's objectives."
									}
									<br />
									<br />
									{
										'2) Your club must create and maintain minimal content for its Instagram page, providing information about the club, its missions, and its goals. This Instagram page will be utilized in various communications, including newsletters for applicants, first-year students, and others.'
									}
									<br />
									<br />
									{
										'If conditions above are successfully met, the club will be officially recognized as an active and operating club within our university.'
									}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger className="flex items-center justify-between bg-gray-100 px-6 py-4 text-lg font-medium transition-colors hover:bg-gray-200 data-[state=open]:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:data-[state=open]:bg-gray-800">
									{'What resources are available for university club members?'}
								</AccordionTrigger>
								<AccordionContent className="space-y-4 rounded-b-lg bg-white px-6 py-4 text-base text-gray-500 shadow-inner dark:bg-gray-950 dark:text-gray-400">
									<p>
										{
											'University clubs offer a variety of resources to support their members, including:'
										}
									</p>
									<ul className="list-disc space-y-2 pl-6">
										<li>{'Dedicated meeting spaces and facilities'}</li>
										<li>{'Funding and budgeting assistance'}</li>
										<li>{'Mentorship and leadership development programs'}</li>
										<li>{'Networking and professional development opportunities'}</li>
										<li>{'Access to campus resources and services'}</li>
									</ul>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-4">
								<AccordionTrigger className="flex items-center justify-between bg-gray-100 px-6 py-4 font-medium transition-colors hover:bg-gray-200 data-[state=open]:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:data-[state=open]:bg-gray-800">
									{'How can I get involved in organizing club events and activities?'}
								</AccordionTrigger>
								<AccordionContent className="space-y-4 rounded-b-lg bg-white px-6 py-4 text-gray-500 shadow-inner dark:bg-gray-950 dark:text-gray-400">
									<p>{'To get involved in organizing club events and activities, you can:'}</p>
									<ul className="list-disc space-y-2 pl-6">
										<li>
											{
												'Attend club meetings and volunteer for event planning committees or subgroups.'
											}
										</li>
										<li>
											{"Propose new event ideas and collaborate with the club's leadership team."}
										</li>
										<li>
											{
												"Leverage your skills and interests to contribute to the club's programming, such as leading workshops or coordinating logistics."
											}
										</li>
										<li>
											{
												'Seek out mentorship and guidance from experienced club members to develop your event planning and leadership abilities.'
											}
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</section>
		</>
	)
}
