<script lang="ts">
	import PublicNav from '#lib/components/PublicNav.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/motion.ts';
</script>

<svelte:head><title>Kerja Bakti (Coming Soon) — DrainAct</title></svelte:head>

<div class="coming-page">
	<PublicNav active="Kerja Bakti" />

	<main class="shell-wide main" use:reveal>
		<div class="card">
			<span class="icon"><Icon name="users" size={32} /></span>
			<h1>Agenda Kerja Bakti Warga</h1>
			<p>Modul partisipasi gotong royong RT/RW dan pembersihan sedimen berkala sedang dalam tahap finalisasi integrasi geospasial DLH Malang Raya.</p>
			<div class="actions">
				<a href="/hub" class="btn primary"><Icon name="home" size={14} /> Kembali ke Beranda</a>
				<a href="/dashboard" class="btn secondary"><Icon name="map" size={14} /> Lihat Peta Heatmap</a>
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
		background: var(--pub-bg);
		color: var(--pub-ink);
	}
	.main {
		flex: 1;
		display: grid;
		place-items: center;
		padding: 64px 24px;
	}
	.card {
		max-width: 560px;
		width: 100%;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 20px;
		padding: 48px 36px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0,0,0,0.04);
	}
	.icon {
		display: inline-grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 20px;
		background: color-mix(in srgb, var(--pub-teal) 10%, transparent);
		color: var(--pub-teal);
		margin-bottom: 24px;
	}
	h1 {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 12px;
	}
	p {
		font-size: 13px;
		line-height: 1.6;
		color: var(--pub-muted);
		margin-bottom: 32px;
	}
	.actions {
		display: flex;
		justify-content: center;
		gap: 12px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		border-radius: 10px;
		font-size: 12px;
		font-weight: 600;
		transition: all 0.2s;
	}
	.btn.primary {
		background: var(--pub-teal);
		color: #fff;
	}
	.btn.primary:hover {
		background: var(--pub-teal-deep);
	}
	.btn.secondary {
		background: var(--pub-bg-soft);
		color: var(--pub-ink);
		border: 1px solid var(--pub-line);
	}
	.btn.secondary:hover {
		background: var(--pub-line);
	}
</style>
