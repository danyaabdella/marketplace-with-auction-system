import { AuctionGrid } from "@/components/auction-grid"
import { CategoryFilter } from "@/components/category-filter"
import { PriceFilter } from "@/components/price-filter"
import { SearchBar } from "@/components/search-bar"
import { StatusFilter } from "@/components/status-filter"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <section className="space-y-4 rounded-lg p-6 gradient-bg text-primary-foreground">
          <h1 className="text-3xl font-bold tracking-tight">Featured Auctions</h1>
          <p className="opacity-90">Discover unique items and place your bids on our curated marketplace.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Art & Collectibles</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Electronics</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Fashion</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">Jewelry</span>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <aside className="space-y-6">
            <SearchBar />
            <div className="space-y-6 rounded-lg border p-4 shadow-sm bg-card">
              <CategoryFilter />
              <PriceFilter />
              <StatusFilter />
            </div>
          </aside>
          <main>
            <AuctionGrid />
          </main>
        </div>
      </div>
    </div>
  )
}

