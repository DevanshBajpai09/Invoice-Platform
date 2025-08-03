"use client"
import React, { useActionState } from 'react'
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from '../Components/SubmitButtons'
import {onBoredUser} from '../action.ts'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod';
import { onBoredingSchema} from '../utils/zodSchema';



const Onboreding = () => {

  const [lastResult , action] = useActionState(onBoredUser , undefined)
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: onBoredingSchema});
    },

    // Validate the form on blur event triggered
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  return (
    <div className='min-h-screen w-screen flex items-center justify-center'>
        <Card className="max-w-sm mx-auto">
            <CardHeader>
                <CardTitle className="text-xl">You are almost finished</CardTitle>
                <CardDescription>
                    Enter your inforamtion to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
              <form className='grid gap-4' action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
                <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label>First Name</Label>
                  <Input name={fields.firstName.name} key={fields.firstName.key} defaultValue={fields.firstName.initialValue} placeholder="Enter Name"></Input>
                  <p className='text-red-500 text-sm'>{fields.firstName.errors}</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <Label >Last Name</Label>
                  <Input name={fields.lastName.name} key={fields.lastName.key} defaultValue={fields.lastName.initialValue} placeholder="Enter Last Name"></Input>
                  <p className='text-red-500 text-sm'>{fields.lastName.errors}</p>
                </div>
                </div>
                
                <div className='grid gap-2'>
                  <Label >Address</Label>
                  <Input name={fields.address.name} key={fields.address.key} defaultValue={fields.address.initialValue} placeholder="Enter Address"></Input>
                  <p className='text-red-500 text-sm'>{fields.address.errors}</p>
                </div>
                <SubmitButton text="Finish Onboreding"/>

                

              </form>
            </CardContent>
        </Card>

      
    </div>
  )
}

export default Onboreding
