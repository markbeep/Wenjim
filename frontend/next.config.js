module.exports = {
    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: `${process.env.BACKEND_PROXY || "http://localhost:5000"}/api/:path*` 
        }]
    },
};
