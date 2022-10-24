/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,ts,js,jsx,html}"],
    purge: ["./src/**/*.{tsx,ts,js,jsx,html}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light", "dark", "black"],
        darkTheme: "dark",
    }
}