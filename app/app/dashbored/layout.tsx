import React, { ReactNode } from "react";
import {  signOut } from "../utils/auth";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import DashboardLinks from "../Components/DashboardLinks";
import {Sheet,SheetContent,SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import prisma from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/hooks";
import { Toaster } from "@/components/ui/sonner";


async function getUser(userId:string){
  if (!userId) throw new Error('User ID is required');
  const data = await prisma.user.findUnique({
    where:{
      id: userId,
    },
    select:{
      firstName:true,
      lastName:true,
      address:true,
    }

  })

  if(!data?.firstName || !data?.lastName || !data?.address){
    redirect( "/Onboreding")
  }
}


const DashboredLayout = async ({ children }: { children: ReactNode }) => {


  const session = await requireUser();
  const data = await getUser(session.user?.id as string)

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex flex-col max-h-screen h-full gap-2">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} alt="Logo" className="size-7" />
                <p className="text-2xl font-bold">
                  Invoice <span className="text-blue-600">Marshal</span>
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 item-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="size-5"/>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-2 mt-10">
                    <DashboardLinks/>
                </nav>
              </SheetContent>
              
              
            </Sheet>
            <div className="flex items-center ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" variant="outline" size="icon">
                            <User2/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href='/dashbored'>Dashbored</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href='/dashbored/invoice'>Invoices</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <form className="w-full" action={async()=>{
                                "use server"
                                await signOut()
                            }}>
                                <Button type="submit" className="w-full text-left">
                                    Log out
                                </Button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>

            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton/>
    </>
  );
};

export default DashboredLayout;
