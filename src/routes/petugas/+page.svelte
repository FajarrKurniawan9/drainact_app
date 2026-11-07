<script lang="ts">
	import PublicNav from "#lib/components/PublicNav.svelte";
	import PublicFooter from "#lib/components/PublicFooter.svelte";
	import Icon from "#lib/components/Icon.svelte";
	import { reveal } from "#lib/motion.ts";
</script>

<svelte:head><title>Portal DLH &amp; Armada (Dalam Pengembangan) — DrainAct</title></svelte:head>

<div class="coming-page">
	<PublicNav active="" />

	<main class="shell-wide main" use:reveal>
		<div class="card">
			<span class="icon"><Icon name="shield" size={32} /></span>
			<h1>Portal Petugas &amp; Command Center DLH</h1>
			<p>
				Modul operasional lapangan untuk Satgas DLH, monitoring rute armada hidrolik, dan dispatch tugas real-time sedang dalam tahap pengembangan &amp; integrasi API Satu Data Kota Malang.
			</p>
			<div class="actions">
				<a href="/" class="btn primary"><Icon name="home" size={14} /> Kembali ke Dashboard</a>
				<a href="/toko" class="btn secondary"><Icon name="shopping-bag" size={14} /> Kunjungi Eco-Shop</a>
				<a href="/profil" class="btn secondary"><Icon name="user" size={14} /> Profil Warga</a>
			</div>
		</div>
	</main>

	<PublicFooter />
</div>

<style>
	.coming-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f0fdf8;
		color: #0d1e1d;
	}
	.main {
		flex: 1;
		display: grid;
		place-items: center;
		padding: 64px 24px;
	}
	.card {
		max-width: 580px;
		width: 100%;
		background: #ffffff;
		border: 1px solid #d1e7e7;
		border-radius: 20px;
		padding: 48px 36px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(1, 97, 97, 0.06);
	}
	.icon {
		display: inline-grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 20px;
		background: #def2ee;
		color: #016161;
		margin-bottom: 24px;
	}
	h1 {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 12px;
		color: #016161;
	}
	p {
		font-size: 13.5px;
		line-height: 1.65;
		color: #4e6262;
		margin-bottom: 32px;
	}
	.actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		border-radius: 10px;
		font-size: 12px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}
	.btn.primary {
		background: #016161;
		color: #fff;
	}
	.btn.primary:hover {
		background: #004f50;
	}
	.btn.secondary {
		background: #eafdfa;
		color: #016161;
		border: 1px solid #d1e7e7;
	}
	.btn.secondary:hover {
		background: #def2ee;
	}
</style>
