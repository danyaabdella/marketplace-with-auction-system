import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { MerchantProducts } from "@/components/dashboard/merchant-products"
import { MerchantAuctions } from "@/components/dashboard/merchant-auctions"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* <DashboardNav /> */}
      <div className="flex-1">
        <DashboardHeader />
        <div className="container p-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Overview />
            <RecentSales />
          </div>
          <div className="mt-8 grid gap-6">
            <MerchantProducts />
            <MerchantAuctions />
          </div>
        </div>
      </div>
    </div>
  )
}

