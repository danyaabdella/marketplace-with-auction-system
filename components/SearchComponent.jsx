import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-gray-50 py-12 container">
      <div className="mx-auto px-4">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-center">
            <Input
              type="search"
              placeholder="Search products..."
              className="h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="lg">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchComponent;
