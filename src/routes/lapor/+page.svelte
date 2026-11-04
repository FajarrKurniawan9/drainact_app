<script lang="ts">
	import { goto } from '$app/navigation';
	import PublicNav from '#lib/components/PublicNav.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import ReportForm from '#lib/components/ReportForm.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/motion.ts';

	const assurances = [
		{ icon: 'shield-check', title: 'Identitas terlindungi', body: 'Pelapor dapat dianonimkan. Data terenkripsi dan terintegrasi SPBE Kota Malang.' },
		{ icon: 'cpu', title: 'Validasi AI 5 detik', body: 'Computer vision memeriksa foto, mengukur keparahan, dan menentukan armada yang berangkat.' },
		{ icon: 'truck', title: 'Respon < 45 menit', body: 'Tiket langsung masuk antrean DLH. Pantau posisi armada dari halaman profil Anda.' }
	];
</script>

<svelte:head>
	<title>Lapor Sampah &amp; Drainase — DrainAct</title>
	<meta name="description" content="Formulir pelaporan sampah liar dan drainase tersumbat Kota Malang. Cepat, presisi, tanpa wajib login." />
</svelte:head>

<div class="lapor-page">
	<PublicNav variant="landing" active="" />

	<section class="band">
		<div class="ring r1"></div>
		<div class="ring r2"></div>
		<div class="shell-wide band-inner">
			<nav class="crumbs" aria-label="Breadcrumb">
				<a href="/">Beranda</a><Icon name="chevron-right" size={11} />
				<a href="/dashboard">Lapor</a><Icon name="chevron-right" size={11} />
				<span>Formulir Cepat</span>
			</nav>

			<div class="band-grid">
				<div>
					<span class="live"><span class="dot dot-live"></span> Kanal pelaporan aktif · 47 laporan hari ini</span>
					<h1>Lapor dalam 30 detik.<br /><em>Kami yang urus sisanya.</em></h1>
					<p>
						Satu foto, satu lokasi, satu laporan. AI memvalidasi, DLH menindaklanjuti, dan Anda bisa
						memantau setiap tahapnya secara transparan.
					</p>
				</div>
				<div class="band-stats">
					<div><b>30<small>dtk</small></b><span>Rata-rata waktu lapor</span></div>
					<div><b>5<small>dtk</small></b><span>Validasi AI vision</span></div>
					<div><b>45<small>mnt</small></b><span>SLA respon armada</span></div>
				</div>
			</div>
		</div>
	</section>

	<div class="form-wrap" use:reveal={{ y: 26 }}>
		<ReportForm variant="page" onclose={() => goto('/dashboard')} />
	</div>

	<section class="assure">
		<div class="shell">
			<div class="assure-grid">
				{#each assurances as a, i}
					<div class="assure-card" use:reveal={{ delay: i * 70 }}>
						<span class="assure-icon"><Icon name={a.icon} size={17} /></span>
						<div>
							<b>{a.title}</b>
							<p>{a.body}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<PublicFooter />
</div>

<style>
	.lapor-page {
		background: var(--pub-bg);
		color: var(--pub-ink);
	}

	.band {
		position: relative;
		background: linear-gradient(150deg, #1d5252, #164e4d 55%, #103f3d);
		color: #fff;
		padding: 44px 0 96px;
		overflow: hidden;
	}

	.ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.r1 {
		width: 700px;
		height: 700px;
		right: -160px;
		top: -380px;
	}

	.r2 {
		width: 1000px;
		height: 1000px;
		right: -320px;
		top: -540px;
	}

	.band-inner {
		position: relative;
		z-index: 1;
	}

	.crumbs {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10.5px;
		color: rgba(255, 255, 255, 0.45);
		margin-bottom: 26px;
	}

	.crumbs a:hover {
		color: #fff;
	}

	.crumbs span {
		color: rgba(255, 255, 255, 0.8);
	}

	.band-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 48px;
		align-items: end;
	}

	.live {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: #a7f3d0;
		margin-bottom: 14px;
	}

	.live .dot {
		background: #4ade80;
		color: #4ade80;
	}

	h1 {
		font-size: clamp(34px, 4.4vw, 52px);
		line-height: 1.04;
		letter-spacing: -0.045em;
		color: #fff;
	}

	h1 em {
		font-style: normal;
		color: #a7f3d0;
	}

	.band p {
		margin-top: 14px;
		max-width: 540px;
		font-size: 12.5px;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.6);
	}

	.band-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}

	.band-stats > div {
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 11px;
		padding: 13px;
		backdrop-filter: blur(6px);
	}

	.band-stats b {
		display: flex;
		align-items: baseline;
		gap: 2px;
		font-family: var(--font-display);
		font-size: 26px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.band-stats small {
		font-size: 9px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
	}

	.band-stats span {
		display: block;
		margin-top: 5px;
		font-size: 8.5px;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.5);
	}

	.form-wrap {
		width: 100%;
		max-width: 920px;
		margin: -72px auto 0;
		padding: 0 24px;
		position: relative;
		z-index: 2;
	}

	.assure {
		padding: 64px 0 72px;
	}

	.assure-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}

	.assure-card {
		display: flex;
		gap: 11px;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 13px;
		padding: 18px;
	}

	.assure-icon {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: color-mix(in srgb, var(--pub-teal) 9%, transparent);
		color: var(--pub-teal);
		display: grid;
		place-items: center;
		flex: none;
	}

	.assure-card b {
		display: block;
		font-size: 12px;
		font-weight: 700;
		margin-bottom: 3px;
	}

	.assure-card p {
		font-size: 10.5px;
		line-height: 1.55;
		color: var(--pub-muted);
	}

	@media (max-width: 860px) {
		.band-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.form-wrap {
			margin-top: -48px;
			padding: 0 14px;
		}
		.assure-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
