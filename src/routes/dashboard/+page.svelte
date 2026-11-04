<script lang="ts">
	import AppNav from '#lib/components/AppNav.svelte';
	import MapView from '#lib/components/MapView.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/motion.ts';
	import { store } from '#lib/store.svelte.ts';

	const metrics = [
		{ label: 'Curah Hujan Rata-Rata', value: '142,8', unit: 'cm', sub: 'Dibandingkan kemarin (138,2 cm)', icon: 'droplet' },
		{ label: 'Status Kondisi Saluran', value: '98,4%', unit: 'Normal', sub: '12 Titik aktif terpantau', icon: 'activity' },
		{ label: 'Indikator Drainase', value: '19', unit: 'Laporan', sub: 'Dalam 24 jam terakhir', icon: 'file-text' },
		{ label: 'Partisipasi Warga', value: '4.852', unit: 'Warga', sub: 'Dengan aktivitas terhubung', icon: 'users' }
	];

	const points = [
		{ x: 24, y: 58, sev: 'parah' as const, label: 'Universitas Brawijaya', count: 14 },
		{ x: 45, y: 36, sev: 'sedang' as const, label: 'Ijen Suites Resort', count: 9 },
		{ x: 58, y: 50, sev: 'kerja' as const, label: 'Alun-Alun Malang', count: 6 },
		{ x: 35, y: 76, sev: 'sedang' as const, label: 'Lembah Tumpang', count: 4 },
		{ x: 72, y: 30, sev: 'kerja' as const, label: 'Blimbing', count: 8 },
		{ x: 78, y: 64, sev: 'parah' as const, label: 'Kedungkandang', count: 11 }
	];

	let layer = $state<'genangan' | 'rute' | 'radar'>('genangan');
	let zoom = $state(1);
	let query = $state('');
	let locating = $state(false);

	function locate() {
		locating = true;
		zoom = 1.18;
		store.notify('Lokasi Anda ditemukan: Klojen, Malang (± 12 m).');
		setTimeout(() => (locating = false), 1200);
	}

	const shownPoints = $derived(
		layer === 'radar' ? points.filter((p) => p.sev === 'kerja') : points
	);
</script>

<svelte:head>
	<title>Dashboard Warga — DrainAct</title>
</svelte:head>

