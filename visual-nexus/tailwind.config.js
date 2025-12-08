/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    dark: "#0a0a1f",
                    cyan: "#00f3ff",
                    magenta: "#ff00ff",
                    glass: "rgba(10, 10, 31, 0.7)"
                }
            },
            fontFamily: {
                mono: ['"Fira Code"', '"JetBrains Mono"', 'Courier', 'monospace'],
            }
        },
    },
    plugins: [],
}
