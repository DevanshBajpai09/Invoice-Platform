/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CalendarIcon } from "lucide-react";
import SubmitButton from "./SubmitButtons";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Invoice } from "@prisma/client";
import React from "react";
import { invoiceSchema } from "../utils/zodSchema";
import { editinvoice } from "../action";
import { formateCurrency } from "../utils/formateCurrency";

type Currency = "USD" | "EUR";


// Correct interface definition
interface iAppProps {
  data: Invoice;
}

const EditInvoice = ({ data }: iAppProps) => {
  const [actionState, action] = useActionState(editinvoice, undefined);
  const lastResult = typeof actionState === "function" ? actionState() : actionState;
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(data.date));
  const [rate, setRate] = useState<string>(data.invoiceItemRate.toString());
  const [quantity, setQuantity] = useState<string>(data.invoiceItemQuantity.toString());
  const [currency, setCurrency] = useState<Currency>(data.currency as Currency);

  // Fixed spelling mistake in variable name
  const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name={fields.date.name} value={selectedDate.toISOString()} />
          <input type="hidden" name="id" value={data.id} />
          <input type="hidden" name={fields.total.name} value={calculateTotal} />

          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={data.invoiceName}
                placeholder="Test 123"
              />
            </div>
            <p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">#</span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={data.invoiceNumber}
                  className="rounded-l-none"
                  placeholder="5"
                />
              </div>
              <p className="text-red-500 text-sm">{fields.invoiceNumber.errors}</p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                defaultValue={currency}
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value as Currency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">United States Dollar -- USD</SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] text-left justify-start">
                    <CalendarIcon />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(selectedDate)
                    ) : (
                      <span>Pick a Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar selected={selectedDate} onSelect={(date:any) => setSelectedDate(date || new Date())} />
                </PopoverContent>
              </Popover>
              <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>

            <div>
              <Label>Invoice Due</Label>
              <Select name={fields.dueDate.name} key={fields.dueDate.key} defaultValue={data.dueDate.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-2">
              <Input
                name={fields.invoiceItemQuantity.name}
                key={fields.invoiceItemQuantity.key}
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                name={fields.invoiceItemRate.name}
                key={fields.invoiceItemRate.key}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                type="number"
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <Input value={formateCurrency({ amount: calculateTotal, currency })} disabled />
            </div>
          </div>

          <div className="flex items-center justify-end mt-6">
            <SubmitButton text="Update Invoice" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditInvoice;
