<script lang="ts">
	import PublicNav from '#lib/components/PublicNav.svelte';
	import TrackingDialog from '#lib/components/TrackingDialog.svelte';
	import MapView from '#lib/components/MapView.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { counter, reveal, tilt } from '#lib/motion.ts';
	import { HUB_SERVICES, HUB_STATS, HERO_MAP_POINTS } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';

	let radius = $state('1 KM');
	let mapFilter = $state('semua');
	function onCardAction(card: any) {
		if (card.action === "Pantau GPS") {
			store.openTracking({
				id: card.id,
				productName: card.title,
				image: "/img/report-1.webp",
				qty: "1 Unit Satgas",
				points: 150,
				cash: 0,
				status: "Dikirim",
				date: "Hari ini",
				courier: card.fleet + (card.fleetSub ? " · " + card.fleetSub : ""),
				eta: card.eta,
				address: card.loc
			});
		} else {
			store.notify("Foto verifikasi pasca-pembersihan tuntas telah diarsip di server DLH.");
		}
	}

	const SERVICE_HREFS = ['/lapor', '/#peta', '/profil', '/toko', '/#peta', '/kerja-bakti'];
	const radii = ['1 KM', '3 KM', 'Malang Raya'];
	const mapFilters = [
		{ key: 'semua', label: 'Kritis / Mampet', count: 4, tone: 'red' },
		{ key: 'sedang', label: 'Waspada / Menumpuk', count: 7, tone: 'amber' },
		{ key: 'kerja', label: 'Optimal / Bersih', count: 24, tone: 'green' }
	];

	const shown = $derived(
		mapFilter === 'semua' ? HERO_MAP_POINTS : HERO_MAP_POINTS.filter((p) => p.sev === mapFilter)
	);

	const pipeline = [
		{
			id: '#RPT-2025-0842',
			severity: 'Parah',
			pct: 88,
			etaLabel: 'Estimasi Penanganan',
			eta: '~18 Menit',
			title: 'Timbunan Sampah Plastik & Ranting di Gorong-Gorong',
			loc: 'Jl. Simpang Gajayana No. 14, Dinoyo',
			ago: 'Dilaporkan 38 menit lalu',
			steps: [
				{ n: '1', title: 'Diterima', sub: 'Terverifikasi AI DLH', state: 'done' },
				{ n: '2', title: 'Disposisi Armada', sub: 'Truk Regu 03 OTW', state: 'active' },
				{ n: '3', title: 'Tuntas Bersih', sub: 'Unggah Bukti Pasca', state: 'todo' }
			],
			fleet: 'Armada Satgas DLH Regu 03',
			fleetSub: 'Truk Hidrolik N 8201 AP · Driver: Pak Joko',
			action: 'Pantau GPS',
			done: false
		},
		{
			id: '#RPT-2025-0839',
			severity: 'Sedang',
			pct: 54,
			etaLabel: 'Status',
			eta: 'Tuntas',
			title: 'Sedimentasi Pasir & Limbah Daun Usai Hujan Deras',
			loc: 'Saluran Jl. Bandung No. 8, Klojen',
			ago: 'Dilaporkan 2 jam lalu',
			steps: [
				{ n: '1', title: 'Diterima', sub: 'Pukul 08:14 WIB', state: 'done' },
				{ n: '2', title: 'Disposisi Armada', sub: 'Pukul 08:28 WIB', state: 'done' },
				{ n: '3', title: 'Tuntas Bersih', sub: 'Pukul 08:52 WIB', state: 'done' }
			],
			fleet: 'Foto Verifikasi Lapangan Tersedia',
			fleetSub: '+50 Eco-Points ditambahkan ke akun Anda',
			action: 'Lihat Bukti Foto',
			done: true
		}
	];
</script>

<svelte:head>
	<title>DrainAct — Predict, Report, Resolve · Malang Raya</title>
</svelte:head>

