<script lang="ts">
	import PortalNav from '#lib/components/PortalNav.svelte';
	import MapView from '#lib/components/MapView.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { counter, reveal } from '#lib/motion.ts';
	import { DLH_CHART, DLH_HOTSPOTS, DLH_METRICS, DLH_ROWS, HERO_MAP_POINTS } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';

	let filter = $state<'semua' | 'parah' | 'proses' | 'selesai'>('semua');
	let layer = $state('genangan');
	let range = $state('7');
	let fileInput: HTMLInputElement;
	let pendingRow = '';

	const rows = $derived(
		DLH_ROWS.filter((r) => {
			if (filter === 'semua') return true;
			if (filter === 'parah') return r.sev === 'Parah';
			if (filter === 'proses') return r.status.includes('Progres') || r.status.includes('Pengerukan') || r.status.includes('En Route');
			return r.status.includes('Baru') || r.status.includes('Standby');
		})
	);

	const chart = $derived(
		range === '7'
			? DLH_CHART
			: [
					{ day: 'M1', value: 4.2 }, { day: 'M2', value: 5.7 }, { day: 'M3', value: 6.8 },
					{ day: 'M4', value: 7.4, peak: true }, { day: 'M5', value: 6.1 }, { day: 'M6', value: 5.2 }
				]
	);
	const maxChart = $derived(Math.max(...chart.map((c) => c.value)));

	function pick(row: string) {
		pendingRow = row;
		fileInput.click();
	}

	async function onFile(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = '';
		const target = store.queue[0];
		if (file && target) {
			await store.cleanReport(target.id, file);
		} else if (file) {
			store.notify('Tidak ada antrean aktif. Bukti tersimpan sebagai arsip.');
		}
		pendingRow = '';
	}
</script>

<svelte:head>
	<title>Command Center DLH — DrainAct</title>
</svelte:head>

