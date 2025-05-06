import { AuctionGrid } from "components/auction/auction-grid"
import { CategoryFilter } from "components/auction/category-filter"
import { PriceFilter } from "components/auction/price-filter"
import { SearchBar } from "components/auction/search-bar"
import { StatusFilter } from "components/auction/status-filter"
import { ProductSlider } from "components/product-slider"

export default function Home() {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="mb-8">
          <SearchBar />
        </div>
        <div className="mb-8">
          <ProductSlider/>
        </div>
      </div>  
        
        <main>
          <AuctionGrid />
        </main>
        
    </div>
  )
}

