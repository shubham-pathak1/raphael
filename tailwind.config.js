/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "hsl(0 0% 4.7%)",
                    subtle: "hsl(0 0% 8%)",
                },
                foreground: "hsl(0 0% 98%)",
                muted: "hsl(0 0% 63.9%)",
                border: "hsl(0 0% 14.9%)",
                accent: {
                    DEFAULT: "hsl(0 0% 100%)", // Pure White
                    subtle: "rgba(255, 255, 255, 0.05)",
                },
                selection: "rgba(255, 255, 255, 0.1)",
                surface: {
                    DEFAULT: "hsl(0 0% 7%)",
                    elevated: "hsl(0 0% 10%)",
                },
            },
            borderRadius: {
                xl: "12px",
                "2xl": "16px",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 150ms ease-out",
                "slide-up": "slideUp 150ms ease-out",
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(4px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            boxShadow: {
                premium: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            },
        },
    },
    plugins: [],
};
