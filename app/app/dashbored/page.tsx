import React from 'react'

import { requireUser } from '../utils/hooks'


import InvoiceGraph from '../Components/InvoiceGraph'
import RecentInvoices from '../Components/RecentInvoices'
import prisma from '../utils/db'
import  EmptyState  from '../Components/EmptyState'
import  DashboardBlocks  from '../Components/DashboardBlocks'




async function getData(userId:string){
  const data = await prisma.invoice.findMany({
    where:{
      userId:userId
    },
    select:{
      id:true,
    }

  })
  return data
}
const dashbored = async () => {
    const session  = await requireUser()
    const data = await getData(session.user?.id as string)
  return (
    <>
    {data.length < 1 
    ? <EmptyState title='No Invoces Found' description='Create Invoice to see here' buttontext='Create Invoice' href='/dashbored/invoice/create'/> 
      :<><DashboardBlocks/>
      <div className='grid gap-4  lg:grid-cols-3 md:gap-8'>
        <InvoiceGraph/>
        <RecentInvoices/>
  
      </div>
  </>
    }
    
    </>
  )
}

export default dashbored
