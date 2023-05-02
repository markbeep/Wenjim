const envoyHost = process.env.ENVOY_PROXY || "http://localhost:8080";
module.exports = {
  publicRuntimeConfig: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    ENVOY_PROXY:  envoyHost,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${envoyHost}/api/:path*`,
      },
    ];
  },
};
