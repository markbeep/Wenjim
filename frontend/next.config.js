module.exports = () => {
    const rewrites = () => {
        // dirty fix, locally doesn't work anymore
        const SERVER_URL = process.env.BACKEND_PROXY || "http://localhost:5000/";
        return [{
            source: "/api/:path*",
            destination: `${SERVER_URL}/api/:path*`,
        },];
    };
    return {
        rewrites,
    };
};
