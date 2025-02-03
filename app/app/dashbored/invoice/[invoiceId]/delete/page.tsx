import prisma from '@/app/utils/db'
import React from 'react'

import { redirect } from 'next/navigation'
import { requireUser } from '@/app/utils/hooks'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import { deleteInvoice } from '@/app/action'
import  SubmitButton  from '@/app/Components/SubmitButtons'


async function Authorize(invoiceId:string,userId:string){
    const data = await prisma.invoice.findUnique({
        where:{
            id:invoiceId,
            userId:userId
        }
    })

    if(!data){
        return redirect('/dashbored/invoice')
    }
}

type Params = Promise<{invoiceId:string}>
const deleteInvoiceRoute = async({params}:{params:Params}) => {
    const sesssion  = await requireUser()

    const {invoiceId} = await params
    await Authorize(invoiceId , sesssion.user?.id as string)
  return (
    <div className='flex flex-1 justify-center items-center'>
        <Card className='max-w-[500px]'>
            <CardHeader>
                <CardTitle>Delete Invoice</CardTitle>
                <CardDescription>Are your sure you want ot delete this invoice ?</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={''} alt="Warning" className='rounded-lg'/>
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <Link href="/dashbored/invoice" className={buttonVariants({variant:"secondary"})}>Cancel</Link>
                <form action={async()=>{
                    'use server'
                    await deleteInvoice(invoiceId)
                }}>
                    <SubmitButton text='Delete Invoice'/>
                </form>
            </CardFooter>
        </Card>

    </div>
  )
}

export default deleteInvoiceRoute