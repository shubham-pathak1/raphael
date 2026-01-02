/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: "hsl(0 0% 7%)",
                    elevated: "hsl(0 0% 10%)",
                    hover: "hsl(0 0% 13%)",
                },
                accent: {
                    DEFAULT: "hsl(220 90% 56%)",
                    hover: "hsl(220 90% 62%)",
                },
                text: {
                    primary: "hsl(0 0% 98%)",
                    secondary: "hsl(0 0% 65%)",
                    muted: "hsl(0 0% 45%)",
                },
                border: {
                    DEFAULT: "hsl(0 0% 18%)",
                    subtle: "hsl(0 0% 12%)",
                },
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
                glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                premium: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};
