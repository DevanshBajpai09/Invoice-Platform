import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {auth, signIn} from '../utils/auth'
import React from "react";

import { redirect } from "next/navigation";
import  SubmitButton  from "../Components/SubmitButtons";

const login = async() => {
  const session = await auth()
  if(session?.user){
    redirect('/dashbored')
  }
  return (
    <>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to Login in you account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => {
        "use server"
        await signIn("nodemailer" , formData)
      }} className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" id="email" placeholder="Email" required/>

                </div>
                <SubmitButton text="Login"/>
            </form>
          </CardContent>
          </Card>
      </div>
    </>
  );
};

export default login;
