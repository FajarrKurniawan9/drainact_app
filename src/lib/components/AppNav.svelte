<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import DrainLogo from '#lib/components/DrainLogo.svelte';
	import { store } from '#lib/store.svelte.ts';

	let { active = 'Dashboard' }: { active?: string } = $props();

	const links = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Peta Heatmap', href: '/#peta' },
		{ label: 'Eco-Shop', href: '/toko' },
		{ label: 'Kerja Bakti', href: '/kerja-bakti' },
		{ label: 'Profil Saya', href: '/profil' }
	];

	const path = $derived(page.url.pathname);
	const isActive = (label: string, href: string) =>
		active === label || (href !== '/' && path === href.split('#')[0] && label === active);
</script>

<header class="app-nav">
	<div class="shell-wide nav-inner">
		<a href="/" class="brand" aria-label="DrainAct beranda">
			<DrainLogo size={32} />
			<span class="brand-word">DrainAct</span>
		</a>

		<nav class="links" aria-label="Navigasi warga">
			{#each links as link}
				<a href={link.href} class:active={active === link.label}>{link.label}</a>
			{/each}
		</nav>

		<div class="actions">
			<button class="btn report" onclick={() => store.openReport()}>
				<Icon name="zap" size={14} />
				Lapor Cepat (&lt;30 Detik)
			</button>

			<button class="bell" aria-label="Notifikasi" onclick={() => store.notify('3 notifikasi baru: 2 laporan diproses, 1 pesanan dikirim.')}>
				<Icon name="bell" size={17} />
				<span class="bell-dot"></span>
			</button>

			<a href="/profil" class="user">
				<img src="/img/avatar-budi.webp" alt="" width="34" height="34" />
				<span class="user-meta">
					<b>Budi Santoso</b>
					<span><Icon name="coins" size={10} /> {store.pts} Poin</span>
				</span>
				<Icon name="chevron-down" size={12} />
			</a>
		</div>
	</div>
</header>

<style>
	.app-nav {
		position: sticky;
		top: 0;
		z-index: 80;
		height: 76px;
		background: color-mix(in srgb, var(--app-card) 92%, transparent);
		backdrop-filter: blur(16px) saturate(150%);
		border-bottom: 1px solid var(--app-line);
	}

	.nav-inner {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 26px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	.brand-mark {
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: var(--app-surface-2);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		border: 1px solid var(--app-line);
		transition: transform 0.3s var(--ease-spring);
	}

	.brand:hover .brand-mark {
		transform: rotate(-6deg) scale(1.06);
	}

	.brand-word {
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 800;
		letter-spacing: -0.035em;
		color: var(--app-ink);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	.links a {
		height: 36px;
		padding: 0 13px;
		display: inline-flex;
		align-items: center;
		border-radius: var(--r-pill);
		font-size: 12.5px;
		font-weight: 500;
		color: var(--app-muted);
		white-space: nowrap;
		transition: color 0.16s, background 0.16s;
	}

	.links a:hover {
		color: var(--app-ink);
		background: var(--app-surface);
	}

	.links a.active {
		background: var(--app-primary);
		color: #fff;
		font-weight: 600;
		box-shadow: 0 8px 16px -10px rgba(1, 97, 97, 0.8);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	.btn.report {
		height: 38px;
		padding: 0 14px;
		border-radius: var(--r-sm);
		background: var(--app-primary);
		color: #fff;
		font-size: 11.5px;
		font-weight: 700;
	}

	.btn.report:hover {
		background: var(--app-primary-hover);
		transform: translateY(-1px);
	}

	.bell {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: 1px solid var(--app-line);
		background: transparent;
		color: var(--app-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.15s;
	}

	.bell:hover {
		background: var(--app-surface);
	}

	.bell-dot {
		position: absolute;
		top: 8px;
		right: 9px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ef4444;
		border: 2px solid var(--app-card);
	}

	.user {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 10px 0 5px;
		border: 1px solid var(--app-line);
		border-radius: var(--r-pill);
		background: var(--app-surface);
		transition: border-color 0.15s, background 0.15s;
	}

	.user:hover {
		border-color: var(--app-primary-soft);
	}

	.user img {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		object-fit: cover;
	}

	.user-meta {
		line-height: 1.15;
	}

	.user-meta b {
		display: block;
		font-size: 11px;
		font-weight: 700;
		color: var(--app-ink);
	}

	.user-meta span {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 9px;
		color: var(--app-muted);
	}

	.user-meta :global(svg) {
		color: #b45309;
	}

	@media (max-width: 1100px) {
		.links {
			display: none;
		}
		.user-meta {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.app-nav {
			height: 64px;
		}
		.brand-word {
			display: none;
		}
		.btn.report {
			padding: 0 11px;
			font-size: 10.5px;
		}
		.bell {
			display: none;
		}
	}
</style>
