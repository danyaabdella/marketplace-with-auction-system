"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductSlider } from "@/components/product-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [specialProducts, setSpecialProducts] = useState({
    popular: [],
    bestSeller: [],
    topRated: [],
    latest: [],
  });
  const [specialTotals, setSpecialTotals] = useState({
    popular: 0,
    bestSeller: 0,
    topRated: 0,
    latest: 0,
  });
  const [specialPages, setSpecialPages] = useState({
    popular: 1,
    bestSeller: 1,
    topRated: 1,
    latest: 1,
  });
  const [categoryProducts, setCategoryProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const sectionRefs = useRef({});

  const sectionMapping = {
    Popular: "popular",
    "Best Seller": "bestSeller",
    "Top Rated": "topRated",
    Latest: "latest",
  };

  const fetchSpecialProducts = async (type, page = 1, limit = ITEMS_PER_PAGE) => {
    const response = await fetch(`/api/homePageFilter?type=${type}&page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    return { products: data.products, total: data.total };
  };

  const fetchCategoryProducts = async (categoryId) => {
    // Simulate API call for category products (replace with actual API when available)
    return Array.from({ length: 10 }, (_, i) => ({
      id: `cat-${categoryId}-${i}`,
      name: "Product Name",
      description: "Product description goes here",
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.5,
      soldCount: 415,
      image: "/placeholder.svg",
    }));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      // Fetch categories from /api/category
      const categoriesResponse = await fetch("/api/category");
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const fetchedCategories = await categoriesResponse.json();
      setCategories(fetchedCategories);

      // Load bestSellers for both bestSeller and popular
      const { products: bestSellerProducts, total: bestSellerTotal } = await fetchSpecialProducts("bestSellers", 1);
      setSpecialProducts({
        popular: bestSellerProducts,
        bestSeller: bestSellerProducts,
        topRated: [],
        latest: [],
      });
      setSpecialTotals({
        popular: bestSellerTotal,
        bestSeller: bestSellerTotal,
        topRated: 0,
        latest: 0,
      });
      setSpecialPages({
        popular: 1,
        bestSeller: 1,
        topRated: 1,
        latest: 1,
      });

      // Load topRated
      const { products: topRatedProducts, total: topRatedTotal } = await fetchSpecialProducts("topRated", 1);
      setSpecialProducts((prev) => ({ ...prev, topRated: topRatedProducts }));
      setSpecialTotals((prev) => ({ ...prev, topRated: topRatedTotal }));

      // Load latest
      const { products: latestProducts, total: latestTotal } = await fetchSpecialProducts("latestProducts", 1);
      setSpecialProducts((prev) => ({ ...prev, latest: latestProducts }));
      setSpecialTotals((prev) => ({ ...prev, latest: latestTotal }));

      // Fetch products for each category
      const productData = {};
      for (const category of fetchedCategories) {
        const categoryProducts = await fetchCategoryProducts(category.id);
        productData[category.id] = categoryProducts;
      }
      setCategoryProducts(productData);

      // Initialize section refs
      sectionRefs.current = {
        popular: React.createRef(),
        bestSeller: React.createRef(),
        topRated: React.createRef(),
        latest: React.createRef(),
        ...fetchedCategories.reduce(
          (acc, cat) => ({
            ...acc,
            [cat.id]: React.createRef(),
          }),
          {}
        ),
      };
    };

    loadInitialData();
  }, []);

  const scrollToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePageChange = async (type, page) => {
    const apiType = type === "popular" || type === "bestSeller" ? "bestSellers" : type + "Products";
    const { products, total } = await fetchSpecialProducts(apiType, page);
    setSpecialProducts((prev) => ({ ...prev, [type]: products }));
    setSpecialTotals((prev) => ({ ...prev, [type]: total }));
    setSpecialPages((prev) => ({ ...prev, [type]: page }));
  };

  const displayedCategories = categories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const renderPagination = (current, total, onChange) => (
    <div className="flex justify-center mt-4 gap-2">
      <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="flex items-center px-2">
        Page {current} of {total}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div>
      <div className="container py-8 mt-8">
        <div className="mb-8">
          <form className="flex gap-4 max-w-2xl mx-auto">
            <Input type="search" placeholder="Search products..." className="flex-1" />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <ProductSlider />

        {/* Special Categories Navigation */}
        <nav className="my-8">
          <div className="flex flex-wrap justify-between gap-4 mb-4">
            {["Popular", "Best Seller", "Top Rated", "Latest"].map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => scrollToSection(sectionMapping[type])}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* All Categories */}
          <div className="flex flex-wrap justify-between gap-4">
            {displayedCategories.map((category) => (
              <Button key={category.id} variant="outline" onClick={() => scrollToSection(category.id)}>
                {category.name}
              </Button>
            ))}
          </div>

          {totalPages > 1 && renderPagination(currentPage, totalPages, setCurrentPage)}
        </nav>

        <div className="space-y-12">
          {/* Special Sections */}
          {Object.entries(specialProducts).map(([type, products]) => {
            const totalPages = Math.ceil(specialTotals[type] / ITEMS_PER_PAGE);
            return (
              <section key={type} ref={sectionRefs.current[type]} className="scroll-mt-[90px]">
                <h2 className="text-2xl font-bold mb-6 capitalize">{type.replace(/([A-Z])/g, " $1").trim()}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 &&
                  renderPagination(specialPages[type], totalPages, (page) => handlePageChange(type, page))}
              </section>
            );
          })}

          {/* Category Sections */}
          {categories.map((category) => (
            <section key={category.id} ref={sectionRefs.current[category.id]} className="scroll-mt-[90px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Button variant="outline" onClick={() => (window.location.href = `/products?category=${category.id}`)}>
                  See More
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {(categoryProducts[category.id] || []).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-4 right-4">
          <Button variant="outline" size="icon" onClick={scrollToTop}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}