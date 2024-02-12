"use client";
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({

    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    barcode: z.string().min(1, { message: "Barcode is required" }),
    major: z.string().min(1, { message: "Major is required" }),
    group_name: z.string().min(1, { message: "Group name is required" }),
    year: z.coerce.number().max(3),
});


export default function SignUp() {
    const form= useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            barcode: "",
            major: "",
            group_name: "",
            year: 0,
        }
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const apiUrl = 'http://localhost:5000/auth/sign-up';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            alert('Signup successful!');
        } catch (error) {
            alert(`Signup failed:`);
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="max-w-md w-full flex flex-col gap-4"
                >
                    <FormField control={form.control} name="first_name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your first name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="last_name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your last name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="barcode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Barcode</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your barcode" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="major" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Major</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your major" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="group_name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your group name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="year" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Your year" {...field} />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
        </main>
    );
}
