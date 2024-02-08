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

      <div className="flex px-32 gap-6 items-center justify-center flex-wrap text-center">
        <h1 className="text-xl">Do you want to choose a club based on your interest, but you don&apos;t know which one is more suitable for you?</h1>
        <p className="text-xl">There are a lot of student clubs and organizations at the Astana IT University,
          for everything from niche hobbies to extracurriculars to career-oriented and professional groups.
          Browse some of our most popular and most distinct clubs in AITU.</p>
      </div>

      <div className="flex my-10 mx-20 gap-6 justify-center flex-wrap">

        <Card>
          <CardHeader>
            <CardTitle>Volunteer clubs</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-3">Cooking club</p>
            <p className="py-3">AITU Charity</p>
            <p className="py-3">AITU Volunteers</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Game clubs</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-3">AITU Gaming club</p>
            <p className="py-3">Board Games</p>
            <p className="py-3">GameDev club</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>For Athletes</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-3">Basketball </p>
            <p className="py-3">Volleyball </p>
            <p className="py-3">Football</p>
            <p className="py-3">Table tennis</p>

          </CardContent>

        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Dance & Music</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-3">AITU Dance</p>
            <p className="py-3">KCA(Korean Culture Association) club</p>
            <p className="py-3">AITU Music</p>
          </CardContent>

        </Card>

      </div>

    </main>
  )
}
