import React from 'react'
import Nav from "@/components/nav";
import {Calendar} from "@/components/ui/calendar";


export default function Events(){
    return (
        <main>
                <Nav/>

            <div>
                <h1>Below you can see upcoming events</h1>

                <div className="flex px-32 gap-6 items-center justify-center flex-wrap text-center">
                    <Calendar/>
                </div>
            </div>
        </main>
    );
};

