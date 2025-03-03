import { AuctionGrid } from "components/auction/auction-grid"
import { CategoryFilter } from "components/auction/category-filter"
import { PriceFilter } from "components/auction/price-filter"
import { SearchBar } from "components/auction/search-bar"
import { StatusFilter } from "components/auction/status-filter"
import { ProductSlider } from "components/product-slider"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <ProductSlider/>
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

