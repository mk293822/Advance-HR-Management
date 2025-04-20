import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            screens: {
                xs: "360px",   // Small phones (Android, iPhone SE)
                sm: "480px",   // Regular phones (iPhone, Pixel, Galaxy)
                md: "640px",   // Large phones / phablets
                lg: "768px",   // Tablets (iPad Mini, Galaxy Tab)
                xl: "1024px",  // Small laptops
                "2xl": "1280px", // Desktop
                "3xl": "1536px", // Large desktop monitors
            }
        },
    },

    plugins: [forms, daisyui],
};
