/** @type {import('next').NextConfig} */
const nextConfig = {
  // A static site: `next build` writes plain HTML, CSS and JS to out/, which
  // Vercel (or any static host) serves as-is. There is no server.
  output: "export",
  images: {
    // Required by `output: 'export'`: there is no server to optimise images.
    unoptimized: true,
  },
  eslint: {
    // There is no ESLint config; type checking still runs on every build.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
