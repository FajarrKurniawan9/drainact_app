<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { store } from '#lib/store.svelte.ts';
	import { scrolled } from '#lib/motion.ts';
	import { PUBLIC_NAV } from '#lib/content.ts';

	let {
		variant = 'landing',
		active = ''
	}: { variant?: 'landing' | 'shop'; active?: string } = $props();

	let night = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		night = localStorage.getItem('drainact:night') === '1';
		document.documentElement.toggleAttribute('data-theme', false);
		if (night) document.documentElement.setAttribute('data-theme', 'night');
	});

	function toggleNight() {
		night = !night;
		if (night) document.documentElement.setAttribute('data-theme', 'night');
		else document.documentElement.removeAttribute('data-theme');
		try {
			localStorage.setItem('drainact:night', night ? '1' : '0');
		} catch {
			/* private mode */
		}
	}
</script>

<header class="pub-nav" class:shop={variant === 'shop'} use:scrolled={8}>
	<div class="shell-wide nav-row">
		<a href="/" class="brand" aria-label="DrainAct beranda">
			<span class="brand-mark">
				<img src="/img/brand-team.webp" alt="" width="34" height="34" />
			</span>
			<span class="brand-word">DrainAct</span>
		</a>

		<nav class="links" aria-label="Navigasi utama">
			{#each PUBLIC_NAV as item}
				<a class="link" class:active={active === item.label} href={item.href}>{item.label}</a>
			{/each}
		</nav>

		<div class="tools">
			<div class="lang" role="group" aria-label="Bahasa">
				<button class="lang-btn on" aria-pressed="true">ID</button>
				<button class="lang-btn" aria-pressed="false">EN</button>
			</div>

			<button class="icon-btn" onclick={toggleNight} aria-label={night ? 'Mode terang' : 'Mode malam'}>
				<Icon name={night ? 'moon' : 'sun'} size={16} />
			</button>

			<a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="tool-link">
				<Icon name="phone" size={15} />
				<span>Hubungi</span>
			</a>

			<button class="btn btn-lg report-btn" onclick={() => store.openReport()}>
				<Icon name="alert-triangle" size={15} />
				Lapor Sekarang
			</button>

			{#if store.login}
				<a href="/toko/tukar" class="points">
					<span class="coin"><Icon name="coins" size={13} /></span>
					{store.pts} Poin
				</a>
				<a href="/dashboard" class="btn btn-lg ghost">Profile</a>
			{:else}
				<a href="/toko/tukar" class="points muted">
					<span class="coin"><Icon name="coins" size={13} /></span>
					- Poin
				</a>
				<button class="btn btn-lg ghost" onclick={() => store.toggleLogin()}>Login</button>
			{/if}

			<button class="icon-btn burger" onclick={() => (mobileOpen = !mobileOpen)} aria-label="Menu">
				<Icon name={mobileOpen ? 'x' : 'menu'} size={18} />
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="mobile">
			{#each PUBLIC_NAV as item}
				<a href={item.href} onclick={() => (mobileOpen = false)}>{item.label}</a>
			{/each}
			<a href="/lapor" onclick={() => (mobileOpen = false)}>Lapor Sampah</a>
			<a href="/toko/tukar" onclick={() => (mobileOpen = false)}>Tukar Poin</a>
			<a href="/profil" onclick={() => (mobileOpen = false)}>Profil Warga</a>
		</div>
	{/if}
</header>

<style>
	.pub-nav {
		position: sticky;
		top: 0;
		z-index: 80;
		background: color-mix(in srgb, var(--pub-bg-soft) 88%, transparent);
		backdrop-filter: blur(18px) saturate(150%);
		border-bottom: 1px solid transparent;
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	:global(.pub-nav.is-scrolled) {
		background: color-mix(in srgb, var(--pub-bg-soft) 94%, transparent);
		border-bottom-color: var(--pub-line);
		box-shadow: 0 8px 30px -24px rgba(12, 12, 12, 0.45);
	}

	.nav-row {
		height: 72px;
		display: flex;
		align-items: center;
		gap: 28px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	.brand-mark {
		width: 36px;
		height: 36px;
		border-radius: 9px;
		overflow: hidden;
		background: var(--pub-teal);
		box-shadow: 0 4px 10px -6px rgba(44, 122, 122, 0.8);
		transition: transform 0.3s var(--ease-spring);
	}

	.brand:hover .brand-mark {
		transform: rotate(-5deg) scale(1.06);
	}

	.brand-mark img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.brand-word {
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 800;
		letter-spacing: -0.035em;
		color: var(--pub-ink);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 2px;
		flex: 1;
	}

	.link {
		position: relative;
		padding: 8px 12px;
		font-size: 13px;
		font-weight: 500;
		color: var(--pub-ink-2);
		border-radius: 7px;
		transition: color 0.15s, background 0.15s;
		white-space: nowrap;
	}

	.link:hover {
		color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 7%, transparent);
	}

	.link.active {
		color: var(--pub-teal);
		font-weight: 600;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: none;
	}

	.lang {
		display: flex;
		align-items: center;
		background: color-mix(in srgb, var(--pub-ink) 6%, transparent);
		border-radius: var(--r-pill);
		padding: 3px;
	}

	.lang-btn {
		height: 24px;
		padding: 0 9px;
		border: 0;
		border-radius: var(--r-pill);
		background: transparent;
		font-size: 10px;
		font-weight: 700;
		color: var(--pub-muted);
		cursor: pointer;
		transition: background 0.18s, color 0.18s;
	}

	.lang-btn.on {
		background: var(--pub-card);
		color: var(--pub-ink);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}

	.icon-btn {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1px solid var(--pub-line);
		background: transparent;
		color: var(--pub-ink-2);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.15s, transform 0.25s var(--ease-spring);
	}

	.icon-btn:hover {
		background: color-mix(in srgb, var(--pub-ink) 6%, transparent);
		transform: rotate(12deg);
	}

	.tool-link {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
		color: var(--pub-ink-2);
		padding: 8px 6px;
	}

	.tool-link:hover {
		color: var(--pub-teal);
	}

	.btn-lg {
		height: 38px;
		padding: 0 15px;
		border-radius: 9px;
		font-size: 12px;
		font-weight: 600;
	}

	.report-btn {
		background: var(--pub-teal);
		color: #fff;
	}

	.report-btn:hover {
		background: var(--pub-teal-deep);
		box-shadow: 0 10px 22px -12px rgba(44, 122, 122, 0.9);
	}

	.ghost {
		border: 1px solid var(--pub-ink);
		background: transparent;
		color: var(--pub-ink);
		font-weight: 600;
	}

	.ghost:hover {
		background: var(--pub-ink);
		color: var(--pub-bg-soft);
		box-shadow: none;
	}

	.points {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 10px;
		border-radius: var(--r-pill);
		background: var(--pub-amber);
		color: #2a1b00;
		font-size: 11.5px;
		font-weight: 700;
	}

	.points.muted {
		background: color-mix(in srgb, var(--pub-ink) 8%, transparent);
		color: var(--pub-muted);
	}

	.coin {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.45);
	}

	.burger {
		display: none;
	}

	.mobile {
		display: none;
	}

	@media (max-width: 1180px) {
		.links,
		.tool-link,
		.lang {
			display: none;
		}
		.burger {
			display: grid;
		}
		.mobile {
			display: grid;
			gap: 4px;
			padding: 8px 20px 18px;
			border-top: 1px solid var(--pub-line);
			background: var(--pub-bg-soft);
		}
		.mobile a {
			padding: 11px 8px;
			font-size: 14px;
			font-weight: 500;
			color: var(--pub-ink-2);
			border-radius: 8px;
		}
		.mobile a:hover {
			background: color-mix(in srgb, var(--pub-ink) 6%, transparent);
		}
	}

	@media (max-width: 720px) {
		.nav-row {
			height: 62px;
			gap: 12px;
		}
		.brand-word {
			display: none;
		}
		.points {
			display: none;
		}
		.ghost {
			height: 34px;
			padding: 0 12px;
		}
	}
</style>
