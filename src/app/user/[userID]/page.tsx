"use client"
import {useCallback, useEffect, useState} from "react";
import {IUser} from "@/interface/user";
import {toast} from "sonner";
import Image from "next/image";
import Nav from "@/components/nav";


const UserPage = ({params}:{params:{userID: number}}) => {
    const [user, setUser] = useState(null as IUser | null )

    const userF = useCallback( async () =>{
        fetch(`http://localhost:5000/user/${params.userID}`)
            .then(async (res)=>{
                const data = await res.json()
                if (!res.ok){
                    toast.error("not found", {
                        description:data.error
                    });

                    throw new Error(data.error || 'Failed to Fetch user info');
                }

                setUser(data.user)
            }).catch(error => console.log(error.message))
    }, [params.userID])

    useEffect(() => {
        userF()
    }, [userF, params.userID]);



    return <div>
        <Nav/>
        <div>
            <Image src={user?.avatar_url!} alt={`${user?.first_name} profile picture` } width={300} height={300}/>

            <p>{user?.first_name} {user?.last_name}</p>
            <p>Barcode: {user?.barcode}</p>


        </div>


    </div>;
};

export default UserPage;
