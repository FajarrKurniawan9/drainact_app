<script lang="ts">
	import PublicNav from '#lib/components/PublicNav.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import MapView from '#lib/components/MapView.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { counter, reveal, tilt } from '#lib/motion.ts';
	import { HERO_MAP_POINTS, HERO_STATS, MODULES, PUBLIC_TESTIMONIALS, STEPS } from '#lib/content.ts';
	import { SELLER_PREVIEW } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';

	let mapFilter = $state('semua');

	const filteredPoints = $derived(
		HERO_MAP_POINTS.filter((p) => {
			if (mapFilter === 'semua') return true;
			if (mapFilter === 'kerja') return p.sev === 'kerja';
			return p.sev === mapFilter;
		})
	);

	const filters = [
		{ key: 'semua', label: 'Semua Laporan', tone: '' },
		{ key: 'parah', label: 'Parah', tone: 'red' },
		{ key: 'sedang', label: 'Sedang', tone: 'amber' },
		{ key: 'kerja', label: 'Kerja Bakti', tone: 'green' }
	];
</script>

<svelte:head>
	<title>DrainAct — Predict, Report, Resolve · Kota Malang</title>
	<meta
		name="description"
		content="Laporkan tumpukan sampah liar dan drainase tersumbat di Kota Malang dalam 30 detik. Pantau armada DLH di peta heatmap realtime."
	/>
</svelte:head>

