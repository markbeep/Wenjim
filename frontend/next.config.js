module.exports = {
  publicRuntimeConfig: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    ENVOY_PROXY: process.env.ENVOY_PROXY || "http://localhost:8080/api",
  },
};
