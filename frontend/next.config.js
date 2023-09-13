const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy({
  customDomain: "https://plausible.markc.su",
})({
  // Allows nivo library to be imported
  experimental: { esmExternals: "loose" },
});
