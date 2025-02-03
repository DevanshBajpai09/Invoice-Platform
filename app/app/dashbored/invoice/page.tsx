
import  InvoiceList  from '@/app/Components/InvoiceList'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

  

const invoice = () => {
  return (
    <Card>
        <CardHeader>
            <div className='flex items-center justify-between'>
                <div>
                    <CardTitle className='text-2xl font-bold'>Invoice</CardTitle>
                    <CardDescription>Manage your invoices right here</CardDescription>
                </div>
                <Link href="/dashbored/invoice/create" className={buttonVariants()}>
                <PlusIcon /> Create Invoice
                </Link>
            </div>

        </CardHeader>
        <CardContent>
           <InvoiceList/>

        </CardContent>
    </Card>
  )
}

export default invoice