import  React from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({children}){
  
  return (
    <div className="flex min-h-screen">
      <div>
      <DashboardNav className="hidden lg:flex fixed left-0 top-0 h-screen"/>
      </div>
      
       <div className="lg:ml-64 w-full ">
        {/* <DashboardHeader /> */}
        <main className="flex-1">{children}</main>
       </div>
     </div>
  )
}

