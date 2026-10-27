/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
			},
			colors: {
				b: '#0284C7',
				bh: '#0369A1'
			}
		}
	},
	plugins: []
};
