'use client'

import React from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ModeToggle} from "@/components/ui/toggle-mode";
import {Button} from "@/components/ui/button";
import {IUser} from "@/interface/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useRouter} from "next/navigation";

const DropdownForLoggedIn = ({user, logout}:{user: IUser, logout: () => void }) => {
    const router = useRouter()
    const canHandleNewClubs:boolean = user.role === "ADMIN" || user.role === "DSVR"
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex flex-row">
                        <Avatar>
                            <AvatarImage src={user?.avatar_url} alt={`${user?.first_name} profile picture`}/>
                            <AvatarFallback>{user?.first_name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        {user?.first_name}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={()=>{router.push(`/user/${user.id}`)}}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>{router.push(`/clubs/create`)}}>
                            Create new Club
                        </DropdownMenuItem>
                        {canHandleNewClubs && (
                            <DropdownMenuItem>
                                Handle new Clubs
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                            <ModeToggle/>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Button onClick={logout}>Log out</Button>
                        {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DropdownForLoggedIn;