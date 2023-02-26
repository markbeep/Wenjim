module.exports = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${
  //         process.env.ENVOY_PROXY || "http://wenjim-envoy-staging:8080" // TODO: make this dynamic and work properly
  //       }/:path*`,
  //     },
  //   ];
  // },
  publicRuntimeConfig: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    ENVOY_PROXY: process.env.ENVOY_PROXY || "http://localhost:8080",
  },
};
