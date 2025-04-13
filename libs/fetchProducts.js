// utils/fetchProducts.js
export async function fetchProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/fetchProducts?${queryString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }