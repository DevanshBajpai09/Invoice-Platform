
import  CreateInvoice  from '@/app/Components/CreateInvoice'
import prisma from '@/app/utils/db'
import { requireUser } from '@/app/utils/hooks'
import React from 'react'


async function getUserData(userId:string){
  const data = await prisma.user.findUnique({
    where:{
      id:userId
    },
    select:{
      firstName:true,
      lastName:true,
      address:true,
      email:true,

    }
  })

  return data
}
const create = async() => {
  const sesssion = await requireUser()
  const data = await getUserData(sesssion.user?.id as string)
  return (
    
    <CreateInvoice lastName={data?.lastName as string} firstName={data?.firstName as string} address={data?.address as string} email={data?.email as string}/>
  )
}

export default create