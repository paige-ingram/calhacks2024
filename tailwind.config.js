/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Add the paths to your app folder
    './components/**/*.{js,ts,jsx,tsx}',  // Add the paths to your components folder
  ],
  theme: {
    extend: {
      colors: {
        // You can extend the default Tailwind colors here if needed
        border: 'var(--border)',  // Ensure this maps to the right value
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};
