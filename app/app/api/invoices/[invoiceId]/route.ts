import prisma from "@/app/utils/db";
import { formateCurrency } from "@/app/utils/formateCurrency";

import jspdf from "jspdf";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      fromEmail: true,
      fromAddress: true,
      fromName: true,
      currency: true,
      clientAddress: true,
      clientName: true,
      clientEmail: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemRate: true,
      invoiceItemQuantity: true,
      total: true,
      note: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice Not found" }, { status: 404 });
  }

  const pdf = new jspdf({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  pdf.setFont("helvetica");
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  //   From section

  pdf.setFontSize(12);
  pdf.text("From", 20, 40);

  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  //   Cient section

  pdf.setFontSize(12);
  pdf.text("Bill To", 20, 70);

  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  // Invoice Number
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
  pdf.text(
    `Date: ${new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(data.date))}`,
    120,
    45
  );
  pdf.text(`Due Date: ${data.dueDate}`, 120, 50);

  //   description

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);

  // draw line header

  pdf.line(20, 102, 190, 102);

  // itemetails

  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoiceItemDescription, 20, 110);
  pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
  pdf.text(
    formateCurrency({
      amount: data.invoiceItemRate,
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currency: data.currency as any,
    }),
    130,
    110
  );
  pdf.text(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formateCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    110
  );

  // total section
  pdf.line(20, 115, 190, 115);

  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${data.currency})`, 130, 130);
  pdf.text(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formateCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    130
  );

  // pdf note

  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note", 20, 150);
    pdf.text(data.note, 20, 155);
  }

  // generate pdf as Uint8Array
  const pdfArrayBuffer = pdf.output("arraybuffer");
  const pdfUint8Array = new Uint8Array(pdfArrayBuffer as ArrayBuffer);
  return new NextResponse(pdfUint8Array, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
