/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "hebbkx1anhila5yf.public.blob.vercel-storage.com", 
      "firebasestorage.googleapis.com",// Add Firebase Storage domain
      "example.com",
      'images.unsplash.com',

    ], 
  },
};

export default nextConfig;
