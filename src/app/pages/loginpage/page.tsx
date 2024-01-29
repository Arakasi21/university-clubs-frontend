import LoginForm from "@/components/LoginForm";
import Nav from "@/components/Nav";

export default function LoginPage(){
    return(

        <main className="p-24">
            <Nav/>

            <LoginForm/>
        </main>
    )
}