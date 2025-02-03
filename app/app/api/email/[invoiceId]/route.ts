import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(request:Request,{
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
){
   try{
    const session = await requireUser()
    const {invoiceId} = await params;

    const invoiceData = await prisma.invoice.findUnique({
        where:{
            id:invoiceId,
            userId:session.user?.id
        }
    })

    if(!invoiceData){
        return NextResponse.json({error:'invoice not found'},{status:404})

    }
    const sender = {
        email: "hello@demomailtrap.com",
        name: "Devansh Bajpai",
      };
      emailClient.send({
        from: sender,
        to:  [{email:'devanshbajpai07@gmail.com'}],
       
        subject:'Reminder Invoice Payment',
        text:'Hey you forgot to pay'
        
      })

      return NextResponse.json({success:true})

   }catch(error){
    return NextResponse.json({error:'failed to send email'},{status:500})
   }

}