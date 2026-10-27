import { browser } from '$app/env';

class Theme {
	/** Mirrors the `dark` class that app.html sets before first paint. */
	dark = $state(browser && document.documentElement.classList.contains('dark'));

	toggle() {
		this.dark = !this.dark;
		document.documentElement.classList.toggle('dark', this.dark);
		try {
			localStorage.setItem('theme', this.dark ? 'dark' : 'light');
		} catch {
			/* storage unavailable (private mode): theme still applies for this session */
		}
	}
}

export const theme = new Theme();
