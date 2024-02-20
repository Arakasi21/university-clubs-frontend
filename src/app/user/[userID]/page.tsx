"use client"
import {useEffect, useState} from "react";
import {IUser} from "@/interface/user";
import {toast} from "sonner";
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Nav from "@/components/nav";


const UserPage = ({params}:{params:{userID: number}}) => {
    const [user, setUser] = useState(null as IUser | null )

    useEffect(() => {
        userF()
    }, []);

    const userF = async () =>{
        await fetch(`http://localhost:5000/user/${params.userID}`)
            .then(async (res)=>{
                const data = await res.json()
                if (!res.ok){
                    toast.error("not found", {
                        description:data.error
                    });
                }

                setUser(data.user)
            })
    }

    return <div>
        <Nav/>
        <div>
            <Image src={user?.avatar_url} alt={`${user?.first_name} profile picture` } width={300} height={300}/>

            <p>{user?.first_name} {user?.last_name}</p>
            <p>Barcode: {user?.barcode}</p>


        </div>


    </div>;
};

export default UserPage;
