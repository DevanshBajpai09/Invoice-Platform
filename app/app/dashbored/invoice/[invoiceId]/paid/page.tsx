import { paidInvoice } from '@/app/action'
import  SubmitButton  from '@/app/Components/SubmitButtons'

import prisma from '@/app/utils/db'
import { requireUser } from '@/app/utils/hooks'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

async function Authorize(invoiceId:string , userId:string ){
    const data = await prisma.invoice.findUnique({
        where:{
            id:invoiceId,
            userId:userId,
        }
    })

    if(!data){
        return redirect('/dashbored/invoice')
    }
}

type Params = Promise<{invoiceId:string}>
const Paid = async({params}:{params:Params}) => {
    
    const {invoiceId} = await params
    const session = await requireUser()
    await Authorize(invoiceId,session.user?.id as string) 
  return (
    <>
    <div className='flex flex-1 justify-center items-center'>
        <Card className='max-w-[500px]'>
            <CardHeader>
                <CardTitle>Mark as Paid ? </CardTitle>
                <CardDescription>Are you sure you want to mark this invoice as paid ?</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={''} className='rounded-lg' alt='paid image'/>
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <Link href="/dashbored/invoice" className={buttonVariants({variant:"secondary"})}>Cancel</Link>
                <form action={async()=>{
                    'use server'
                    await paidInvoice(invoiceId)
                }}>
                    <SubmitButton text='Mark as Paid !'/>
                </form>
            </CardFooter>
        </Card>
    </div>
    </>
  )
}

export default Paid