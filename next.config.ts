/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', // Para imágenes de Cloudinary
      'images.unsplash.com', // Para imágenes de placeholder si es necesario
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig