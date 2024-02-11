import Nav from "@/components/nav"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



export default function Home() {
  return (
    <main>

      <Nav/>
    <br/>

      <div className="flex py-16 gap-6 items-center justify-center flex-wrap text-center">
        <h1 className="text-xl">Do you want to choose a club based on your interest, but you don&apos;t know which one is more suitable for you?</h1>
        {/*<p className="text-lg ">There are a lot of student clubs and organizations at the Astana IT University,*/}
        {/*  for everything from niche hobbies to extracurriculars to career-oriented and professional groups.*/}
        {/*  Browse some of our most popular and most distinct clubs in AITU.</p>*/}
      </div>

      <div className="flex my-10 mx-60 gap-6 justify-center flex-wrap">

        <Card>
          <CardHeader>
            <CardTitle>Volunteer clubs</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-2">Cooking club</p>
            <p className="py-2">AITU Charity</p>
            <p className="py-2">AITU Volunteers</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Gaming clubs</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-2">AITU Gaming club</p>
            <p className="py-2">Board Games</p>
            <p className="py-2">GameDev club</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>For Athletes</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-2">Basketball </p>
            <p className="py-2">Volleyball </p>
            <p className="py-2">Football</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Dance & Music</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-2">AITU Dance</p>
            <p className="py-2">KCA club</p>
            <p className="py-2">AITU Music</p>
          </CardContent>

        </Card>

      </div>

    </main>
  )
}
