"use client";
import React, {useCallback, useEffect, useState} from 'react';
import Nav from "@/components/nav";
import {useSearchParams} from "next/navigation";
import {toast} from "sonner";


function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

const Page = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [successful, setSuccessful] = useState(false)
    const [loading, setLoading] = useState(true)

    const activateAccount = async (token: string) => {
        try {
            let response = await fetch(`http://localhost:5000/auth/activate?token=${token}`, {method: "POST"});

            if (!response.ok) {
                let errorData = await response.json();

                toast.error("Account activation error", {
                    description: errorData.error,
                });
                setLoading(false)

                throw new Error(errorData.error || 'Account activation failed');
            }

            toast("Account activated successfully!");
            setSuccessful(true)
            setLoading(false)

        } catch (e) {

        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedActivateAccount = useCallback(
        debounce(activateAccount, 500),
        []
    );

    useEffect(() => {
        if (token) {
            debouncedActivateAccount(token);
        } else {
            toast.error("You need to provide an activation token");
        }
    }, [token, debouncedActivateAccount]);




    return (
        <div>
            <Nav/>
            {loading ?(
                <div>loading</div>
            ):successful ? (
                <div>You Account Activated</div>
                ): (
                <div>Failed to Activate Your Account</div>
                )
            }

        </div>
    );
};

export default Page;

