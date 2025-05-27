
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
//   customers: CustomersPage,
// };

// export default function DashboardPage() {
//   const [currentView, setCurrentView] = useState("overview");
//   const [open, setOpen] = useState(true); // State for sidebar toggle

//   // Get the component to render based on the current view
//   const CurrentComponent = viewComponents[currentView] || Overview; // Default to Overview if invalid

//   return (
//     <div className="flex mt-4 min-h-screen">
//       {/* Sidebar Navigation */}
//       <div className={`${open ? "w-64" : "w-16"} transition-all duration-300`}>
//         <DashboardNav
//           currentView={currentView}
//           setCurrentView={setCurrentView}
//           open={open}
//           setOpen={setOpen}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-4">
//         <CurrentComponent />
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/dashboard/nav";
import Overview from "@/components/dashboard/overview"; // Default export
import MerchantProducts from "@/components/dashboard/merchant-products"; // Default export
import MerchantAuctions from "@/components/dashboard/merchant-auctions"; // Default export
import OrdersPage from "@/components/dashboard/orders"; // Default export
import CustomersPage from "@/components/dashboard/customers"; // Default export

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

  // Get the component to render based on the current view
  const CurrentComponent = viewComponents[currentView] || Overview;

  // Safety check for invalid component
  if (!CurrentComponent) {
    console.error(`No valid component found for view: ${currentView}`);
    return <div>Error: Invalid view component</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation - Hidden on small screens */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-muted/30 border-r z-20 mt-16">
        <DashboardNav
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto lg:ml-64">
        <CurrentComponent />
      </main>
    </div>
  );
}