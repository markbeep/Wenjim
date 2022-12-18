module.exports = {
    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: `${process.env.BACKEND_PROXY || "http://localhost:5000"}/api/:path*` 
        }]
    },
};

const shouldAnalyzeBundles = process.env.ANALYZE === true;

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer =
    require('next-bundle-analyzer')(/* options come there */);
  nextConfig = withNextBundleAnalyzer(nextConfig);
}
