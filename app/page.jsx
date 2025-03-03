"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductSlider } from "@/components/product-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import ChatBot from "@/components/commons/ChatBot";

export default function Home() {
  // Dynamically set items per page: 6 for mobile/tablet (<1024px), else 10.
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(10);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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
  const [categoryPages, setCategoryPages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const sectionRefs = useRef({});

  const fetchSpecialProducts = async (type, page = 1, limit) => {
    const response = await fetch(`/api/homePageFilter?type=${type}&page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    return { products: data.products, total: data.total };
  };

  const fetchCategoryProducts = async (categoryId) => {
    // Simulate API call for category products
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
      // Fetch categories
      const categoriesResponse = await fetch("/api/category");
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const fetchedCategories = await categoriesResponse.json();
      setCategories(fetchedCategories);

      // Load bestSellers for both "popular" and "bestSeller" sections
      const { products: bestSellerProducts, total: bestSellerTotal } = await fetchSpecialProducts("bestSellers", 1, itemsPerPage);
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
      const { products: topRatedProducts, total: topRatedTotal } = await fetchSpecialProducts("topRated", 1, itemsPerPage);
      setSpecialProducts((prev) => ({ ...prev, topRated: topRatedProducts }));
      setSpecialTotals((prev) => ({ ...prev, topRated: topRatedTotal }));

      // Load latest
      const { products: latestProducts, total: latestTotal } = await fetchSpecialProducts("latestProducts", 1, itemsPerPage);
      setSpecialProducts((prev) => ({ ...prev, latest: latestProducts }));
      setSpecialTotals((prev) => ({ ...prev, latest: latestTotal }));

      // Fetch category products and initialize pagination for each category
      const productData = {};
      const pages = {};
      for (const category of fetchedCategories) {
        const products = await fetchCategoryProducts(category.id);
        productData[category.id] = products;
        pages[category.id] = 1;
      }
      setCategoryProducts(productData);
      setCategoryPages(pages);

      // Initialize section refs (for special sections and each category)
      sectionRefs.current = {
        popular: React.createRef(),
        bestSeller: React.createRef(),
        topRated: React.createRef(),
        latest: React.createRef(),
        ...fetchedCategories.reduce((acc, cat) => {
          acc[cat.id] = React.createRef();
          return acc;
        }, {}),
      };
    };

    loadInitialData();
  }, [itemsPerPage]);

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

  const handleSpecialPageChange = async (type, page) => {
    const apiType = type === "popular" || type === "bestSeller" ? "bestSellers" : type + "Products";
    const { products, total } = await fetchSpecialProducts(apiType, page, itemsPerPage);
    setSpecialProducts((prev) => ({ ...prev, [type]: products }));
    setSpecialTotals((prev) => ({ ...prev, [type]: total }));
    setSpecialPages((prev) => ({ ...prev, [type]: page }));
  };

  const renderPagination = (current, total, onChange) => (
    <div className="flex justify-center mt-4 gap-2">
      <Button size="sm" onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="flex items-center px-2">
        Page {current} of {total}
      </span>
      <Button size="sm" onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const displayedCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalCategoriesPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div>
      <div className="container mx-auto px-4 mt-8">
        {/* Search Form */}
        <div className="mb-8">
          <form className="flex gap-4 max-w-2xl w-full mx-auto">
            <Input type="search" placeholder="Search products..." className="flex-1" />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <ProductSlider />

        {/* Special Categories Navigation */}
        <nav className="my-8">
          <div className="flex overflow-x-auto gap-4 mb-4 justify-between">
            {["Popular", "Best Seller", "Top Rated", "Latest"].map((type) => {
              // Map display text to the corresponding ref key
              const sectionKeys = {
                "Popular": "popular",
                "Best Seller": "bestSeller",
                "Top Rated": "topRated",
                "Latest": "latest",
              };
              return (
                <Button key={type} onClick={() => scrollToSection(sectionKeys[type])}>
                  {type}
                </Button>
              );
            })}
          </div>

          {/* All Categories Navigation */}
          <div className="flex overflow-x-auto gap-4 justify-between">
            {displayedCategories.map((category) => (
              <Button key={category.id} onClick={() => scrollToSection(category.id)}>
                {category.name}
              </Button>
            ))}
          </div>

          {totalCategoriesPages > 1 && renderPagination(currentPage, totalCategoriesPages, setCurrentPage)}
        </nav>

        <div className="space-y-12">
          {/* Special Sections */}
          {Object.entries(specialProducts).map(([type, products]) => {
            const totalPages = Math.ceil(specialTotals[type] / itemsPerPage);
            return (
              <section key={type} ref={sectionRefs.current[type]} className="scroll-mt-[90px]">
                <h2 className="text-xl md:text-2xl font-bold mb-6 capitalize">
                  {type.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 &&
                  renderPagination(specialPages[type], totalPages, (page) => handleSpecialPageChange(type, page))}
              </section>
            );
          })}

          {/* Category Sections with Pagination */}
          {categories.map((category) => {
            const allProducts = categoryProducts[category.id] || [];
            const currentCatPage = categoryPages[category.id] || 1;
            const totalCatPages = Math.ceil(allProducts.length / itemsPerPage);
            const startIndex = (currentCatPage - 1) * itemsPerPage;
            const displayedProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);
            return (
              <section key={category.id} ref={sectionRefs.current[category.id]} className="scroll-mt-[90px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
                  <Button className="mt-2 md:mt-0" onClick={() => (window.location.href = `/products?category=${category.id}`)}>
                    See More
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalCatPages > 1 &&
                  renderPagination(currentCatPage, totalCatPages, (page) =>
                    setCategoryPages((prev) => ({ ...prev, [category.id]: page }))
                  )}
              </section>
            );
          })}
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-4 right-4 z-50 mb-2">
          <Button size="icon" onClick={scrollToTop}>
            <ChevronUp className="h-4 w-4 text-white" />
          </Button>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}
