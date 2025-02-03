"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onBoredingSchema } from "./utils/zodSchema";
import { redirect } from "next/navigation";
import prisma from "./utils/db";
import { emailClient } from "./utils/mailtrap";
import { formateCurrency } from "./utils/formateCurrency";


export async function onBoredUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onBoredingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashbored");
}

export async function createInvoice(prevState: any,formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      invoiceName: submission.value.invoiceName,
      total: submission.value.total,
      status: submission.value.status,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,

      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,

      note: submission.value.note,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,

      userId:session.user?.id,
    },
  });
  const sender = {
    email: "hello@demomailtrap.com",
    name: "Devansh Bajpai",
  };
  emailClient.send({
    from: sender,
    to: [{email:'devanshbajpai07@gmail.com'}],
    template_uuid: "896d55b8-bef4-4133-b7cf-9468783da0c6",
    template_variables: {
      "clientName": submission.value.clientName,
      "invoiceNumber": submission.value.invoiceNumber,
      "dueDate": new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      "totalAmount": formateCurrency({amount:submission.value.total,currency:submission.value.currency as any}),
      "invoiceLink": `http://localhost:3000/api/invoices/${data.id}`
    }
  })
  return redirect('/dashbored/invoice')
}

export async function editinvoice(prevState:any , formData:FormData){
  const session = await requireUser()
  const submission = parseWithZod(formData,{
    schema:invoiceSchema
  })

  if(submission.status !== 'success'){
    return submission.reply

  }

  const data = await prisma.invoice.update({
    where:{
      id:formData.get('id') as string,
      userId:session.user?.id,

    },
    data:{
      invoiceName: submission.value.invoiceName,
      total: submission.value.total,
      status: submission.value.status,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,

      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,

      note: submission.value.note,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,

      

    }
  })
  const sender = {
    email: "hello@demomailtrap.com",
    name: "Devansh Bajpai",
  };
  emailClient.send({
    from: sender,
    to:  [{email:'devanshbajpai07@gmail.com'}],
    template_uuid: "73ec94d9-b67f-4973-8169-ec4d9befc1c3",
    template_variables: {
      "clientName": submission.value.clientName,
      "invoiceNumber": submission.value.invoiceNumber,
      "dueDate": new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      "totalAmount": formateCurrency({amount:submission.value.total,currency:submission.value.currency as any}),
      "invoiceLink": `http://localhost:3000/api/invoices/${data.id}`
    }
  })
  return redirect('/dashbored/invoice')
}

export async function deleteInvoice(invoiceId:string){
  const session = await requireUser()
  const data = await prisma.invoice.delete({
    where:{
      userId:session.user?.id,
      id:invoiceId

    }
  })

  return redirect('/dashbored/invoice')
}


export async function paidInvoice(invoiceId:string){
  const session = await requireUser()
  const data = await prisma.invoice.update({
    where:{
      userId:session.user?.id,
      id:invoiceId
    },
    data:{
      status:'PAID'
    }
  })
  return redirect('/dashbored/invoice')
}