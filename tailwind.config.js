const colors = require('tailwindcss/colors');

const gray = {
    50: 'hsl(216, 33%, 97%)',
    100: 'hsl(214, 15%, 91%)',
    200: 'hsl(210, 16%, 82%)',
    300: 'hsl(211, 13%, 65%)',
    400: 'hsl(211, 10%, 53%)',
    500: 'hsl(211, 12%, 43%)',
    600: 'hsl(209, 14%, 37%)',
    700: 'hsl(209, 18%, 30%)',
    800: 'hsl(209, 20%, 25%)',
    900: 'hsl(210, 24%, 16%)',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Sora"', 'system-ui', 'sans-serif'],
                header: ['"Sora"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#080c14',
                primary: {
                    50: '#e6f7ff',
                    100: '#bae7ff',
                    200: '#91d5ff',
                    300: '#69c0ff',
                    400: '#40a9ff',
                    500: '#00b4ff',
                    600: '#0088cc',
                    700: '#006699',
                    800: '#004466',
                    900: '#002233',
                },
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
                orange: colors.orange,
                // Mekudo brand
                mekudo: {
                    bg: '#080c14',
                    surface: '#0d1321',
                    card: '#111827',
                    accent: '#00b4ff',
                    success: '#00e5a0',
                    warning: '#ffb300',
                    danger: '#ff4757',
                },
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'mekudo': '0 0 30px rgba(0, 180, 255, 0.08)',
                'mekudo-lg': '0 0 60px rgba(0, 180, 255, 0.12)',
                'mekudo-glow': '0 0 20px rgba(0, 180, 255, 0.3)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
