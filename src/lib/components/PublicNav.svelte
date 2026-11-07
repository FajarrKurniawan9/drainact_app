<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import DrainLogo from '#lib/components/DrainLogo.svelte';
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
			<DrainLogo size={32} />
			<span class="brand-word">DrainAct</span>
		</a>

		<nav class="links" aria-label="Navigasi utama">
			{#each PUBLIC_NAV as item}
				<a class="link" class:active={active === item.label} href={item.href}>{item.label}</a>
			{/each}
		</nav>

		<div class="tools">
			<button class="btn report-btn" onclick={() => store.openReport()}>
				<Icon name="zap" size={14} />
				<span>+ Lapor Cepat (&lt;30 Detik)</span>
			</button>

			<button class="bell-btn" onclick={() => store.notify('3 notifikasi: Laporan #RPT-8842 sedang ditindaklanjuti oleh Armada Satgas 03.')} aria-label="Notifikasi">
				<Icon name="bell" size={16} />
				<span class="bell-dot"></span>
			</button>

			<a href="/profil" class="user-chip" aria-label="Profil Budi Santoso">
				<span class="user-avatar"><Icon name="user" size={14} /></span>
				<div class="user-info">
					<b class="user-name">Budi Santoso</b>
					<span class="user-pts">{store.pts.toLocaleString('id-ID')} Poin</span>
				</div>
			</a>

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
		color: #ffffff;
		background: var(--pub-teal);
		font-weight: 600;
		border-radius: 999px;
		padding: 7px 16px;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: none;
	}

	.report-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 38px;
		padding: 0 16px;
		border-radius: 999px;
		background: var(--pub-teal);
		color: #ffffff;
		font-size: 12.5px;
		font-weight: 700;
		border: none;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(1, 97, 97, 0.25);
		transition: transform 0.15s ease, background 0.15s ease;
	}

	.report-btn:active {
		transform: scale(0.97);
	}

	.report-btn:hover {
		background: var(--pub-teal-deep);
	}

	.bell-btn {
		position: relative;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid var(--pub-line);
		background: #ffffff;
		color: var(--pub-ink-2);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.bell-btn:hover {
		background: var(--pub-bg-soft);
	}

	.bell-dot {
		position: absolute;
		top: 7px;
		right: 7px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ef4444;
		border: 1.5px solid #ffffff;
	}

	.user-chip {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 4px 14px 4px 6px;
		border-radius: 999px;
		background: #ffffff;
		border: 1px solid var(--pub-line);
		text-decoration: none;
		color: inherit;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		transition: border-color 0.15s ease, transform 0.15s ease;
	}

	.user-chip:hover {
		border-color: var(--pub-teal);
		transform: translateY(-1px);
	}

	.user-avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--pub-teal);
		color: #ffffff;
		display: grid;
		place-items: center;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.user-name {
		font-size: 12px;
		font-weight: 700;
		color: var(--pub-ink);
	}

	.user-pts {
		font-size: 11px;
		font-weight: 700;
		color: var(--pub-teal);
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
