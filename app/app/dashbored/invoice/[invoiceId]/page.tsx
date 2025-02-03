import  EditInvoice  from '@/app/Components/EditInvoice'
import prisma from '@/app/utils/db'
import { requireUser } from '@/app/utils/hooks'
import { notFound } from 'next/navigation'


import React from 'react'


async function getUserData(invoiceId  : string , userId:string){
    const data = await prisma.invoice.findUnique({
        where:{
            id:invoiceId,
            userId:userId,

        },
        
    })

    if(!data){
        return notFound()
    }
    return data
}

type Params = Promise<{invoiceId:string}>
const EditInvoiceRoute = async({params}:{params:Params}) => {
    const {invoiceId} = await params
    const session = await requireUser()
    const data = await getUserData(invoiceId , session.user?.id as string)
    console.log(data)
  return (
    <div>

        <EditInvoice data={data}/>
    </div>
  )
}

export default EditInvoiceRoute