<div class="dash">
	<AppNav active="Dashboard" />

	<div class="map-stage">
		<div class="map-scale" style:transform="scale({zoom})">
			<MapView height={820} points={shownPoints} route={layer === 'rute'} labels />
		</div>

		<div class="overlay top">
			<div class="metric-row" use:reveal={{ delay: 30 }}>
				{#each metrics as m, i}
					<div class="metric" use:reveal={{ delay: 60 + i * 50 }}>
						<div class="metric-head">
							<span>{m.label}</span>
							<span class="metric-icon"><Icon name={m.icon} size={13} /></span>
						</div>
						<div class="metric-value">{m.value}<em>{m.unit}</em></div>
						<div class="metric-sub">{m.sub}</div>
					</div>
				{/each}
			</div>

			<div class="map-bar">
				<label class="search">
					<Icon name="search" size={15} />
					<input bind:value={query} placeholder="Cari jalan, kelurahan, atau ID laporan…" />
					<span class="kbd">⌘ K</span>
				</label>

				<div class="layers" role="group" aria-label="Layer peta">
					<button class:on={layer === 'genangan'} onclick={() => (layer = 'genangan')}>
						<Icon name="droplet" size={13} /> Ketinggian Genangan
					</button>
					<button class:on={layer === 'rute'} onclick={() => (layer = 'rute')}>
						<Icon name="route" size={13} /> Rute Armada
					</button>
					<button class:on={layer === 'radar'} onclick={() => (layer = 'radar')}>
						<Icon name="wifi" size={13} /> Radar Hujan BMKG
					</button>
				</div>
			</div>
		</div>

		<div class="controls">
			<button onclick={() => (zoom = Math.min(1.8, zoom + 0.15))} aria-label="Perbesar peta"><Icon name="plus" size={16} /></button>
			<button onclick={() => (zoom = Math.max(1, zoom - 0.15))} aria-label="Perkecil peta"><Icon name="minus" size={16} /></button>
			<span class="divider"></span>
			<button onclick={locate} aria-label="Deteksi lokasi saya" class:active={locating}>
				<Icon name="target" size={16} />
			</button>
			<button onclick={() => store.openReport()} aria-label="Lapor cepat"><Icon name="alert-triangle" size={16} /></button>
		</div>

		<div class="float-card sensor">
			<div class="fc-head"><span class="dot dot-live"></span> Sensor Debit Kali Bantas</div>
			<div class="fc-value">184,2 <em>cm</em></div>
			<div class="fc-meta">Ambang batas 200 cm · <b>Siaga 2</b></div>
			<div class="gauge"><span style:width="92%"></span></div>
			<p>Pompa Suhat otomatis aktif (2/3 unit).</p>
		</div>

		<div class="float-card weather">
			<div class="fc-head"><Icon name="wind" size={12} /> Stasiun BMKG Karangploso</div>
			<div class="weather-row">
				<strong>38</strong><span>mm/jam<br /><b>Hujan Sedang</b></span>
			</div>
		</div>

		<div class="float-card feed">
			<div class="fc-head"><span class="dot feed-dot"></span> Laporan terbaru</div>
			<ul>
				{#each store.queue.slice(0, 3) as r}
					<li>
						<span class="sev {r.sev}"></span>
						<div><b>{r.loc}</b><span>{r.area} · {r.sev}</span></div>
					</li>
				{/each}
			</ul>
			<a href="/profil">Lihat semua <Icon name="arrow-right" size={12} /></a>
		</div>

		<div class="status-strip">
			<span><i class="live-dot"></i> Telemetri aktif · 12 titik</span>
			<span>Diperbarui 12 detik lalu</span>
			<span class="status-right">Batas aman muka air: <b>200 cm</b></span>
		</div>
	</div>
</div>

<style>
	.dash {
		background: var(--app-bg);
		min-height: 100vh;
	}

	.map-stage {
		position: relative;
		height: calc(100vh - 76px);
		min-height: 680px;
		overflow: hidden;
		background: #0b1c18;
	}

	.map-scale {
		position: absolute;
		inset: -2%;
		transition: transform 0.7s var(--ease-spring);
		will-change: transform;
	}

	.overlay.top {
		position: absolute;
		top: 16px;
		left: 0;
		right: 0;
		z-index: 4;
		padding: 0 28px;
		pointer-events: none;
	}

	.overlay.top > * {
		pointer-events: auto;
	}

	.metric-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.metric {
		background: color-mix(in srgb, var(--app-card) 88%, transparent);
		backdrop-filter: blur(18px) saturate(150%);
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 13px;
		padding: 12px 14px;
		box-shadow: 0 18px 40px -26px rgba(0, 0, 0, 0.65);
		transition: transform 0.25s var(--ease-spring), background 0.25s;
	}

	.metric:hover {
		transform: translateY(-2px);
		background: color-mix(in srgb, var(--app-card) 96%, transparent);
	}

	.metric-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		font-size: 8.5px;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	.metric-icon {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: var(--app-surface-2);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		flex: none;
	}

	.metric-value {
		margin-top: 8px;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
		color: var(--app-ink);
	}

	.metric-value em {
		font-style: normal;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--app-primary);
		margin-left: 5px;
		letter-spacing: 0;
	}

	.metric-sub {
		margin-top: 5px;
		font-size: 8.5px;
		color: var(--app-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.map-bar {
		display: flex;
		align-items: center;
		gap: 10px;
		max-width: 1280px;
		margin: 10px auto 0;
		flex-wrap: wrap;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 38px;
		padding: 0 11px;
		background: color-mix(in srgb, var(--app-card) 92%, transparent);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 9px;
		color: var(--app-muted);
		min-width: 280px;
		flex: 1;
		max-width: 360px;
		box-shadow: 0 14px 30px -22px rgba(0, 0, 0, 0.6);
	}

	.search input {
		border: 0;
		background: transparent;
		outline: none;
		font: inherit;
		font-size: 11.5px;
		color: var(--app-ink);
		width: 100%;
	}

	.search .kbd {
		font-size: 9px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 4px;
		padding: 1px 4px;
		color: var(--app-muted);
		white-space: nowrap;
	}

	.layers {
		display: flex;
		gap: 4px;
		background: color-mix(in srgb, var(--app-card) 88%, transparent);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 9px;
		padding: 4px;
		box-shadow: 0 14px 30px -22px rgba(0, 0, 0, 0.6);
	}

	.layers button {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 28px;
		padding: 0 9px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		font-size: 9.5px;
		font-weight: 500;
		color: var(--app-muted);
		cursor: pointer;
		transition: background 0.16s, color 0.16s;
		white-space: nowrap;
	}

	.layers button:hover {
		color: var(--app-ink);
	}

	.layers button.on {
		background: var(--app-primary);
		color: #fff;
		font-weight: 600;
	}

	.controls {
		position: absolute;
		right: 28px;
		bottom: 96px;
		z-index: 4;
		display: flex;
		flex-direction: column;
		gap: 2px;
		background: color-mix(in srgb, var(--app-card) 92%, transparent);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 11px;
		padding: 4px;
		box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.6);
	}

	.controls button {
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--app-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.15s, color 0.15s, transform 0.18s var(--ease-spring);
	}

	.controls button:hover,
	.controls button.active {
		background: var(--app-surface-2);
		color: var(--app-primary);
	}

	.controls button:active {
		transform: scale(0.93);
	}

	.controls .divider {
		height: 1px;
		background: var(--app-line);
		margin: 3px 4px;
	}

	.float-card {
		position: absolute;
		z-index: 4;
		background: color-mix(in srgb, #0d1e1d 88%, transparent);
		backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		color: #fff;
		padding: 13px 15px;
		box-shadow: 0 24px 50px -26px rgba(0, 0, 0, 0.7);
	}

	.fc-head {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.fc-value {
		margin-top: 8px;
		font-family: var(--font-display);
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.fc-value em {
		font-style: normal;
		font-size: 10px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.45);
		margin-left: 4px;
	}

	.fc-meta {
		margin-top: 5px;
		font-size: 9px;
		color: rgba(255, 255, 255, 0.45);
	}

	.fc-meta b {
		color: #fbbf24;
	}

	.gauge {
		margin-top: 10px;
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		overflow: hidden;
	}

	.gauge span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #f59e0b, #ef4444);
		animation: gauge-grow 1.4s var(--ease-out) both;
	}

	@keyframes gauge-grow {
		from { width: 0; }
	}

	.sensor {
		left: 28px;
		bottom: 96px;
		width: 238px;
	}

	.sensor p {
		margin-top: 7px;
		font-size: 8.5px;
		color: rgba(255, 255, 255, 0.4);
	}

	.weather {
		right: 28px;
		top: 172px;
		width: 196px;
	}

	.weather .fc-head {
		text-transform: none;
		letter-spacing: 0;
		font-weight: 600;
	}

	.weather-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
	}

	.weather-row strong {
		font-family: var(--font-display);
		font-size: 30px;
		font-weight: 800;
		letter-spacing: -0.05em;
	}

	.weather-row span {
		font-size: 8.5px;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.45);
	}

	.weather-row b {
		color: #fbbf24;
		font-weight: 600;
	}

	.feed {
		right: 28px;
		bottom: 96px;
		width: 250px;
	}

	.feed-dot {
		background: #4ade80;
	}

	.feed ul {
		list-style: none;
		margin: 9px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}

	.feed li {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.feed .sev {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-top: 4px;
		flex: none;
	}

	.feed .sev.parah {
		background: #ef4444;
	}

	.feed .sev.sedang {
		background: #f59e0b;
	}

	.feed li b {
		display: block;
		font-size: 9px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.82);
		line-height: 1.35;
	}

	.feed li span:not(.sev) {
		display: block;
		font-size: 8px;
		color: rgba(255, 255, 255, 0.38);
	}

	.feed > a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 10px;
		font-size: 9px;
		font-weight: 600;
		color: #4ade80;
	}

	.status-strip {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 4;
		display: flex;
		align-items: center;
		gap: 22px;
		padding: 11px 28px;
		background: rgba(5, 14, 12, 0.72);
		backdrop-filter: blur(12px);
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.45);
		font-size: 9px;
	}

	.status-strip span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.live-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #4ade80;
		box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15);
	}

	.status-right {
		margin-left: auto;
	}

	.status-right b {
		color: rgba(255, 255, 255, 0.75);
	}

	@media (max-width: 1100px) {
		.metric-row {
			grid-template-columns: 1fr 1fr;
		}
		.feed,
		.sensor,
		.weather {
			display: none;
		}
	}

	@media (max-width: 700px) {
		.map-stage {
			height: auto;
			min-height: 100vh;
		}
		.overlay.top {
			padding: 0 14px;
		}
		.metric-row {
			grid-template-columns: 1fr 1fr;
			gap: 7px;
		}
		.metric {
			padding: 10px;
		}
		.metric-sub {
			display: none;
		}
		.map-bar {
			flex-direction: column;
			align-items: stretch;
		}
		.search {
			max-width: none;
			min-width: 0;
		}
		.layers {
			overflow-x: auto;
		}
		.controls {
			right: 14px;
			bottom: 48px;
		}
		.status-strip {
			padding: 9px 14px;
			font-size: 8px;
		}
		.status-right {
			display: none;
		}
		.map-scale {
			inset: 0;
		}
	}
</style>