<div class="hub">
	<PublicNav active="Dashboard" />

	<!-- HERO -->
	<section class="hero">
		<div class="hero-bg" aria-hidden="true"><span></span><span></span><span></span></div>
		<div class="shell-wide hero-grid">
			<div class="copy">
				<div class="tag" use:reveal={{ delay: 30 }}>
					<span class="dot dot-live"></span> CIVIC HYDRO RADAR · MALANG RAYA LIVE
				</div>
				<div class="eyebrow" use:reveal={{ delay: 60 }}>Kanal responsif warga &amp; DLH</div>
				<h1 use:reveal={{ delay: 90 }}>
					Predict, Report, <span>Resolve.</span>
				</h1>
				<p use:reveal={{ delay: 130 }}>
					Platform sipil cerdas pemantauan drainase &amp; pelaporan timbunan sampah liar tanpa
					repot. Lindungi lingkungan kota dari genangan air dan sedimentasi parah secara realtime.
				</p>
				<div class="ctas" use:reveal={{ delay: 160 }}>
					<button class="btn btn-lg primary" onclick={() => store.openReport()}>
						<Icon name="megaphone" size={16} /> Lapor Sampah Instan (&lt;30 Detik)
					</button>
					<a class="btn btn-lg outline" href="#pipeline">
						<Icon name="play" size={14} /> Pelajari Cara Kerja
					</a>
				</div>
				<p class="micro" use:reveal={{ delay: 190 }}>
					<Icon name="check" size={13} /> Tanpa wajib login · Langsung terhubung ke dinas DLH
				</p>

				<div class="metrics" use:reveal={{ delay: 220 }}>
					<div><b use:counter={{ value: 15.4, decimals: 1 }}>15,4</b><span>K+</span><em>Laporan Tuntas</em><small>Malang &amp; Batu</small></div>
					<div><b use:counter={{ value: 94.8, decimals: 1 }}>94,8</b><span>%</span><em>Akurasi AI</em><small>Deteksi Volume Sampah</small></div>
					<div><b>24</b><span>Min</span><em>Rata-rata Respon</em><small>Tim Reaksi Cepat</small></div>
				</div>
			</div>

			<div class="visual" use:reveal={{ delay: 120 }} use:tilt={3}>
				<div class="hydro">
					<div class="hydro-glow"></div>
					<svg class="hydro-map" viewBox="0 0 460 460" fill="none" aria-hidden="true">
						<defs>
							<radialGradient id="hydroBg" cx="50%" cy="45%" r="60%">
								<stop offset="0%" stop-color="#A5F0EF" stop-opacity="0.55" />
								<stop offset="100%" stop-color="#D1E7E7" stop-opacity="0.05" />
							</radialGradient>
							<linearGradient id="riverLine" x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stop-color="#016161" />
								<stop offset="100%" stop-color="#35C8A8" />
							</linearGradient>
						</defs>
						<circle cx="230" cy="230" r="205" fill="url(#hydroBg)" stroke="#D1E7E7" />
						<circle cx="230" cy="230" r="165" stroke="#B5CBCB" stroke-opacity="0.55" />
						<circle cx="230" cy="230" r="120" stroke="#B5CBCB" stroke-opacity="0.4" stroke-dasharray="3 6" />
						<circle cx="230" cy="230" r="72" stroke="#016161" stroke-opacity="0.18" />
						<path d="M40 260 C 110 200, 150 300, 220 250 S 330 160, 430 210" stroke="url(#riverLine)" stroke-width="14" stroke-linecap="round" opacity="0.28" />
						<path d="M40 260 C 110 200, 150 300, 220 250 S 330 160, 430 210" stroke="#016161" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="10 9" class="flow" />
						<path d="M120 80 C 150 150, 220 140, 250 200 S 300 300, 380 340" stroke="#35C8A8" stroke-width="2" opacity="0.5" stroke-dasharray="4 7" />
						<g class="nodes">
							<circle cx="135" cy="240" r="6" fill="#016161" />
							<circle cx="135" cy="240" r="11" stroke="#016161" stroke-opacity="0.25" />
							<circle cx="275" cy="190" r="5" fill="#F59E0B" />
							<circle cx="275" cy="190" r="10" stroke="#F59E0B" stroke-opacity="0.3" />
							<circle cx="330" cy="265" r="6" fill="#10B981" />
							<circle cx="330" cy="265" r="11" stroke="#10B981" stroke-opacity="0.3" />
						</g>
						<g class="center-pin">
							<circle cx="230" cy="230" r="17" fill="#016161" />
							<path d="M230 222a5 5 0 0 1 5 5c0 4-5 8-5 8s-5-4-5-8a5 5 0 0 1 5-5Z" fill="#fff" />
						</g>
					</svg>

					<div class="chip clean"><Icon name="leaf" size={13} /> DrainAct Clean Tech</div>
					<div class="chip circular"><span class="dot"></span> 100% Sirkular</div>
					<div class="chip smooth"><Icon name="check-circle" size={13} /> Saluran Lancar</div>
					<div class="chip flood"><Icon name="shield-check" size={13} /> Bebas Banjir</div>

					<div class="hydro-card left">
						<span class="hc-icon"><Icon name="activity" size={14} /></span>
						<div><b>Kondisi Kawasan</b><span>Optimal &amp; Terjaga</span></div>
					</div>
					<div class="hydro-card right">
						<span class="hc-icon water"><Icon name="droplet" size={14} /></span>
						<div><b>Aliran Air</b><span>Lancar &amp; Bersih</span></div>
					</div>

					<div class="sensor-pill"><span class="dot dot-live"></span> Sensor debit · 184,2 cm · Siaga 2</div>
				</div>
			</div>
		</div>
	</section>

	<!-- PORTFOLIO -->
	<section class="portfolio-wrap">
		<div class="shell-wide">
			<div class="portfolio" use:reveal>
				<div class="p-head">
					<div>
						<h2>Portofolio Kontribusi Sipil</h2>
						<p>Dampak partisipasi Anda dalam menjaga kebersihan drainase lingkungan</p>
					</div>
					<div class="id-badge"><Icon name="shield-check" size={13} /> ID Warga: MLG-CITIZEN-8842</div>
				</div>
				<div class="p-stats">
					{#each HUB_STATS as s, i}
						<div class="p-stat" use:reveal={{ delay: i * 60 }}>
							<span class="ps-icon"><Icon name={s.icon} size={16} /></span>
							<div>
								<b>{s.value.toLocaleString('id-ID')} <em>{s.suffix}</em></b>
								<span>{s.label}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- GIS RADAR -->
	<section class="gis-section" id="peta">
		<div class="shell-wide">
			<div class="gis-panel" use:reveal>
				<div class="gis-head">
					<div>
						<div class="eyebrow red"><span class="dot dot-live"></span> GIS Live Inundation &amp; Trash Clutter Radar</div>
						<h2>Pantau Sampah &amp; Drainase di Lingkungan Anda</h2>
						<p>Visualisasi sensor telemetri gorong-gorong dan titik pelaporan liar terverifikasi warga.</p>
					</div>
					<div class="radius" role="group" aria-label="Radius peta">
						{#each radii as r}
							<button class:on={radius === r} onclick={() => (radius = r)}>{r}{r === '1 KM' ? ' Radius' : ''}</button>
						{/each}
					</div>
				</div>

				<div class="gis-chips">
					{#each mapFilters as f}
						<button class="gchip" class:on={mapFilter === f.key} onclick={() => (mapFilter = f.key)}>
							<span class="dot {f.tone}"></span>{f.label} ({f.count})
						</button>
					{/each}
				</div>

				<div class="gis-map">
					<MapView height={440} points={shown} route labels>
						<div class="map-legend">
							<span><i class="red"></i> Kritis</span>
							<span><i class="amber"></i> Waspada</span>
							<span><i class="green"></i> Optimal</span>
						</div>
						<div class="map-actions">
							<button onclick={() => store.notify('Lokasi Anda: Klojen, ±12 m.')}><Icon name="target" size={13} /> Deteksi Lokasi Saya</button>
							<a href="/dashboard"><Icon name="arrow-up-right" size={13} /> Buka Peta Telemetri Penuh</a>
						</div>
					</MapView>
				</div>
			</div>
		</div>
	</section>

	<!-- PIPELINE -->
	<section class="pipeline" id="pipeline">
		<div class="shell-wide">
			<div class="section-head" use:reveal>
				<div>
					<div class="eyebrow">Live Resolution Pipeline</div>
					<h2>Pelacakan Status Laporan Terkini</h2>
					<p>Laporan warga divalidasi otomatis oleh AI vision dan langsung diteruskan ke armada DLH terdekat.</p>
				</div>
				<a class="see-all" href="/profil">Lihat Semua 15 Riwayat Anda <Icon name="arrow-right" size={13} /></a>
			</div>

			<div class="pipe-grid">
				{#each pipeline as card, i}
					<article class="pipe-card" use:reveal={{ delay: i * 90 }}>
						<div class="pc-top">
							<div class="pc-ids">
								<span class="pc-id">{card.id}</span>
								<span class="pc-sev" class:parah={card.severity === 'Parah'}>{card.severity} · {card.pct}%</span>
							</div>
							<div class="pc-eta" class:done={card.done}>
								<span>{card.etaLabel}</span>
								<b>{card.eta}</b>
							</div>
						</div>
						<h3>{card.title}</h3>
						<p class="pc-loc"><Icon name="map-pin" size={12} /> {card.loc} <span>•</span> {card.ago}</p>

						<div class="stepper">
							{#each card.steps as s, si}
								<div class="step" class:done={s.state === 'done'} class:active={s.state === 'active'}>
									<span class="node">{#if s.state === 'done'}<Icon name="check" size={9} />{:else}{s.n}{/if}</span>
									<div><b>{s.title}</b><span>{s.sub}</span></div>
									{#if si < card.steps.length - 1}<span class="line" class:filled={s.state === 'done'}></span>{/if}
								</div>
							{/each}
						</div>

						<div class="drawer">
							<div><Icon name={card.done ? 'camera' : 'truck'} size={14} /><span><b>{card.fleet}</b><i>{card.fleetSub}</i></span></div>
							<button class="btn" onclick={() => onCardAction(card)}>{card.action}</button>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- SERVICES -->
	<section class="services">
		<div class="shell-wide">
			<header class="center-head" use:reveal>
				<div class="eyebrow">Ekosistem Presisi Hidrologi &amp; Persampahan</div>
				<h2>Layanan Terpadu DrainAct Warga</h2>
				<p>Akses instrumen mutakhir tata kelola lingkungan terintegrasi dari smartphone Anda tanpa birokrasi berbelit.</p>
			</header>

			<div class="service-grid">
				{#each HUB_SERVICES as s, i}
					<article class="service" use:reveal={{ delay: (i % 3) * 70 }}>
						<span class="s-icon"><Icon name={s.icon} size={19} /></span>
						<h3>{s.title}</h3>
						<p>{s.body}</p>
						<a href={SERVICE_HREFS[i]}>{s.link} <Icon name="arrow-right" size={12} /></a>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta-wrap" id="tentang">
		<div class="shell-wide">
			<div class="cta" use:reveal>
				<div class="cta-glow"></div>
				<div class="cta-copy">
					<span class="cta-pill"><Icon name="shield-check" size={12} /> Satu Data Indonesia · Kemitraan Sipil Tanggap</span>
					<h2>Garda terdepan kebersihan &amp; ketahanan hidrologi lingkungan Anda.</h2>
					<p>
						DrainAct mempercepat penanganan genangan dari hitungan hari menjadi menit. Bergabung
						bersama 34.000 warga aktif menciptakan kota ramah air yang bersih dan berkelanjutan.
					</p>
					<div class="cta-actions">
						<button class="btn btn-lg light" onclick={() => store.openReport()}>Mulai Laporkan Sekarang</button>
						<a class="btn btn-lg glass" href="/petugas">Pelajari Arsitektur SPBE</a>
					</div>
				</div>

				<div class="testi">
					<div class="stars">{#each { length: 5 } as _}<Icon name="star" size={13} fill />{/each}</div>
					<span class="verified"><Icon name="shield-check" size={11} /> Terverifikasi Warga Sukun</span>
					<blockquote>
						“Dulu pas musim hujan selokan depan gang sering meluap karena sampah kiriman. Sejak lapor
						via DrainAct, tim DLH langsung datang bawa truk vakum dalam waktu 20 menit! Poinnya
						bahkan bisa saya tukar token listrik.”
					</blockquote>
					<div class="testi-author">
						<img src="/img/brand-team.webp" alt="" width="40" height="40" />
						<div><b>Bambang Triantoro</b><span>Ketua RW 04, Kel. Sukun, Kota Malang</span></div>
					</div>
					<div class="testi-foot">
						<span>Laporan #MLG-4109 Tuntas</span>
						<span>Respon Waktu: 19 Menit</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<PublicFooter />
	<TrackingDialog />
</div>

<style>
	.hub {
		background: var(--app-bg);
		color: var(--app-ink);
		font-family: var(--font-ui);
	}

	/* hero */
	.hero {
		position: relative;
		background: var(--app-bg);
		padding: 56px 0 48px;
		overflow: hidden;
	}

	.hero-bg span {
		position: absolute;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--app-primary) 7%, transparent);
	}

	.hero-bg span:nth-child(1) { width: 640px; height: 640px; right: -80px; top: -240px; }
	.hero-bg span:nth-child(2) { width: 900px; height: 900px; right: -210px; top: -370px; }
	.hero-bg span:nth-child(3) { width: 1180px; height: 1180px; right: -350px; top: -510px; }

	.hero-grid {
		position: relative;
		display: grid;
		grid-template-columns: 1.02fr 0.98fr;
		gap: 40px;
		align-items: center;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 28px;
		padding: 0 12px;
		border-radius: var(--r-pill);
		background: var(--app-surface-2);
		border: 1px solid var(--app-line);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--app-primary);
	}

	.tag .dot {
		background: #10b981;
		color: #10b981;
	}

	.eyebrow {
		margin-top: 18px;
		font-size: 9.5px;
		letter-spacing: 0.14em;
		color: var(--app-muted);
	}

	h1 {
		margin-top: 10px;
		font-size: clamp(40px, 4.8vw, 62px);
		line-height: 0.99;
		letter-spacing: -0.05em;
		font-weight: 800;
		color: var(--app-ink);
	}

	h1 span {
		color: var(--app-primary);
	}

	.copy > p {
		margin-top: 16px;
		max-width: 540px;
		font-size: 12.8px;
		line-height: 1.7;
		color: var(--app-body);
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}

	.btn-lg {
		height: 46px;
		padding: 0 19px;
		border-radius: 10px;
		font-size: 12px;
	}

	.primary {
		background: var(--app-primary);
		color: #fff;
		box-shadow: 0 16px 30px -20px rgba(1, 97, 97, 0.8);
	}

	.primary:hover {
		background: var(--app-primary-hover);
	}

	.outline {
		background: transparent;
		border: 1px solid var(--app-line);
		color: var(--app-ink);
	}

	.outline:hover {
		background: var(--app-surface);
	}

	.micro {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 11px;
		font-size: 9.5px;
		color: var(--app-muted);
	}

	.micro :global(svg) {
		color: #10b981;
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-top: 26px;
		max-width: 520px;
	}

	.metrics > div {
		border-left: 1px solid var(--app-line);
		padding-left: 14px;
	}

	.metrics > div:first-child {
		border-left: 0;
		padding-left: 0;
	}

	.metrics b {
		font-family: var(--font-display);
		font-size: 25px;
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--app-primary);
	}

	.metrics > div:nth-child(2) b {
		color: var(--app-ink);
	}

	.metrics span {
		font-size: 12px;
		font-weight: 700;
		color: var(--app-primary);
		margin-left: 1px;
	}

	.metrics em {
		display: block;
		margin-top: 2px;
		font-style: normal;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--app-ink);
	}

	.metrics small {
		display: block;
		font-size: 8.5px;
		color: var(--app-muted);
	}

	/* hydro visual */
	.visual {
		display: flex;
		justify-content: center;
	}

	.hydro {
		position: relative;
		width: 100%;
		max-width: 480px;
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}

	.hydro-glow {
		position: absolute;
		inset: 8%;
		border-radius: 50%;
		background: radial-gradient(circle at 40% 30%, rgba(165, 240, 239, 0.6), transparent 68%);
		filter: blur(20px);
	}

	.hydro-map {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.flow {
		animation: flow 9s linear infinite;
	}

	@keyframes flow {
		to { stroke-dashoffset: -190; }
	}

	.center-pin {
		transform-origin: 230px 230px;
		animation: pin-breathe 4s ease-in-out infinite;
	}

	@keyframes pin-breathe {
		50% { transform: scale(1.08); }
	}

	.chip {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 6px;
		background: color-mix(in srgb, var(--app-card) 90%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--app-line);
		border-radius: 9px;
		padding: 7px 10px;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-ink);
		box-shadow: var(--shadow-sm);
		animation: chip-float 7s ease-in-out infinite;
		white-space: nowrap;
	}

	.chip :global(svg) { color: var(--app-primary); }

	.chip.clean { left: 0; top: 15%; }
	.chip.circular { right: -2%; top: 9%; animation-delay: -2s; color: var(--app-primary); }
	.chip.smooth { left: 4%; bottom: 27%; animation-delay: -3.5s; }
	.chip.flood { right: 2%; bottom: 21%; animation-delay: -1.2s; }

	.chip.circular .dot {
		background: #10b981;
		color: #10b981;
	}

	@keyframes chip-float {
		50% { translate: 0 -6px; }
	}

	.hydro-card {
		position: absolute;
		bottom: 5%;
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: 10px;
		padding: 8px 11px;
		box-shadow: var(--shadow-md);
		font-size: 9px;
	}

	.hydro-card.left { left: 1%; }
	.hydro-card.right { right: 1%; bottom: 11%; }

	.hc-icon {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: var(--app-success-soft);
		color: #0c7a46;
		display: grid;
		place-items: center;
	}

	.hc-icon.water {
		background: var(--app-surface-2);
		color: var(--app-primary);
	}

	.hydro-card b { display: block; font-size: 9px; }
	.hydro-card span:not(.hc-icon) { display: block; font-size: 8px; color: var(--app-muted); }

	.sensor-pill {
		position: absolute;
		top: 0;
		left: 50%;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: var(--app-dark);
		color: rgba(255, 255, 255, 0.8);
		border-radius: var(--r-pill);
		padding: 6px 11px;
		font-size: 8.5px;
		font-weight: 500;
		white-space: nowrap;
		box-shadow: var(--shadow-md);
	}

	.sensor-pill .dot {
		background: #10b981;
		color: #10b981;
	}

	/* portfolio */
	.portfolio-wrap {
		padding: 8px 0 0;
	}

	.portfolio {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-xl);
		padding: 22px 24px;
		box-shadow: var(--shadow-sm);
	}

	.p-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		margin-bottom: 16px;
	}

	.p-head h2 {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.p-head p {
		margin-top: 3px;
		font-size: 10.5px;
		color: var(--app-muted);
	}

	.id-badge {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		font-weight: 700;
		color: var(--app-primary);
		background: var(--app-surface-2);
		border-radius: var(--r-pill);
		padding: 5px 10px;
		white-space: nowrap;
	}

	.p-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
	}

	.p-stat {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--app-surface);
		border-radius: var(--r-md);
		padding: 13px 14px;
		transition: transform 0.25s var(--ease-spring), background 0.25s;
	}

	.p-stat:hover {
		transform: translateY(-2px);
		background: var(--app-surface-2);
	}

	.ps-icon {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		flex: none;
	}

	.p-stat b {
		display: block;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.p-stat b em {
		font-style: normal;
		font-size: 10px;
		font-weight: 600;
		color: var(--app-primary);
	}

	.p-stat span:not(.ps-icon) {
		display: block;
		margin-top: 2px;
		font-size: 8.5px;
		color: var(--app-muted);
	}

	/* gis */
	.gis-section {
		padding: 18px 0 0;
	}

	.gis-panel {
		background: var(--app-dark);
		border-radius: 22px;
		padding: 24px;
		color: #fff;
		overflow: hidden;
	}

	.gis-head {
		display: flex;
		justify-content: space-between;
		gap: 22px;
		align-items: flex-start;
		margin-bottom: 14px;
	}

	.eyebrow.red {
		margin: 0;
		color: #fca5a5;
	}

	.gis-head h2 {
		margin-top: 8px;
		font-size: clamp(24px, 2.9vw, 34px);
		color: #fff;
		letter-spacing: -0.035em;
	}

	.gis-head p {
		margin-top: 6px;
		font-size: 10.5px;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.45);
		max-width: 560px;
	}

	.radius {
		display: flex;
		gap: 2px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 3px;
		flex: none;
	}

	.radius button {
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		font-size: 9px;
		font-weight: 500;
		padding: 6px 9px;
		border-radius: 5px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.16s, color 0.16s;
	}

	.radius button.on {
		background: rgba(255, 255, 255, 0.16);
		color: #fff;
	}

	.gis-chips {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}

	.gchip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 26px;
		padding: 0 10px;
		border-radius: var(--r-pill);
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
		font-size: 8.5px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
	}

	.gchip .dot {
		width: 5px;
		height: 5px;
	}

	.gchip .dot.red { background: #ef4444; }
	.gchip .dot.amber { background: #f59e0b; }
	.gchip .dot.green { background: #10b981; }

	.gchip.on {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.gis-map {
		border-radius: var(--r-lg);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.map-legend {
		position: absolute;
		left: 12px;
		bottom: 12px;
		z-index: 3;
		display: flex;
		gap: 11px;
		background: rgba(5, 14, 12, 0.78);
		backdrop-filter: blur(8px);
		border-radius: 6px;
		padding: 6px 9px;
		font-size: 8px;
		color: rgba(255, 255, 255, 0.7);
	}

	.map-legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.map-legend i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
	}

	.map-legend .red { background: #ef4444; }
	.map-legend .amber { background: #f59e0b; }
	.map-legend .green { background: #10b981; }

	.map-actions {
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 40px;
		z-index: 3;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.map-actions button,
	.map-actions a {
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 30px;
		padding: 0 10px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 7px;
		background: rgba(5, 14, 12, 0.74);
		backdrop-filter: blur(8px);
		color: rgba(255, 255, 255, 0.82);
		font-size: 8.5px;
		font-weight: 500;
		cursor: pointer;
	}

	.map-actions a:hover,
	.map-actions button:hover {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}

	/* pipeline */
	.pipeline {
		padding: 52px 0 56px;
		background: var(--app-bg);
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		margin-bottom: 20px;
	}

	.section-head .eyebrow {
		margin: 0;
	}

	.section-head h2 {
		margin-top: 7px;
		font-size: clamp(24px, 3vw, 33px);
		letter-spacing: -0.035em;
	}

	.section-head p {
		margin-top: 5px;
		max-width: 540px;
		font-size: 10.5px;
		line-height: 1.55;
		color: var(--app-muted);
	}

	.see-all {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 10px;
		font-weight: 600;
		color: var(--app-primary);
		white-space: nowrap;
		padding-bottom: 3px;
		border-bottom: 1px solid transparent;
	}

	.see-all:hover {
		border-color: var(--app-primary);
	}

	.pipe-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.pipe-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		padding: 18px;
		box-shadow: var(--shadow-xs);
		transition: transform 0.25s var(--ease-spring), box-shadow 0.25s;
	}

	.pipe-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	.pc-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 10px;
	}

	.pc-ids {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}

	.pc-id {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--app-primary);
		background: var(--app-surface-2);
		border-radius: 5px;
		padding: 4px 7px;
	}

	.pc-sev {
		font-size: 8.5px;
		font-weight: 600;
		color: #92400e;
		background: var(--app-amber-soft);
		border-radius: 5px;
		padding: 4px 7px;
	}

	.pc-sev.parah {
		color: #991b1b;
		background: var(--app-error-soft);
	}

	.pc-eta {
		text-align: right;
		flex: none;
		background: var(--app-surface);
		border-radius: 7px;
		padding: 5px 8px;
	}

	.pc-eta.done {
		background: var(--app-success-soft);
	}

	.pc-eta span {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
	}

	.pc-eta b {
		display: block;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--app-primary);
	}

	.pc-eta.done b {
		color: #0c7a46;
	}

	.pipe-card h3 {
		margin-top: 11px;
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.35;
	}

	.pc-loc {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 5px;
		font-size: 9.5px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.pc-loc :global(svg) {
		color: var(--app-primary);
	}

	.stepper {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
		margin: 16px 0 14px;
		background: var(--app-surface);
		border-radius: var(--r-md);
		padding: 12px 10px;
	}

	.step {
		position: relative;
		display: flex;
		gap: 7px;
		align-items: flex-start;
		padding-right: 8px;
	}

	.node {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1.5px solid var(--app-line);
		background: var(--app-card);
		color: var(--app-muted);
		font-size: 8px;
		font-weight: 700;
		display: grid;
		place-items: center;
		flex: none;
		z-index: 2;
		transition: background 0.2s, border-color 0.2s, color 0.2s;
	}

	.step.done .node {
		background: #10b981;
		border-color: #10b981;
		color: #fff;
	}

	.step.active .node {
		background: var(--app-primary);
		border-color: var(--app-primary);
		color: #fff;
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--app-primary) 14%, transparent);
	}

	.step b {
		display: block;
		font-size: 8.5px;
		font-weight: 700;
		line-height: 1.25;
		color: var(--app-ink);
	}

	.step span:not(.node):not(.line) {
		display: block;
		margin-top: 2px;
		font-size: 7.5px;
		line-height: 1.3;
		color: var(--app-muted);
	}

	.line {
		position: absolute;
		top: 8px;
		left: 18px;
		right: -10px;
		height: 1px;
		background: var(--app-line);
		z-index: 1;
	}

	.line.filled {
		background: #10b981;
	}

	.drawer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		border-top: 1px solid var(--app-line);
		padding-top: 12px;
	}

	.drawer > div {
		display: flex;
		align-items: flex-start;
		gap: 7px;
		min-width: 0;
	}

	.drawer :global(svg) {
		color: var(--app-primary);
		margin-top: 1px;
		flex: none;
	}

	.drawer b {
		display: block;
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.drawer i {
		display: block;
		font-style: normal;
		font-size: 8.5px;
		color: var(--app-muted);
	}

	.drawer .btn {
		height: 30px;
		padding: 0 10px;
		font-size: 9px;
		border-radius: 6px;
		background: var(--app-primary);
		color: #fff;
		flex: none;
	}

	/* services */
	.services {
		padding: 56px 0 60px;
		background: var(--app-card);
		border-block: 1px solid var(--app-line);
	}

	.center-head {
		text-align: center;
		max-width: 760px;
		margin: 0 auto 30px;
	}

	.center-head .eyebrow {
		margin: 0;
		color: var(--app-primary);
	}

	.center-head h2 {
		margin-top: 8px;
		font-size: clamp(26px, 3.3vw, 36px);
		letter-spacing: -0.04em;
	}

	.center-head p {
		margin: 9px auto 0;
		max-width: 560px;
		font-size: 11px;
		line-height: 1.6;
		color: var(--app-muted);
	}

	.service-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 11px;
	}

	.service {
		background: var(--app-bg);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		padding: 19px;
		transition: transform 0.25s var(--ease-spring), border-color 0.25s, box-shadow 0.25s;
	}

	.service:hover {
		transform: translateY(-3px);
		border-color: var(--app-primary-soft);
		box-shadow: var(--shadow-sm);
	}

	.s-icon {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: var(--app-surface-2);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		margin-bottom: 13px;
	}

	.service h3 {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: -0.015em;
		margin-bottom: 6px;
	}

	.service p {
		font-size: 10px;
		line-height: 1.6;
		color: var(--app-muted);
		min-height: 48px;
	}

	.service a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 11px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--app-primary);
	}

	.service a:hover {
		gap: 7px;
	}

	/* cta */
	.cta-wrap {
		padding: 40px 0 48px;
	}

	.cta {
		position: relative;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 34px;
		background: linear-gradient(135deg, #2c7a7a, #235e5e 60%, #1d5252);
		border-radius: var(--r-xl);
		padding: 36px;
		color: #fff;
		overflow: hidden;
		align-items: center;
	}

	.cta-glow {
		position: absolute;
		width: 560px;
		height: 560px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 65%);
		right: -160px;
		top: -200px;
	}

	.cta-copy {
		position: relative;
		z-index: 1;
	}

	.cta-pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 8.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: var(--r-pill);
		padding: 5px 10px;
		color: rgba(255, 255, 255, 0.8);
	}

	.cta h2 {
		margin-top: 12px;
		font-size: clamp(25px, 3vw, 34px);
		color: #fff;
		letter-spacing: -0.04em;
		max-width: 480px;
	}

	.cta-copy > p {
		margin-top: 11px;
		font-size: 10.5px;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.58);
		max-width: 450px;
	}

	.cta-actions {
		display: flex;
		gap: 8px;
		margin-top: 20px;
		flex-wrap: wrap;
	}

	.light {
		background: #fff;
		color: #164e4d;
	}

	.light:hover {
		background: #eafdfa;
	}

	.glass {
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.24);
		color: #fff;
	}

	.glass:hover {
		background: rgba(255, 255, 255, 0.14);
	}

	.testi {
		position: relative;
		z-index: 1;
		margin: 0;
		background: var(--app-card);
		color: var(--app-ink);
		border-radius: var(--r-lg);
		padding: 20px;
		box-shadow: 0 26px 60px -30px rgba(0, 0, 0, 0.55);
	}

	.stars {
		display: flex;
		gap: 2px;
		color: #f59e0b;
		margin-bottom: 7px;
	}

	.verified {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 8px;
		font-weight: 600;
		color: #0c7a46;
		background: var(--app-success-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.testi blockquote {
		margin: 10px 0 0;
		font-size: 10.5px;
		line-height: 1.65;
		color: var(--app-body);
	}

	.testi-author {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 13px;
	}

	.testi-author img {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		object-fit: cover;
	}

	.testi-author b {
		display: block;
		font-size: 10px;
	}

	.testi-author span {
		display: block;
		font-size: 8.5px;
		color: var(--app-muted);
	}

	.testi-foot {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 12px;
		padding-top: 10px;
		border-top: 1px solid var(--app-line);
		font-size: 7.5px;
		font-weight: 600;
		color: var(--app-primary);
	}

	/* responsive */
	@media (max-width: 1040px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.visual {
			order: -1;
			max-height: 380px;
		}
		.hydro {
			max-width: 360px;
		}
		.p-stats {
			grid-template-columns: 1fr 1fr;
		}
		.pipe-grid {
			grid-template-columns: 1fr;
		}
		.service-grid {
			grid-template-columns: 1fr 1fr;
		}
		.cta {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 680px) {
		.hero {
			padding: 28px 0;
		}
		.visual {
			display: none;
		}
		.metrics {
			grid-template-columns: 1fr 1fr;
		}
		.p-head {
			flex-direction: column;
		}
		.p-stats {
			grid-template-columns: 1fr;
		}
		.gis-head {
			flex-direction: column;
		}
		.service-grid {
			grid-template-columns: 1fr;
		}
		.stepper {
			grid-template-columns: 1fr;
			gap: 8px;
		}
		.line {
			display: none;
		}
		.section-head {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
