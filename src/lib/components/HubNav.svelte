<script lang="ts">
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
</script>

<header class="hub-nav">
	<div class="shell-wide nav-inner">
		<a href="/" class="brand">
			<DrainLogo size={34} />
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
				+ Lapor Cepat (&lt;30 Detik)
			</button>
			<button class="btn-bell" onclick={() => store.notify('3 notifikasi baru dari DLH')} aria-label="Notifikasi">
				<Icon name="bell" size={16} />
				<span class="bell-dot"></span>
			</button>
			<a href="/profil" class="avatar" aria-label="Profil Budi Santoso">
				<img src="/img/avatar-budi.webp" alt="" width="36" height="36" />
				<span class="online"></span>
			</a>
		</div>
	</div>
</header>

<style>
	.hub-nav {
		position: sticky;
		top: 0;
		z-index: 80;
		height: 76px;
		background: color-mix(in srgb, var(--app-card) 94%, transparent);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--app-line);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		height: 100%;
		gap: 30px;
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
		background: var(--app-primary);
		color: #fff;
		display: grid;
		place-items: center;
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
		gap: 3px;
		flex: 1;
	}

	.links a {
		height: 34px;
		padding: 0 13px;
		display: inline-flex;
		align-items: center;
		border-radius: var(--r-pill);
		font-size: 12.5px;
		font-weight: 500;
		color: var(--app-muted);
		transition: background 0.16s, color 0.16s;
		white-space: nowrap;
	}

	.links a:hover {
		background: var(--app-surface);
		color: var(--app-ink);
	}

	.links a.active {
		background: var(--app-surface-2);
		color: var(--app-primary);
		font-weight: 600;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 9px;
		flex: none;
	}

	.btn {
		height: 38px;
		padding: 0 14px;
		border-radius: 9px;
		font-size: 11.5px;
		font-weight: 600;
	}

	.report {
		background: #c53030;
		color: #fff;
	}

	.report:hover {
		background: #a92a2a;
		transform: translateY(-1px);
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

	@media (max-width: 1080px) {
		.links {
			display: none;
		}
	}

	@media (max-width: 700px) {
		.hub-nav {
			height: 64px;
		}
		.brand-word {
			display: none;
		}
		.portal {
			display: none;
		}
		.report {
			padding: 0 11px;
			font-size: 10.5px;
		}
	}
</style>
