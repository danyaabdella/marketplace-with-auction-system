import { DashboardHeader } from "@/components/dashboard/header"
import { MerchantProducts } from "@/components/dashboard/merchant-products"

export default function ProductsPage() {
  return (
    <div className="container p-6">
        {/* <DashboardHeader/> */}
      <MerchantProducts />
    </div>
  )
}

