/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  assetPrefix:
    process.env.NODE_ENV === "production" ? "https://gayoungyeom.github.io/stock-log" : "",
}

export default nextConfig