<div class="dlh">
	<PortalNav variant="dlh" active="Pemerintah & DLH" />

	<main class="shell-wide main">
		<!-- officer banner -->
		<section class="officer" use:reveal>
			<div class="off-left">
				<div class="off-avatar">HW<span class="online"></span></div>
				<div class="off-copy">
					<div class="off-name">
						<h1>Ir. Hendro Wijaya, M.T.</h1>
						<span class="nip">NIP. 19810412 200604 1 008</span>
						<span class="shift"><span class="dot"></span> SHIFT PAGI · KANAL DISPATCH A</span>
					</div>
					<p>Kabid Operasional Drainase &amp; Tata Air Wilayah Malang Raya · DLH Kota Malang</p>
					<div class="filters">
						<button><Icon name="map-pin" size={12} /> Kec. Lowokwaru (Prioritas)</button>
						<button><Icon name="alert-triangle" size={12} /> Urgensi Parah (AI &gt; 80%)</button>
					</div>
				</div>
			</div>
			<button class="btn primary" onclick={() => store.notify('Tiket khusus dibuka. Pilih laporan untuk disposisi manual.')}>
				<Icon name="plus" size={13} /> Buka Tiket Khusus
			</button>
		</section>

		<!-- triage table -->
		<section class="table-card" use:reveal={{ delay: 60 }}>
			<div class="tc-head">
				<div>
					<h2>Tabel Disposisi &amp; Antrean Tugas Lapangan</h2>
					<p>Prioritas triase otomatis berbasis telemetri sensor debit air &amp; visual AI verifikasi warga.</p>
				</div>
				<div class="live-tag">
					<span>Update Otomatis</span>
					<b><span class="dot dot-live"></span> Real-time (0.8s)</b>
				</div>
			</div>

			<div class="filters-row">
				<div class="tabs" role="tablist">
					<button class:on={filter === 'semua'} onclick={() => (filter = 'semua')}>Semua ({DLH_ROWS.length})</button>
					<button class:on={filter === 'parah'} onclick={() => (filter = 'parah')}>Kritis</button>
					<button class:on={filter === 'proses'} onclick={() => (filter = 'proses')}>Dalam Proses</button>
					<button class:on={filter === 'selesai'} onclick={() => (filter = 'selesai')}>Baru Masuk</button>
				</div>
				<button class="export" onclick={() => store.notify('CSV disposisi diekspor.')}>
					<Icon name="download" size={12} /> Ekspor
				</button>
			</div>

			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th>ID &amp; Jam Masuk</th>
							<th>AI Severitas &amp; Estimasi</th>
							<th>Titik Saluran &amp; GPS</th>
							<th>Armada Terplot</th>
							<th>Tindakan Petugas</th>
						</tr>
					</thead>
					<tbody>
						{#each rows as r}
							<tr>
								<td>
									<div class="id-cell">
										<b>{r.id}</b>
										<span>{r.time} ({r.ago})</span>
									</div>
								</td>
								<td>
									<div class="sev-cell">
										<span class="sev" class:parah={r.sev === 'Parah'}>{r.sev} · {r.severity}% Severity</span>
										<span class="est">{r.estimate}</span>
									</div>
								</td>
								<td>
									<div class="loc-cell">
										<b>{r.loc}</b>
										<span>{r.area}</span>
										<span class="gps"><Icon name="map-pin" size={10} /> {r.gps} · {r.channel}</span>
									</div>
								</td>
								<td>
									<div class="fleet-cell">
										<b>{r.fleet}</b>
										<span>{r.crew}</span>
										<span class="status" class:info={r.tone === 'info'} class:warn={r.tone === 'warn'} class:muted={r.tone === 'muted'}><i></i>{r.status}</span>
									</div>
								</td>
								<td>
									<div class="action-cell">
										<span class="tag">{r.tag}</span>
										<div class="btns">
											<button class="primary-btn" onclick={() => store.notify(`${r.actions[0]} untuk ${r.id}.`)}>{r.actions[0]}</button>
											<button class="camera-btn" onclick={() => pick(r.id)}>
												<Icon name="camera" size={11} /> Before-After
											</button>
										</div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="table-foot">
				<span>Menampilkan {rows.length} dari 84 total insiden aktif antrean triase hari ini</span>
				<div class="pager">
					<button disabled>Sebelumnya</button>
					<button class="on">1</button>
					<button>2</button>
					<button>3</button>
					<button>Berikutnya</button>
				</div>
			</div>
			<input bind:this={fileInput} type="file" accept="image/*" class="hidden-input" onchange={onFile} />
		</section>

		<!-- metrics -->
		<section class="metric-grid">
			{#each DLH_METRICS as m, i}
				<article class="metric" use:reveal={{ delay: i * 50 }}>
					<span class="m-label">{m.label}</span>
					<div class="m-value">{m.value}<em>{m.note}</em></div>
					<div class="m-sub">{m.sub}</div>
				</article>
			{/each}
		</section>

		<!-- map -->
		<section class="map-card" use:reveal>
			<div class="map-head">
				<div>
					<div class="map-title-row">
						<h2>Peta Spasial Command Center: Malang Hydrology Grid</h2>
						<span class="live-badge"><span class="dot dot-live"></span> LIVE TELEMETRY</span>
					</div>
					<p>Pemantauan ketinggian air, curah hujan BMKG Karangploso, dan pelacakan GPS armada.</p>
				</div>
				<div class="layers">
					{#each [{ k: 'genangan', l: 'Ketinggian Genangan', i: 'droplet' }, { k: 'rute', l: 'Rute Armada', i: 'route' }, { k: 'radar', l: 'Radar Hujan BMKG', i: 'wifi' }] as tab}
						<button class:on={layer === tab.k} onclick={() => (layer = tab.k)}><Icon name={tab.i} size={12} /> {tab.l}</button>
					{/each}
				</div>
			</div>

			<div class="map-body">
				<MapView height={420} points={layer === 'radar' ? HERO_MAP_POINTS.filter((p) => p.sev !== 'parah') : HERO_MAP_POINTS} route={layer === 'rute'} labels>
					<div class="map-widget sensor">
						<span class="w-label">Sensor Debit Kali Bantas</span>
						<div class="w-value">184,2 <em>cm</em></div>
						<span class="w-meta">Ambang batas 200 cm · <b>SIAGA 2</b></span>
						<div class="w-gauge"><i style:width="92%"></i></div>
						<p>Pompa Suhat otomatis AKTIF (2/3 unit)</p>
					</div>
					<div class="map-widget weather">
						<span class="w-label">Stasiun BMKG Karangploso</span>
						<div class="w-value small">38 <em>mm/jam</em></div>
						<span class="w-meta amber">Hujan Sedang</span>
					</div>
					<div class="map-widget fleet">
						<span class="fleet-icon"><Icon name="truck" size={14} /></span>
						<div>
							<b>Armada Alpha (Truk Sedot 03)</b>
							<span>Tiba di Jl. Soekarno Hatta dlm ~4 Menit (34 km/j)</span>
						</div>
					</div>
				</MapView>
			</div>
		</section>

		<!-- analytics -->
		<section class="analytics">
			<div class="ana-head">
				<div>
					<div class="eyebrow">Tinjauan Tren &amp; Prediksi Spasial</div>
					<h2>Analitika Kinerja Pembersihan &amp; Hotspot Drainase</h2>
				</div>
				<label class="range">
					<span>Rentang Evaluasi</span>
					<select bind:value={range}>
						<option value="7">7 Hari Terakhir</option>
						<option value="30">30 Hari Terakhir</option>
					</select>
				</label>
			</div>

			<div class="ana-grid">
				<article class="ana-card" use:reveal>
					<div class="ac-head">
						<div><h3>Volume Sampah Terangkat</h3><span>Tonase sampah liar &amp; sedimen drainase</span></div>
						<span class="ac-badge">Total: 42,8 Ton</span>
					</div>
					<div class="bars">
						{#each chart as c}
							<div class="bar-col">
								<span class="bar-value">{c.value.toFixed(1)}T</span>
								<div class="bar-track">
									<div class="bar" class:peak={c.peak} style:height="{(c.value / maxChart) * 100}%"></div>
								</div>
								<span class="bar-day">{c.day}</span>
							</div>
						{/each}
					</div>
					<p class="insight">
						<Icon name="info" size={12} /> Puncak volume terjadi hari Rabu akibat hujan lebat 52mm di kawasan barat Malang.
					</p>
				</article>

				<article class="ana-card" use:reveal={{ delay: 60 }}>
					<div class="ac-head">
						<div><h3>Distrik Hotspot Teratas</h3><span>Kecamatan dengan insiden tertinggi</span></div>
					</div>
					<ul class="hotspots">
						{#each DLH_HOTSPOTS as h, i}
							<li>
								<span class="rank">{i + 1}</span>
								<div class="hs-main">
									<b>{h.name}</b>
									<div class="hs-bar"><i style:width="{h.pct}%"></i></div>
								</div>
								<span class="hs-count">{h.count} <em>({h.pct}%)</em></span>
							</li>
						{/each}
					</ul>
					<p class="reco"><Icon name="sparkles" size={12} /> Rekomendasi: Tambah 1 unit truk hisap siaga di Sub-Rayon Lowokwaru.</p>
				</article>

				<article class="ana-card sla" use:reveal={{ delay: 120 }}>
					<div class="ac-head">
						<div><h3>Efisiensi Penanganan SLA</h3><span>Standar Pelayanan Minimal (SPM) DLH</span></div>
						<span class="ac-badge green">Kategori A</span>
					</div>
					<div class="donut-wrap">
						<svg viewBox="0 0 140 140" class="donut" aria-hidden="true">
							<circle cx="70" cy="70" r="56" stroke="var(--app-surface-2)" stroke-width="13" fill="none" />
							<circle cx="70" cy="70" r="56" stroke="var(--app-primary)" stroke-width="13" fill="none" stroke-linecap="round" stroke-dasharray="325" stroke-dashoffset="25" transform="rotate(-90 70 70)" class="donut-ring" />
						</svg>
						<div class="donut-center"><b use:counter={{ value: 92.4, decimals: 1 }}>92,4</b><span>%</span><em>SLA Dipenuhi</em></div>
					</div>
					<div class="sla-rows">
						<div><span>Target Response (&lt;45 mnt)</span><b>94,1%</b></div>
						<div><span>Penyelesaian Bersih (&lt;3 jam)</span><b>90,7%</b></div>
					</div>
					<button class="audit" onclick={() => store.notify('Laporan audit SPBE (PDF) sedang diunduh.')}>
						<Icon name="download" size={12} /> Unduh Laporan Audit SPBE (PDF)
					</button>
				</article>
			</div>
		</section>
	</main>

	<footer class="dlh-footer">
		<div class="shell-wide foot-grid">
			<div class="fg-brand">
				<div class="fg-logo"><Icon name="shield" size={17} /> DrainAct Civic Ecosystem</div>
				<p>
					Platform tata kelola hidrologi perkotaan, drainase cerdas, dan sirkularitas sampah
					terintegrasi. Menghubungkan partisipasi aktif warga dengan respons cepat dinas teknis
					pemerintah daerah.
				</p>
				<span class="fg-status"><span class="dot"></span> Sistem Telemetri &amp; Dispatch Terbuka · Malang Raya</span>
			</div>
			<div class="fg-col">
				<h4>Hidrologi &amp; Drainase</h4>
				<a href="/dashboard">Peta Telemetri Genangan GIS</a>
				<a href="/dashboard">Sensor Debit Air Kali Bantas</a>
				<a href="/petugas">CCTV Inspeksi Culvert</a>
				<a href="/dashboard">Status Siaga Banjir BMKG</a>
			</div>
			<div class="fg-col">
				<h4>Layanan &amp; Regulasi</h4>
				<a href="/lapor">Pelaporan Warga Cepat</a>
				<a href="/toko">Bank Sampah &amp; Daur Ulang</a>
				<a href="/petugas">Kepatuhan Arsitektur SPBE</a>
				<a href="/petugas">SOP Tanggap Darurat PU PR</a>
			</div>
			<div class="fg-col">
				<h4>Pemerintah Mitra</h4>
				<a href="/hub#tentang">Pemerintah Kota Malang</a>
				<a href="/hub#tentang">Pemerintah Kabupaten Malang</a>
				<a href="/hub#tentang">Pemerintah Kota Batu</a>
				<a href="/hub#tentang">Dinas Lingkungan Hidup Jatim</a>
			</div>
		</div>
		<div class="shell-wide fg-bottom">
			<span>© 2025 DrainAct Civic Tech Initiative. Berstandar SPBE &amp; Satu Data Indonesia.</span>
			<span>Sistem Operasional Drainase Presisi · Malang Raya Pilot</span>
		</div>
	</footer>
</div>

<style>
	.dlh {
		background: var(--app-bg);
		color: var(--app-ink);
		font-family: var(--font-ui);
	}

	.main {
		padding-top: 16px;
		padding-bottom: 40px;
	}

	/* officer */
	.officer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		padding: 16px 18px;
		box-shadow: var(--shadow-xs);
		flex-wrap: wrap;
	}

	.off-left {
		display: flex;
		gap: 12px;
	}

	.off-avatar {
		position: relative;
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: var(--app-dark);
		color: #fff;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 800;
		display: grid;
		place-items: center;
		flex: none;
	}

	.off-avatar .online {
		position: absolute;
		right: -2px;
		bottom: -2px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #10b981;
		border: 2px solid var(--app-card);
	}

	.off-name {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-wrap: wrap;
	}

	.off-name h1 {
		font-size: 20px;
		letter-spacing: -0.03em;
	}

	.nip {
		font-size: 8px;
		font-weight: 600;
		color: var(--app-muted);
		background: var(--app-surface);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.shift {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #0c7a46;
		background: var(--app-success-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.shift .dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #10b981;
	}

	.off-copy p {
		margin-top: 4px;
		font-size: 10px;
		color: var(--app-muted);
	}

	.filters {
		display: flex;
		gap: 5px;
		margin-top: 8px;
		flex-wrap: wrap;
	}

	.filters button {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 25px;
		padding: 0 8px;
		border: 1px solid var(--app-line);
		border-radius: var(--r-pill);
		background: var(--app-surface);
		color: var(--app-body);
		font-size: 8px;
		font-weight: 500;
		cursor: pointer;
	}

	.filters button:hover {
		border-color: var(--app-primary-soft);
		color: var(--app-primary);
	}

	.btn {
		height: 34px;
		padding: 0 12px;
		border-radius: var(--r-sm);
		font-size: 10px;
	}

	.primary {
		background: var(--app-primary);
		color: #fff;
	}

	/* table */
	.table-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		margin-top: 10px;
		overflow: hidden;
		box-shadow: var(--shadow-xs);
	}

	.tc-head {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 16px 10px;
		flex-wrap: wrap;
	}

	.tc-head h2 {
		font-size: 15px;
		letter-spacing: -0.02em;
	}

	.tc-head p {
		margin-top: 2px;
		font-size: 9px;
		color: var(--app-muted);
	}

	.live-tag {
		text-align: right;
	}

	.live-tag span {
		display: block;
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--app-muted);
	}

	.live-tag b {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		color: #0c7a46;
	}

	.live-tag .dot {
		background: #10b981;
		color: #10b981;
	}

	.filters-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 0 16px 10px;
		flex-wrap: wrap;
	}

	.tabs {
		display: flex;
		gap: 3px;
		background: var(--app-surface);
		border-radius: 7px;
		padding: 2px;
	}

	.tabs button {
		height: 26px;
		padding: 0 9px;
		border: 0;
		border-radius: 5px;
		background: transparent;
		font-size: 8.5px;
		color: var(--app-muted);
		cursor: pointer;
	}

	.tabs button.on {
		background: var(--app-card);
		color: var(--app-primary);
		font-weight: 600;
		box-shadow: var(--shadow-xs);
	}

	.export {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 26px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: transparent;
		color: var(--app-body);
		font-size: 8.5px;
		cursor: pointer;
	}

	.table-scroll {
		overflow-x: auto;
		border-top: 1px solid var(--app-line);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 1000px;
	}

	th {
		text-align: left;
		padding: 8px 14px;
		background: var(--app-surface);
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--app-muted);
		border-bottom: 1px solid var(--app-line);
	}

	td {
		padding: 9px 14px;
		border-bottom: 1px solid var(--app-line);
		vertical-align: top;
	}

	tbody tr {
		transition: background 0.15s;
	}

	tbody tr:hover {
		background: var(--app-surface);
	}

	.id-cell b {
		display: block;
		font-size: 9px;
		font-weight: 700;
		color: var(--app-ink);
		letter-spacing: 0.02em;
	}

	.id-cell span {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
		margin-top: 2px;
	}

	.sev-cell {
		display: grid;
		gap: 3px;
	}

	.sev {
		font-size: 8px;
		font-weight: 700;
		padding: 3px 7px;
		border-radius: var(--r-pill);
		background: var(--app-amber-soft);
		color: #92400e;
		width: fit-content;
	}

	.sev.parah {
		background: var(--app-error-soft);
		color: #991b1b;
	}

	.est {
		font-size: 8px;
		color: var(--app-muted);
	}

	.loc-cell b {
		display: block;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-ink);
	}

	.loc-cell > span {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.loc-cell .gps {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--app-primary);
		margin-top: 3px;
	}

	.fleet-cell b {
		display: block;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-ink);
	}

	.fleet-cell > span {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 7.5px;
		font-weight: 600;
		margin-top: 4px;
		color: var(--app-muted);
	}

	.status i {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
	}

	.status.info {
		color: #0369a1;
	}

	.status.warn {
		color: #b45309;
	}

	.action-cell {
		display: grid;
		gap: 4px;
	}

	.tag {
		font-size: 7.5px;
		color: #92400e;
		background: #fff7ed;
		border: 1px solid #fed7aa;
		border-radius: 4px;
		padding: 3px 5px;
		width: fit-content;
	}

	.btns {
		display: flex;
		gap: 3px;
		flex-wrap: wrap;
	}

	.primary-btn,
	.camera-btn {
		height: 24px;
		padding: 0 7px;
		border-radius: 5px;
		font-size: 7.5px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}

	.primary-btn {
		border: 0;
		background: var(--app-primary);
		color: #fff;
	}

	.camera-btn {
		border: 1px solid var(--app-line);
		background: var(--app-card);
		color: var(--app-body);
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}

	.table-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 9px 14px;
		font-size: 8px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.pager {
		display: flex;
		gap: 3px;
	}

	.pager button {
		height: 24px;
		padding: 0 8px;
		border: 1px solid var(--app-line);
		border-radius: 5px;
		background: transparent;
		font-size: 7.5px;
		color: var(--app-muted);
		cursor: pointer;
	}

	.pager button.on {
		background: var(--app-primary);
		border-color: var(--app-primary);
		color: #fff;
	}

	.pager button:disabled {
		opacity: 0.4;
	}

	.hidden-input {
		display: none;
	}

	/* metrics */
	.metric-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 9px;
		margin-top: 10px;
	}

	.metric {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 12px 13px;
		box-shadow: var(--shadow-xs);
	}

	.m-label {
		display: block;
		font-size: 7.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	.m-value {
		margin-top: 5px;
		font-family: var(--font-display);
		font-size: 25px;
		font-weight: 800;
		letter-spacing: -0.045em;
		line-height: 1;
		color: var(--app-ink);
	}

	.m-value em {
		font-style: normal;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-primary);
		margin-left: 5px;
		letter-spacing: 0;
	}

	.m-sub {
		margin-top: 4px;
		font-size: 7.5px;
		color: var(--app-muted);
	}

	/* map */
	.map-card {
		margin-top: 10px;
		background: var(--app-dark);
		border-radius: var(--r-lg);
		padding: 16px;
		color: #fff;
	}

	.map-head {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}

	.map-title-row {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.map-head h2 {
		font-size: 14px;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.live-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: #4ade80;
		background: rgba(74, 222, 128, 0.1);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.map-head p {
		margin-top: 3px;
		font-size: 8.5px;
		color: rgba(255, 255, 255, 0.42);
	}

	.live-badge .dot {
		background: #4ade80;
		color: #4ade80;
	}

	.layers {
		display: flex;
		gap: 2px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 7px;
		padding: 2px;
		height: fit-content;
	}

	.layers button {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 26px;
		padding: 0 8px;
		border: 0;
		border-radius: 5px;
		background: transparent;
		color: rgba(255, 255, 255, 0.5);
		font-size: 8px;
		cursor: pointer;
		white-space: nowrap;
	}

	.layers button.on {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}

	.map-body {
		border-radius: var(--r-md);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.07);
		position: relative;
	}

	.map-widget {
		position: absolute;
		z-index: 3;
		background: rgba(6, 18, 15, 0.8);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 9px 11px;
		color: #fff;
	}

	.map-widget.sensor {
		left: 12px;
		top: 12px;
		width: 210px;
	}

	.map-widget.weather {
		right: 12px;
		top: 12px;
		width: 170px;
	}

	.w-label {
		display: block;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}

	.w-value {
		margin-top: 4px;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.w-value.small {
		font-size: 19px;
	}

	.w-value em {
		font-style: normal;
		font-size: 8px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.42);
		margin-left: 3px;
	}

	.w-meta {
		display: block;
		margin-top: 3px;
		font-size: 7.5px;
		color: rgba(255, 255, 255, 0.45);
	}

	.w-meta b {
		color: #fbbf24;
	}

	.w-meta.amber {
		color: #fbbf24;
		font-weight: 600;
	}

	.w-gauge {
		height: 3px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		margin-top: 7px;
		overflow: hidden;
	}

	.w-gauge i {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, #f59e0b, #ef4444);
		border-radius: inherit;
	}

	.map-widget.sensor p {
		margin-top: 5px;
		font-size: 7px;
		color: rgba(255, 255, 255, 0.38);
	}

	.map-widget.fleet {
		left: 12px;
		bottom: 12px;
		display: flex;
		align-items: center;
		gap: 7px;
		width: fit-content;
	}

	.fleet-icon {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: rgba(74, 222, 128, 0.14);
		color: #4ade80;
		display: grid;
		place-items: center;
		flex: none;
	}

	.map-widget.fleet b {
		display: block;
		font-size: 8.5px;
	}

	.map-widget.fleet span {
		display: block;
		font-size: 7.5px;
		color: rgba(255, 255, 255, 0.4);
	}

	/* analytics */
	.analytics {
		margin-top: 18px;
	}

	.ana-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 14px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}

	.eyebrow {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--app-primary);
	}

	.ana-head h2 {
		margin-top: 4px;
		font-size: clamp(18px, 2vw, 23px);
		letter-spacing: -0.03em;
	}

	.range {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 8px;
		color: var(--app-muted);
	}

	.range select {
		height: 28px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-card);
		font-family: var(--font-ui);
		font-size: 8.5px;
		color: var(--app-body);
		padding: 0 7px;
	}

	.ana-grid {
		display: grid;
		grid-template-columns: 1.05fr 1fr 0.9fr;
		gap: 9px;
	}

	.ana-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 14px;
		box-shadow: var(--shadow-xs);
	}

	.ac-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
	}

	.ac-head h3 {
		font-size: 11px;
		font-weight: 700;
	}

	.ac-head span:not(.ac-badge) {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.ac-badge {
		font-size: 7px;
		font-weight: 700;
		color: var(--app-primary);
		background: var(--app-surface-2);
		border-radius: var(--r-pill);
		padding: 3px 7px;
		white-space: nowrap;
	}

	.ac-badge.green {
		background: var(--app-success-soft);
		color: #0c7a46;
	}

	.bars {
		display: flex;
		align-items: flex-end;
		gap: 7px;
		height: 132px;
		margin-top: 14px;
	}

	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		justify-content: flex-end;
		gap: 3px;
	}

	.bar-value {
		font-size: 6.5px;
		font-weight: 600;
		color: var(--app-muted);
	}

	.bar-track {
		width: 100%;
		height: 92px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.bar {
		width: 68%;
		border-radius: 4px 4px 2px 2px;
		background: color-mix(in srgb, var(--app-primary) 28%, transparent);
		transform-origin: bottom;
		animation: bar-grow 0.9s var(--ease-out) both;
		transition: height 0.5s var(--ease-spring), background 0.2s;
	}

	.bar.peak {
		background: var(--app-primary);
	}

	.bar-col:hover .bar {
		background: var(--app-primary);
	}

	@keyframes bar-grow {
		from { transform: scaleY(0); }
	}

	.bar-day {
		font-size: 7px;
		color: var(--app-muted);
	}

	.insight,
	.reco {
		display: flex;
		align-items: flex-start;
		gap: 5px;
		margin-top: 10px;
		font-size: 7.5px;
		line-height: 1.45;
		color: var(--app-muted);
		background: var(--app-surface);
		border-radius: 6px;
		padding: 7px 8px;
	}

	.insight :global(svg),
	.reco :global(svg) {
		flex: none;
		color: var(--app-primary);
		margin-top: 1px;
	}

	.hotspots {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		display: grid;
		gap: 7px;
	}

	.hotspots li {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.rank {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--app-surface-2);
		color: var(--app-primary);
		font-size: 7px;
		font-weight: 700;
		display: grid;
		place-items: center;
		flex: none;
	}

	.hs-main {
		flex: 1;
		min-width: 0;
	}

	.hs-main b {
		display: block;
		font-size: 8px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.hs-bar {
		height: 3px;
		border-radius: 999px;
		background: var(--app-surface-2);
		margin-top: 3px;
		overflow: hidden;
	}

	.hs-bar i {
		display: block;
		height: 100%;
		background: var(--app-primary);
		border-radius: inherit;
		animation: width-grow 1s var(--ease-out) both;
	}

	@keyframes width-grow {
		from { width: 0; }
	}

	.hs-count {
		font-size: 7.5px;
		font-weight: 700;
		color: var(--app-ink);
		white-space: nowrap;
	}

	.hs-count em {
		font-style: normal;
		font-weight: 400;
		color: var(--app-muted);
	}

	.donut-wrap {
		position: relative;
		width: 150px;
		height: 150px;
		margin: 8px auto 4px;
	}

	.donut {
		width: 100%;
		height: 100%;
	}

	.donut-ring {
		animation: donut 1.3s var(--ease-out) both;
	}

	@keyframes donut {
		from { stroke-dashoffset: 325; }
	}

	.donut-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.donut-center b {
		font-family: var(--font-display);
		font-size: 25px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.donut-center span {
		font-size: 9px;
		font-weight: 700;
		color: var(--app-primary);
		margin-top: -2px;
	}

	.donut-center em {
		font-style: normal;
		font-size: 7px;
		color: var(--app-muted);
	}

	.sla-rows {
		display: grid;
		gap: 4px;
	}

	.sla-rows div {
		display: flex;
		justify-content: space-between;
		font-size: 7.5px;
		color: var(--app-muted);
		padding: 3px 0;
		border-bottom: 1px dashed var(--app-line);
	}

	.sla-rows b {
		color: var(--app-ink);
	}

	.audit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		width: 100%;
		height: 28px;
		margin-top: 8px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-surface);
		color: var(--app-primary);
		font-size: 7.5px;
		font-weight: 600;
		cursor: pointer;
	}

	/* footer */
	.dlh-footer {
		background: var(--app-dark);
		color: rgba(255, 255, 255, 0.55);
		margin-top: 30px;
		padding-top: 40px;
	}

	.foot-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr 1fr;
		gap: 34px;
		padding-bottom: 28px;
	}

	.fg-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		margin-bottom: 10px;
	}

	.fg-logo :global(svg) {
		color: #4ade80;
	}

	.fg-brand p {
		font-size: 10px;
		line-height: 1.6;
		max-width: 330px;
		margin-bottom: 10px;
	}

	.fg-status {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 7.5px;
		color: #4ade80;
	}

	.fg-status .dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #4ade80;
	}

	.fg-col h4 {
		font-family: var(--font-ui);
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.32);
		margin-bottom: 10px;
	}

	.fg-col a {
		display: block;
		font-size: 9px;
		color: rgba(255, 255, 255, 0.55);
		margin-bottom: 7px;
	}

	.fg-col a:hover {
		color: #fff;
	}

	.fg-bottom {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		padding: 12px 32px 18px;
		font-size: 7.5px;
		color: rgba(255, 255, 255, 0.32);
	}

	@media (max-width: 1000px) {
		.metric-grid {
			grid-template-columns: 1fr 1fr;
		}
		.ana-grid {
			grid-template-columns: 1fr;
		}
		.foot-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		.metric-grid {
			grid-template-columns: 1fr;
		}
		.off-left {
			flex-direction: column;
		}
		.foot-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
