<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import DrainLogo from '#lib/components/DrainLogo.svelte';
	import { store } from '#lib/store.svelte.ts';

	let {
		variant = 'dlh',
		active = 'Pemerintah & DLH'
	}: { variant?: 'dlh' | 'seller'; active?: string } = $props();

	const isSeller = $derived(variant === 'seller');
	const brandSub = $derived(isSeller ? 'DRAINACT' : 'MITRA DLH KOTA MALANG');
	const brandTitle = $derived(isSeller ? 'Merchant Center' : 'Command Center');

	const links = $derived(isSeller
		? [
				{ label: 'Merchant Center', href: '/toko/seller' },
				{ label: 'Pemerintah & DLH', href: '/petugas' },
				{ label: 'Eco-Marketplace', href: '/toko' },
				{ label: 'Tentang Kami', href: '/hub#tentang' }
			]
		: [
				{ label: 'Pemerintah & DLH', href: '/petugas' },
				{ label: 'Eco-Marketplace', href: '/toko' },
				{ label: 'Tentang Kami', href: '/hub#tentang' }
				]
				);
</script>

<header class="portal-nav">
	<div class="shell-wide nav-row">
		<a href={isSeller ? '/toko/seller' : '/petugas'} class="brand">
			<DrainLogo size={38} />
			<span class="brand-copy">
				<span class="brand-sub">{brandSub}</span>
				<span class="brand-title">{brandTitle}</span>
			</span>
		</a>

		<nav class="links" aria-label="Navigasi portal">
			{#each links as link}
				<a href={link.href} class:on={active === link.label}>{link.label}</a>
			{/each}
		</nav>

		<div class="actions">
			<button class="btn report" onclick={() => store.openReport()}>
				<Icon name="megaphone" size={13} /> Lapor Cepat (&lt;30 Detik)
			</button>
			<a class="btn portal" href={isSeller ? '/petugas' : '/toko/seller'}>
				<Icon name={isSeller ? 'shield' : 'shopping-bag'} size={13} />
				{isSeller ? 'Portal Petugas' : 'Seller Portal'}
			</a>
			<a href="/profil" class="avatar" aria-label="Profil pengguna">
				{#if isSeller}
					<img src="/img/brand-team.webp" alt="" width="34" height="34" />
				{:else}
					<span class="initials">HW</span>
				{/if}
				<span class="online"></span>
			</a>
		</div>
	</div>
</header>

<style>
	.portal-nav {
		position: sticky;
		top: 0;
		z-index: 80;
		height: 72px;
		background: color-mix(in srgb, var(--app-card) 95%, transparent);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--app-line);
	}

	.nav-row {
		display: flex;
		align-items: center;
		height: 100%;
		gap: 28px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		flex: none;
	}

	.brand-mark {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: var(--app-primary);
		color: #fff;
		display: grid;
		place-items: center;
		transition: transform 0.3s var(--ease-spring);
	}

	.brand:hover .brand-mark {
		transform: rotate(-6deg) scale(1.05);
	}

	.brand-copy {
		line-height: 1.1;
	}

	.brand-sub {
		display: block;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.14em;
		color: var(--app-muted);
	}

	.brand-title {
		display: block;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 800;
		letter-spacing: -0.035em;
		color: var(--app-ink);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 3px;
		flex: 1;
	}

	.links a {
		height: 34px;
		padding: 0 12px;
		display: inline-flex;
		align-items: center;
		border-radius: var(--r-pill);
		font-size: 11.5px;
		font-weight: 500;
		color: var(--app-muted);
		transition: background 0.16s, color 0.16s;
		white-space: nowrap;
	}

	.links a:hover {
		background: var(--app-surface);
		color: var(--app-ink);
	}

	.links a.on {
		background: var(--app-surface-2);
		color: var(--app-primary);
		font-weight: 600;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: none;
	}

	.btn {
		height: 36px;
		padding: 0 12px;
		border-radius: var(--r-sm);
		font-size: 10.5px;
		font-weight: 600;
	}

	.report {
		background: #b91c1c;
		color: #fff;
	}

	.report:hover {
		background: #991b1b;
	}

	.portal {
		background: var(--app-surface);
		border: 1px solid var(--app-line);
		color: var(--app-ink);
	}

	.portal:hover {
		background: var(--app-surface-2);
	}

	.avatar {
		position: relative;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		flex: none;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}

	.initials {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--app-dark);
		color: #fff;
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 700;
	}

	.online {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #10b981;
		border: 2px solid var(--app-card);
	}

	@media (max-width: 1150px) {
		.links {
			display: none;
		}
	}

	@media (max-width: 700px) {
		.portal-nav {
			height: 64px;
		}
		.brand-sub {
			display: none;
		}
		.portal {
			display: none;
		}
		.nav-row {
			gap: 12px;
		}
		.brand-title {
			font-size: 15px;
		}
		.report {
			width: 36px;
			padding: 0;
			font-size: 0;
			gap: 0;
		}
		.report :global(svg) {
			width: 15px;
			height: 15px;
		}
	}
</style>
