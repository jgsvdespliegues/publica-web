/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Esquema basado en tu ejemplo - azul oscuro elegante
        background: {
          primary: "hsl(210, 25%, 12%)", // Azul muy oscuro como tu ejemplo
          secondary: "hsl(210, 25%, 8%)", // Aún más oscuro para variación
        },
        surface: {
          primary: "hsl(0, 0%, 100%)", // Blanco puro para cards
          secondary: "hsl(210, 20%, 98%)", // Blanco ligeramente grisáceo
        },
        text: {
          primary: "hsl(210, 15%, 20%)", // Azul muy oscuro para texto en cards
          secondary: "hsl(210, 10%, 40%)", // Gris azulado para texto secundario
          light: "hsl(0, 0%, 100%)", // Blanco para texto sobre fondos oscuros
          muted: "hsl(210, 8%, 60%)", // Gris medio para texto menos importante
        },
        accent: {
          primary: "hsl(210, 100%, 60%)", // Azul vibrante como en tu ejemplo
          secondary: "hsl(195, 100%, 50%)", // Azul cian
          hover: "hsl(210, 100%, 55%)", // Azul un poco más oscuro para hover
        },
        border: "hsl(214, 32%, 91%)",
        input: "hsl(214, 32%, 91%)",
        ring: "hsl(262, 83%, 65%)",
        primary: {
          DEFAULT: "hsl(262, 83%, 65%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(210, 40%, 96%)",
          foreground: "hsl(222, 84%, 5%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}