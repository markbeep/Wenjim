module.exports = () => {
    const rewrites = () => {
        const SERVER_URL = process.env.BACKEND_PROXY || "http://localhost:5000";
        return [{
            source: "/api/:path*",
            destination: `${SERVER_URL}/api/:path*`,
        }, ];
    };
    return {
        rewrites,
    };
};