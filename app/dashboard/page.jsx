// "use client";

// import { useState } from "react";
// import { DashboardNav } from "components/dashboard/nav";
// import { Overview } from "@/components/dashboard/overview";
// import { MerchantProducts } from "components/dashboard/merchant-products";
// import { MerchantAuctions } from "components/dashboard/merchant-auctions";
// import { OrdersPage } from "components/dashboard/orders";
// import { CustomersPage } from "components/dashboard/customers";

// // Map of view names to their corresponding components
// const viewComponents = {
//   overview: Overview,
//   products: MerchantProducts,
//   auctions: MerchantAuctions,
//   orders: OrdersPage,
//   customers: CustomersPage
// };

// export default function DashboardPage() {
//   const [currentView, setCurrentView] = useState("overview");

//   // Get the component to render based on the current view
//   const CurrentComponent = viewComponents[currentView];

//   return (
//     <div className="flex mt-4 min-h-screen">
//       {/* Pass currentView and setCurrentView to DashboardNav */}
//       <div>
//         <DashboardNav currentView={currentView} setCurrentView={setCurrentView} />
//       </div>

//       <div className="flex-1">

//         <div className={`flex-1 p-4 grid grid-cols-1 transition-all ${open ? "" : "blur-md"}`}>
//           {CurrentComponent ? <CurrentComponent /> : <p>Invalid view selected</p>}
//         </div>
//       </div>
//     </div>
//   );
// }
// app/dashboard/page.jsx
"use client";

import { useState } from "react";
import { DashboardNav } from "components/dashboard/nav";
import { Overview } from "@/components/dashboard/overview";
import { MerchantProducts } from "components/dashboard/merchant-products";
import { MerchantAuctions } from "components/dashboard/merchant-auctions";
import { OrdersPage } from "components/dashboard/orders";
import { CustomersPage } from "components/dashboard/customers";

// Map of view names to their corresponding components
const viewComponents = {
  overview: Overview,
  products: MerchantProducts,
  auctions: MerchantAuctions,
  orders: OrdersPage,
  customers: CustomersPage,
};

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState("overview");
  const [open, setOpen] = useState(true); // State for sidebar toggle

  // Get the component to render based on the current view
  const CurrentComponent = viewComponents[currentView] || Overview; // Default to Overview if invalid

  return (
    <div className="flex mt-4 min-h-screen">
      {/* Sidebar Navigation */}
      <div className={`${open ? "w-64" : "w-16"} transition-all duration-300`}>
        <DashboardNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          open={open}
          setOpen={setOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <CurrentComponent />
      </div>
    </div>
  );
}