<div class="landing">
	<PublicNav variant="landing" active="" />

	<!-- ============================== HERO ============================== -->
	<section class="hero">
		<div class="hero-bg" aria-hidden="true">
			<span class="ring r1"></span>
			<span class="ring r2"></span>
			<span class="ring r3"></span>
		</div>

		<div class="shell-wide hero-grid">
			<div class="hero-copy">
				<div class="live-pill" use:reveal={{ delay: 40 }}>
					<span class="dot dot-live"></span>
					Live · Jawa Timur · <b>47 laporan hari ini</b>
				</div>

				<h1 use:reveal={{ delay: 80 }}>
					Predict, Report,<br /><span class="accent">Resolve<span class="accent-dot">.</span></span>
				</h1>

				<p class="lede" use:reveal={{ delay: 130 }}>
					DrainAct adalah platform pelaporan tumpukan sampah liar dan sumbatan drainase berbasis
					lokasi. Mulai dari sampah selokan hingga barang bekas/besar yang memakan jalan, laporkan
					dalam &lt;30 detik tanpa login untuk ditindaklanjuti armada DLH &amp; aksi warga.
				</p>

				<div class="hero-actions" use:reveal={{ delay: 170 }}>
					<button class="btn btn-lg primary" onclick={() => store.openReport()}>
						<Icon name="alert-triangle" size={16} />
						Buat Laporan
					</button>
					<a class="btn btn-lg outline" href="#cara-kerja">
						<Icon name="play" size={15} />
						Pelajari Cara Kerja
					</a>
				</div>

				<p class="micro" use:reveal={{ delay: 200 }}>
					<Icon name="check-circle" size={14} />
					Tanpa wajib login · Langsung terhubung ke dinas DLH
				</p>

				<div class="hero-stats" use:reveal={{ delay: 230 }}>
					{#each HERO_STATS as stat, i}
						<div class="stat">
							<b class:teal={i === 0} use:counter={{ value: stat.value }}>{stat.value}</b>
							<span>{stat.label}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="hero-visual" use:reveal={{ delay: 120 }} use:tilt={3}>
				<div class="photo-stage">
					<span class="stage-ring sr1" aria-hidden="true"></span>
					<span class="stage-ring sr2" aria-hidden="true"></span>
					<span class="stage-ring sr3" aria-hidden="true"></span>
					<div class="float-chip tl">
						<span class="chip-dot"></span>
						<div>
							<b>Live monitoring</b>
							<span>Sensor debit Kali Bantas</span>
						</div>
					</div>
					<div class="float-chip tr">
						<Icon name="recycle" size={14} />
						100% Sirkular
					</div>
					<img class="hero-bin" src="/img/hero-bin-cut.webp" alt="Tempat sampah hijau penuh dengan kantong sampah" width="1400" height="764" />
					<img class="hero-cans" src="/img/hero-cans-cut.webp" alt="" width="1400" height="788" aria-hidden="true" />
					<div class="float-card bl">
						<span class="icon-badge"><Icon name="check" size={13} /></span>
						<div>
							<b>Kondisi kawasan</b>
							<span>Optimal &amp; terjaga</span>
						</div>
					</div>
					<div class="float-card br">
						<span class="icon-badge water"><Icon name="droplet" size={13} /></span>
						<div>
							<b>Aliran air</b>
							<span>Lancar &amp; bersih</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ============================== HEAT MAP ============================== -->
	<section class="section map-section" id="peta">
		<div class="shell-wide">
			<div class="section-head" use:reveal>
				<div>
					<div class="eyebrow teal"><span class="dot"></span> Heat Map</div>
					<h2>Pantau sampah di lingkungan Anda</h2>
				</div>
				<div class="live-chip"><span class="dot dot-live"></span> Live · update 12 detik lalu</div>
			</div>

			<div class="map-shell" use:reveal={{ delay: 80 }}>
				<div class="map-toolbar">
					<div class="chips" role="group" aria-label="Filter laporan">
						{#each filters as f}
							<button
								class="chip"
								class:on={mapFilter === f.key}
								onclick={() => (mapFilter = f.key)}
								aria-pressed={mapFilter === f.key}
							>
								{#if f.tone}<span class="chip-dot {f.tone}"></span>{/if}
								{f.label}
							</button>
						{/each}
					</div>
					<div class="map-tools">
						<button class="tool" onclick={() => store.notify('Menampilkan data 7 hari terakhir.')}>7 hari</button>
						<button class="tool" onclick={() => store.notify('Ekspor CSV sedang disiapkan.')}>
							<Icon name="download" size={13} /> Ekspor
						</button>
					</div>
				</div>

				<MapView height={470} points={filteredPoints} labels>
					<div class="cluster-tip">
						<span class="pulse"></span>
						Klaster · 14 kasus
					</div>
					<div class="legend">
						<span><i class="red"></i> Parah</span>
						<span><i class="amber"></i> Sedang</span>
						<span><i class="green"></i> Kerja Bakti</span>
					</div>
				</MapView>

				<div class="map-foot">
					<div><span>Tingkat risiko</span><b class="risk"><i></i> Parah</b></div>
					<div><span>Kasus aktif</span><b>312</b></div>
					<div><span>Tren · 7 hari</span><b class="up">▲ 18%</b></div>
					<div><span>Wilayah aktif</span><b>62 / 78</b></div>
				</div>
			</div>
		</div>
	</section>

	<!-- ============================== STEPS ============================== -->
	<section class="section" id="cara-kerja">
		<div class="shell-wide">
			<header class="center-head" use:reveal>
				<div class="eyebrow teal"><span class="dot"></span> Cara Kerja</div>
				<h2>Tiga langkah mudah, satu lingkungan bebas sampah &amp; banjir</h2>
				<p>
					Siapa saja bisa melapor. Mau lapor tumpukan sampah liar, barang bekas di jalan, atau
					saluran mampet, semuanya cepat, gratis, dan tanpa login.
				</p>
			</header>

			<div class="steps">
				{#each STEPS as step, i}
					<article class="step" use:reveal={{ delay: i * 90 }}>
						<div class="step-top">
							<span class="step-n">{step.n}</span>
							<span class="step-icon"><Icon name={step.icon} size={20} /></span>
						</div>
						<h3>{step.title}</h3>
						<p>{step.body}</p>
						<div class="step-foot">
							<Icon name="check-circle" size={14} />
							{step.foot}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============================== MODULES ============================== -->
	<section class="section modules-section" id="fitur">
		<div class="shell-wide">
			<header class="center-head" use:reveal>
				<div class="eyebrow teal"><span class="dot"></span> Platform · 10 Modul</div>
				<h2>Semua yang dibutuhkan untuk wujudkan lingkungan bersih &amp; bebas banjir</h2>
			</header>

			<div class="modules">
				{#each MODULES as mod, i}
					<article class="module" use:reveal={{ delay: (i % 4) * 60 }}>
						<div class="module-head">
							<span class="module-n">{mod.n}</span>
							<span class="module-icon"><Icon name={mod.icon} size={17} /></span>
						</div>
						<h3>{mod.title}</h3>
						<p>{mod.body}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============================== DLH SECTION ============================== -->
	<section class="section dlh-wrap" id="kerja-bakti">
		<div class="shell-wide">
			<div class="dlh" use:reveal>
				<div class="dlh-copy">
					<div class="eyebrow light"><span class="dot"></span> Untuk Petugas &amp; Armada DLH</div>
					<h2>Garda terdepan kebersihan, dengan alat yang presisi.</h2>
					<p>
						Para petugas kebersihan dan armada DLH kini dibekali dasbor lapangan berbasis
						geospasial. Tinjau posisi sumbatan, navigasi ke titik GPS presisi, dan unggah foto
						before-after untuk menutup laporan secara akuntabel.
					</p>

					<div class="dlh-stats">
						<div><b use:counter={{ value: 2140 }}>2140</b><span>Laporan Tuntas</span></div>
						<div><b>94%</b><span>Respon DLH &lt; 24 jam</span></div>
						<div><b>78</b><span>Kelurahan terjangkau</span></div>
					</div>

					<div class="dlh-actions">
						<a class="btn btn-lg dark" href="/petugas">Portal Utama DLH</a>
						<a class="btn btn-lg glass" href="/petugas">Login Petugas Lapangan</a>
					</div>
				</div>

				<div class="preview" use:tilt={2}>
					<div class="preview-head">
						<div>
							<span class="preview-dot"></span>
							<b>Dashboard DLH</b>
							<span class="preview-loc">· Sawojajar, Malang</span>
						</div>
						<span>14:08 WIB</span>
					</div>
					<div class="preview-kpis">
						<div><span>Terbuka</span><b>23</b><i class="up">▲ 4 hari ini</i></div>
						<div><span>Terverifikasi</span><b>11</b><i class="up">▲ 8 minggu ini</i></div>
						<div><span>Tertangani</span><b>147</b><i class="up">▲ 22 minggu ini</i></div>
						<div><span>Respons</span><b>45m</b><i class="down">▼ 15m</i></div>
					</div>
					<ul class="preview-list">
						{#each SELLER_PREVIEW as row}
							<li>
								<div class="pr-main">
									<b>{row.title}</b>
									<span>{row.meta}</span>
								</div>
								<span class="tag {row.tone}">{row.tag}</span>
								<button class="pr-link">{row.action} <Icon name="chevron-right" size={12} /></button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- ============================== TESTIMONIAL STRIP ============================== -->
	<section class="section quote-section">
		<div class="shell-wide">
			<header class="quote-head" use:reveal>
				<div class="eyebrow teal"><span class="dot"></span> Cerita Warga</div>
				<h2>Dipercaya 34.000 warga Malang Raya.</h2>
				<p>
					Setiap laporan yang masuk mempercepat pembersihan drainase dan mengurangi risiko
					banjir. Inilah suara warga yang merasakan dampaknya langsung.
				</p>
			</header>
			<div class="quote-cards">
				{#each PUBLIC_TESTIMONIALS.slice(0, 3) as t, i}
					<figure class="quote-card" use:reveal={{ delay: i * 80 }}>
						<div class="stars" aria-label="5 dari 5 bintang">
							{#each { length: 5 } as _}<Icon name="star" size={13} fill />{/each}
						</div>
						<blockquote>“{t.text}”</blockquote>
						<figcaption>
							<span class="avatar">{t.name.charAt(0)}</span>
							<div><b>{t.name}</b><span>{t.role}</span></div>
							<Icon name="shield-check" size={18} class="verified" />
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<PublicFooter />
</div>

<style>
	.landing {
		background: var(--pub-bg);
		color: var(--pub-ink);
		font-family: var(--font-ui);
		overflow: clip;
	}

	/* ------------------------------------------------------------- hero */
	.hero {
		position: relative;
		background: var(--pub-bg-soft);
		padding: 72px 0 64px;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--pub-teal) 7%, transparent);
	}

	.r1 {
		width: 760px;
		height: 760px;
		right: -140px;
		top: -260px;
	}

	.r2 {
		width: 1080px;
		height: 1080px;
		right: -300px;
		top: -420px;
	}

	.r3 {
		width: 1400px;
		height: 1400px;
		right: -460px;
		top: -580px;
	}

	.hero-grid {
		position: relative;
		display: grid;
		grid-template-columns: 1.02fr 0.98fr;
		gap: 48px;
		align-items: center;
	}

	.hero-copy {
		padding: 16px 0;
	}

	.live-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 30px;
		padding: 0 13px;
		border-radius: var(--r-pill);
		background: color-mix(in srgb, var(--pub-green) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--pub-green-600) 26%, transparent);
		color: var(--pub-teal-ink);
		font-size: 11.5px;
		font-weight: 500;
	}

	.live-pill b {
		font-weight: 700;
	}

	.live-pill .dot {
		background: var(--pub-green-600);
		color: var(--pub-green-600);
	}

	h1 {
		margin: 22px 0 20px;
		font-size: clamp(46px, 5.4vw, 74px);
		line-height: 0.98;
		letter-spacing: -0.05em;
		font-weight: 800;
		color: var(--pub-ink);
	}

	.accent {
		position: relative;
		color: var(--pub-teal);
	}

	.accent-dot {
		color: var(--pub-green-600);
	}

	.lede {
		max-width: 560px;
		font-size: 14.5px;
		line-height: 1.72;
		color: var(--pub-muted);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}

	.btn-lg {
		height: 50px;
		padding: 0 22px;
		border-radius: 10px;
		font-size: 13.5px;
		font-weight: 600;
	}

	.primary {
		background: var(--pub-teal);
		color: #fff;
		box-shadow: 0 18px 34px -22px rgba(44, 122, 122, 0.85);
	}

	.primary:hover {
		background: var(--pub-teal-deep);
	}

	.outline {
		border: 1px solid color-mix(in srgb, var(--pub-ink) 18%, transparent);
		background: color-mix(in srgb, var(--pub-card) 55%, transparent);
		color: var(--pub-ink);
	}

	.outline:hover {
		background: var(--pub-card);
		box-shadow: var(--shadow-sm);
	}

	.micro {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 14px;
		font-size: 11.5px;
		color: var(--pub-muted);
	}

	.micro :global(svg) {
		color: var(--pub-green-600);
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-top: 34px;
		max-width: 560px;
	}

	.stat {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 12px;
		padding: 14px 15px 13px;
		box-shadow: var(--shadow-xs);
		transition: transform 0.25s var(--ease-spring), box-shadow 0.25s;
	}

	.stat:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-sm);
	}

	.stat b {
		display: block;
		font-family: var(--font-display);
		font-size: 25px;
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--pub-ink);
		line-height: 1.1;
	}

	.stat b.teal {
		color: var(--pub-teal);
	}

	.stat span {
		display: block;
		margin-top: 3px;
		font-size: 11px;
		color: var(--pub-muted);
	}

	/* hero visual */
	.hero-visual {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.photo-stage {
		position: relative;
		width: 100%;
		max-width: 520px;
		aspect-ratio: 1 / 1.02;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		transform-style: preserve-3d;
	}

	.stage-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--pub-teal) 13%, transparent);
		top: 50%;
		left: 50%;
		translate: -50% -50%;
	}

	.sr1 {
		width: 84%;
		height: 84%;
		background: radial-gradient(circle, color-mix(in srgb, var(--pub-teal) 4%, transparent), transparent 68%);
	}

	.sr2 {
		width: 104%;
		height: 104%;
	}

	.sr3 {
		width: 124%;
		height: 124%;
		opacity: 0.6;
	}

	.hero-bin {
		position: relative;
		width: 84%;
		height: auto;
		margin-bottom: 4%;
		filter: drop-shadow(0 34px 38px rgba(20, 60, 55, 0.22));
		z-index: 2;
	}

	.hero-cans {
		position: absolute;
		left: -2%;
		bottom: 0;
		width: 46%;
		height: auto;
		z-index: 3;
		filter: drop-shadow(0 14px 18px rgba(20, 60, 55, 0.16));
	}

	.float-chip {
		position: absolute;
		z-index: 4;
		display: flex;
		align-items: center;
		gap: 8px;
		background: color-mix(in srgb, var(--pub-card) 88%, transparent);
		backdrop-filter: blur(12px);
		border: 1px solid color-mix(in srgb, var(--pub-line) 70%, transparent);
		border-radius: 10px;
		padding: 9px 12px;
		box-shadow: var(--shadow-sm);
		font-size: 11px;
		font-weight: 600;
		color: var(--pub-ink);
		animation: float-y 6s ease-in-out infinite;
	}

	.float-chip.tl {
		left: -2%;
		top: 14%;
	}

	.float-chip.tr {
		right: 0;
		top: 8%;
		gap: 6px;
		color: var(--pub-teal);
		animation-delay: -2s;
	}

	.float-chip b {
		display: block;
		font-size: 10.5px;
	}

	.float-chip span:not(.chip-dot) {
		display: block;
		font-size: 9px;
		font-weight: 400;
		color: var(--pub-muted);
	}

	.chip-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--pub-green-600);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--pub-green-600) 18%, transparent);
	}

	.float-card {
		position: absolute;
		z-index: 4;
		bottom: 12%;
		display: flex;
		align-items: center;
		gap: 9px;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 11px;
		padding: 9px 12px;
		box-shadow: var(--shadow-md);
		font-size: 10.5px;
		animation: float-y 7s ease-in-out infinite;
	}

	.float-card.bl {
		left: 2%;
	}

	.float-card.br {
		right: -2%;
		bottom: 24%;
		animation-delay: -3.5s;
	}

	.float-card b {
		display: block;
		font-size: 10.5px;
	}

	.float-card span:not(.icon-badge) {
		display: block;
		font-size: 9px;
		color: var(--pub-muted);
	}

	.icon-badge {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--pub-green-600) 14%, transparent);
		color: #0c7a46;
		display: grid;
		place-items: center;
		flex: none;
	}

	.icon-badge.water {
		background: color-mix(in srgb, var(--pub-teal) 12%, transparent);
		color: var(--pub-teal);
	}

	@keyframes float-y {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -7px;
		}
	}

	/* ------------------------------------------------------------- sections */
	.section {
		padding: 88px 0;
	}

	.section-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 28px;
	}

	.map-section {
		background: var(--pub-bg);
	}

	.eyebrow {
		font-size: 10.5px;
		letter-spacing: 0.14em;
		color: var(--pub-muted);
	}

	.eyebrow.teal {
		color: var(--pub-teal);
	}

	.eyebrow .dot {
		background: currentColor;
	}

	h2 {
		margin-top: 10px;
		font-size: clamp(30px, 3.6vw, 46px);
		line-height: 1.08;
		letter-spacing: -0.045em;
		font-weight: 800;
		color: var(--pub-ink);
		max-width: 760px;
	}

	.live-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 30px;
		padding: 0 13px;
		border-radius: var(--r-pill);
		border: 1px solid var(--pub-line);
		background: var(--pub-card);
		font-size: 11px;
		color: var(--pub-muted);
		white-space: nowrap;
	}

	.live-chip .dot {
		background: var(--pub-green-600);
		color: var(--pub-green-600);
	}

	.map-shell {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 20px;
		padding: 14px;
		box-shadow: var(--shadow-md);
	}

	.map-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 4px 4px 14px;
		flex-wrap: wrap;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 32px;
		padding: 0 13px;
		border: 1px solid var(--pub-line);
		border-radius: var(--r-pill);
		background: transparent;
		font-size: 11.5px;
		font-weight: 500;
		color: var(--pub-ink-2);
		cursor: pointer;
		transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s;
	}

	.chip:hover {
		background: color-mix(in srgb, var(--pub-ink) 4%, transparent);
	}

	.chip.on {
		background: var(--pub-teal);
		border-color: var(--pub-teal);
		color: #fff;
	}

	.chip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.chip-dot.red {
		background: #ef4444;
	}

	.chip-dot.amber {
		background: #f59e0b;
	}

	.chip-dot.green {
		background: #10b981;
	}

	.chip.on .chip-dot {
		background: #fff;
	}

	.map-tools {
		display: flex;
		gap: 6px;
	}

	.tool {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 12px;
		border: 1px solid var(--pub-line);
		border-radius: 7px;
		background: transparent;
		font-size: 11.5px;
		font-weight: 500;
		color: var(--pub-ink-2);
		cursor: pointer;
	}

	.tool:hover {
		background: color-mix(in srgb, var(--pub-ink) 5%, transparent);
	}

	.cluster-tip {
		position: absolute;
		left: 46%;
		top: 40%;
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 7px;
		background: var(--pub-card);
		color: var(--pub-ink);
		border-radius: 8px;
		padding: 7px 10px;
		font-size: 10.5px;
		font-weight: 600;
		box-shadow: var(--shadow-md);
	}

	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ef4444;
		box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.18);
	}

	.legend {
		position: absolute;
		left: 14px;
		bottom: 14px;
		z-index: 3;
		display: flex;
		gap: 14px;
		background: color-mix(in srgb, var(--pub-card) 92%, transparent);
		backdrop-filter: blur(8px);
		border-radius: 7px;
		padding: 7px 11px;
		font-size: 10px;
		font-weight: 500;
		color: var(--pub-ink-2);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.legend i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.legend .red {
		background: #ef4444;
	}

	.legend .amber {
		background: #f59e0b;
	}

	.legend .green {
		background: #10b981;
	}

	.map-foot {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		border-top: 1px solid var(--pub-line);
		margin-top: 14px;
		padding: 6px 4px 0;
	}

	.map-foot > div {
		padding: 10px 18px;
		border-left: 1px solid var(--pub-line);
	}

	.map-foot > div:first-child {
		border-left: 0;
		padding-left: 4px;
	}

	.map-foot span {
		display: block;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--pub-muted);
		margin-bottom: 4px;
	}

	.map-foot b {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--pub-ink);
	}

	.map-foot .risk {
		color: #c7362f;
	}

	.map-foot .risk i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #ef4444;
	}

	.map-foot .up {
		color: #0c7a46;
	}

	/* center heads */
	.center-head {
		text-align: center;
		max-width: 820px;
		margin: 0 auto 44px;
	}

	.center-head h2 {
		margin-inline: auto;
	}

	.center-head p {
		margin: 16px auto 0;
		max-width: 640px;
		font-size: 13.5px;
		line-height: 1.7;
		color: var(--pub-muted);
	}

	/* steps */
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.step {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 18px;
		padding: 26px;
		box-shadow: var(--shadow-xs);
		transition: transform 0.28s var(--ease-spring), box-shadow 0.28s, border-color 0.28s;
	}

	.step:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
		border-color: color-mix(in srgb, var(--pub-teal) 28%, var(--pub-line));
	}

	.step-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 26px;
	}

	.step-n {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.02em;
		color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 10%, transparent);
		border-radius: 7px;
		padding: 5px 9px;
	}

	.step-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--pub-bg-soft);
		color: var(--pub-teal);
		display: grid;
		place-items: center;
	}

	.step h3 {
		font-size: 19px;
		letter-spacing: -0.025em;
		margin-bottom: 10px;
	}

	.step p {
		font-size: 12.8px;
		line-height: 1.68;
		color: var(--pub-muted);
	}

	.step-foot {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 22px;
		padding-top: 15px;
		border-top: 1px solid var(--pub-line);
		font-size: 10.5px;
		font-weight: 600;
		color: var(--pub-teal);
	}

	/* modules */
	.modules-section {
		background: var(--pub-bg-soft);
		border-block: 1px solid var(--pub-line);
	}

	.modules {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
	}

	@media (min-width: 1081px) {
		.module:nth-child(9) {
			grid-column: 2;
		}
		.module:nth-child(10) {
			grid-column: 3;
		}
	}

	.module {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 14px;
		padding: 20px;
		transition: transform 0.24s var(--ease-spring), border-color 0.24s, box-shadow 0.24s;
	}

	.module:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--pub-teal) 32%, var(--pub-line));
		box-shadow: var(--shadow-sm);
	}

	.module-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.module-n {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--pub-muted);
	}

	.module-icon {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: color-mix(in srgb, var(--pub-teal) 9%, transparent);
		color: var(--pub-teal);
		display: grid;
		place-items: center;
	}

	.module h3 {
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin-bottom: 7px;
	}

	.module p {
		font-size: 11.5px;
		line-height: 1.6;
		color: var(--pub-muted);
	}

	/* DLH block */
	.dlh-wrap {
		padding-top: 40px;
	}

	.dlh {
		position: relative;
		display: grid;
		grid-template-columns: 0.95fr 1.05fr;
		gap: 40px;
		padding: 52px;
		border-radius: 26px;
		background:
			radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.12), transparent 55%),
			linear-gradient(135deg, #2c7a7a, #235e5e 55%, #1d5252);
		color: #fff;
		overflow: hidden;
	}

	.dlh::after {
		content: '';
		position: absolute;
		width: 760px;
		height: 760px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.08);
		right: -300px;
		top: -380px;
	}

	.dlh-copy {
		position: relative;
		z-index: 2;
	}

	.eyebrow.light {
		color: rgba(255, 255, 255, 0.62);
	}

	.dlh h2 {
		color: #fff;
		font-size: clamp(30px, 3.3vw, 42px);
		margin-top: 12px;
	}

	.dlh-copy > p {
		margin-top: 16px;
		font-size: 13px;
		line-height: 1.72;
		color: rgba(255, 255, 255, 0.68);
		max-width: 480px;
	}

	.dlh-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin-top: 28px;
		max-width: 500px;
	}

	.dlh-stats > div {
		background: rgba(255, 255, 255, 0.09);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		padding: 13px 14px;
		backdrop-filter: blur(6px);
	}

	.dlh-stats b {
		display: block;
		font-family: var(--font-display);
		font-size: 23px;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.dlh-stats span {
		display: block;
		margin-top: 5px;
		font-size: 9.5px;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.35;
	}

	.dlh-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}

	.dark {
		background: #10201d;
		color: #fff;
	}

	.dark:hover {
		background: #0a1614;
	}

	.glass {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.28);
		color: #fff;
	}

	.glass:hover {
		background: rgba(255, 255, 255, 0.16);
	}

	.preview {
		position: relative;
		z-index: 2;
		background: var(--pub-card);
		border-radius: 16px;
		color: var(--pub-ink);
		box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		align-self: center;
	}

	.preview-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #12201e;
		color: rgba(255, 255, 255, 0.72);
		padding: 12px 16px;
		font-size: 10px;
	}

	.preview-head > div {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.preview-head b {
		color: #fff;
		font-size: 10.5px;
	}

	.preview-loc {
		color: rgba(255, 255, 255, 0.45);
	}

	.preview-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #4ade80;
	}

	.preview-kpis {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-bottom: 1px solid var(--pub-line);
	}

	.preview-kpis > div {
		padding: 12px 14px;
		border-left: 1px solid var(--pub-line);
	}

	.preview-kpis > div:first-child {
		border-left: 0;
	}

	.preview-kpis span {
		display: block;
		font-size: 9px;
		color: var(--pub-muted);
	}

	.preview-kpis b {
		display: block;
		font-family: var(--font-display);
		font-size: 17px;
		margin: 2px 0;
	}

	.preview-kpis i {
		font-style: normal;
		font-size: 8.5px;
		font-weight: 600;
	}

	.preview-kpis .up {
		color: #0c7a46;
	}

	.preview-kpis .down {
		color: #b45309;
	}

	.preview-list {
		list-style: none;
		margin: 0;
		padding: 4px 0;
	}

	.preview-list li {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--pub-line);
	}

	.preview-list li:last-child {
		border-bottom: 0;
	}

	.pr-main {
		flex: 1;
		min-width: 0;
	}

	.pr-main b {
		display: block;
		font-size: 10px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pr-main span {
		display: block;
		font-size: 9px;
		color: var(--pub-muted);
		margin-top: 2px;
	}

	.tag {
		font-size: 8.5px;
		font-weight: 700;
		padding: 3px 7px;
		border-radius: var(--r-pill);
		white-space: nowrap;
	}

	.tag.info {
		background: #e0f2fe;
		color: #0369a1;
	}

	.tag.warn {
		background: #fef3c7;
		color: #92400e;
	}

	.tag.success {
		background: #d1fae5;
		color: #065f46;
	}

	.tag.danger {
		background: #fee2e2;
		color: #991b1b;
	}

	.tag.violet {
		background: #ede9fe;
		color: #5b21b6;
	}

	.pr-link {
		border: 0;
		background: transparent;
		color: var(--pub-teal);
		font-size: 9.5px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 2px;
		cursor: pointer;
		white-space: nowrap;
	}

	/* quotes */
	.quote-section {
		background: var(--pub-bg);
	}

	.quote-head {
		text-align: center;
		max-width: 720px;
		margin: 0 auto 32px;
	}

	.quote-head h2 {
		font-size: clamp(28px, 3.2vw, 40px);
		margin-top: 10px;
	}

	.quote-head p {
		margin: 14px auto 0;
		font-size: 13px;
		line-height: 1.7;
		color: var(--pub-muted);
		max-width: 560px;
	}

	.quote-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.quote-card {
		margin: 0;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 16px;
		padding: 22px;
		box-shadow: var(--shadow-xs);
	}

	.stars {
		display: flex;
		gap: 2px;
		color: #ffc633;
		margin-bottom: 12px;
	}

	.quote-card blockquote {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.68;
		color: var(--pub-ink-2);
	}

	.quote-card figcaption {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1px solid var(--pub-line);
	}

	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--pub-teal) 14%, transparent);
		color: var(--pub-teal);
		font-size: 12px;
		font-weight: 700;
		display: grid;
		place-items: center;
	}

	.quote-card figcaption b {
		display: block;
		font-size: 11px;
	}

	.quote-card figcaption span:not(.avatar) {
		display: block;
		font-size: 9.5px;
		color: var(--pub-muted);
	}

	.verified {
		margin-left: auto;
		color: var(--pub-green-600);
	}

	/* ------------------------------------------------------------- responsive */
	@media (max-width: 1080px) {
		.hero-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.hero-visual {
			order: -1;
			max-height: 420px;
		}
		.photo-stage {
			max-width: 400px;
		}
		.modules {
			grid-template-columns: repeat(3, 1fr);
		}
		.dlh {
			grid-template-columns: 1fr;
			padding: 36px;
		}
		.quote-grid {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}

	@media (max-width: 760px) {
		.hero {
			padding: 40px 0;
		}
		.hero-bg {
			display: none;
		}
		.hero-visual {
			display: none;
		}
		.hero-stats {
			grid-template-columns: repeat(3, 1fr);
			gap: 8px;
		}
		.stat {
			padding: 11px 10px;
		}
		.stat b {
			font-size: 20px;
		}
		.stat span {
			font-size: 9px;
		}
		.section {
			padding: 60px 0;
		}
		.section-head {
			flex-direction: column;
			align-items: flex-start;
		}
		.steps,
		.modules,
		.quote-cards {
			grid-template-columns: 1fr;
		}
		.map-foot {
			grid-template-columns: 1fr 1fr;
		}
		.map-foot > div:nth-child(3) {
			border-left: 0;
		}
		.dlh-stats {
			grid-template-columns: 1fr;
		}
		.preview-kpis {
			grid-template-columns: 1fr 1fr;
		}
		h1 {
			font-size: 44px;
		}
	}
</style>
