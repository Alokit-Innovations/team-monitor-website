/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./views/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				border: {
					DEFAULT: "hsl(var(--border))",
					dark: "hsl(var(--border-dark))",
				},
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				primary: {
					DEFAULT: "hsl(var(--background-shade))",
					foreground: "hsl(var(--foreground-shade))",
					light: '#ffffff',
				},
				secondary: {
					DEFAULT: '#2196F3',
					foreground: "hsl(213, 31%, 91%)",
					light: '#00c2e0'
				},
				action: {
					active: '#2196F3',
					activeDisabled: '#2196F355',
					inactive: '#C4C4C4',
					inactiveDisabled: '#C4C4C455',
				},
				success: {
					DEFAULT: "#11BB00",
				},
				error: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
					dark: "#FF5252",
				},
				warning: {
					DEFAULT: "hsl(var(--warning) / <alpha-value>)",
					foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
			},
			fontFamily: {
				custom: ['Raleway', 'Roboto', 'sans-serif'],
				money: ['Roboto', 'sans-serif'],
			},
			spacing: {
				'screen-1/2': "50vh"
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};