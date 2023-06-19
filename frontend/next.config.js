const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  // Allows nivo library to be imported
  experimental: { esmExternals: "loose" },
});
