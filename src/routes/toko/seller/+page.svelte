<script lang="ts">
	import PortalNav from '#lib/components/PortalNav.svelte';
	import AppFooter from '#lib/components/AppFooter.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/motion.ts';
	import { SELLER_KPI, SELLER_ORDERS, SELLER_STOCK } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';

	let tab = $state('Semua Perlu Aksi');
	let stockQuery = $state('');

	const tabs = [
		{ label: 'Semua Perlu Aksi', count: 9 },
		{ label: 'Voucher Warga', count: 5 },
		{ label: 'Siap Kirim', count: 3 },
		{ label: 'Selesai Hari Ini', count: 0 }
	];

	const rows = $derived(
		SELLER_ORDERS.filter((o) => {
			if (tab === 'Semua Perlu Aksi') return true;
			if (tab === 'Voucher Warga') return o.payment.includes('Voucher') || o.payment.includes('Poin');
			if (tab === 'Siap Kirim') return o.status.includes('Siap');
			return false;
		})
	);

	const stock = $derived(
		SELLER_STOCK.filter((s) => !stockQuery || s.name.toLowerCase().includes(stockQuery.toLowerCase()))
	);

	const revenue = [62, 74, 58, 86, 70, 92];

	const impacts = [
		{ label: 'Sampah Organik Diolah (Kompos)', value: '850 kg / 1.000 kg Target', pct: 85 },
		{ label: 'Plastik Daur Ulang (Paving & Pot)', value: '350 kg / 400 kg Target', pct: 87.5 },
		{ label: 'Partisipasi Warga Pengguna Voucher', value: '142 Warga Terlayani', pct: 71 }
	];
</script>

<svelte:head>
	<title>Merchant Center — DrainAct Eco-Marketplace</title>
</svelte:head>

<div class="seller">
	<PortalNav variant="seller" active="Merchant Center" />

	<main class="shell-wide main">
		<!-- merchant header -->
		<section class="merchant" use:reveal>
			<div class="m-left">
				<div class="store-avatar"><Icon name="leaf" size={22} /></div>
				<div>
					<div class="m-name">
						<h1>GreenEarth Kompos &amp; Daur Ulang</h1>
						<span class="binaan"><Icon name="shield-check" size={11} /> BINAAN DLH MALANG</span>
					</div>
					<div class="m-meta">
						<span class="rating"><Icon name="star" size={11} fill /> 4,9 / 5.0</span>
						<span>·</span>
						<span>1.482 Ulasan Terverifikasi</span>
						<span>·</span>
						<span>Bank Sampah Induk Sukun</span>
					</div>
					<span class="open"><span class="dot"></span> Toko Buka (Auto-Accept)</span>
				</div>
			</div>
			<div class="m-actions">
				<button class="btn ghost" onclick={() => store.notify('Pemindai QR voucher diaktifkan.')}><Icon name="qr" size={13} /> Validasi Voucher</button>
				<button class="btn primary" onclick={() => store.notify('Form tambah produk dibuka.')}><Icon name="plus" size={13} /> Tambah Produk Baru</button>
			</div>
		</section>

		<!-- orders -->
		<section class="orders" use:reveal={{ delay: 60 }}>
			<div class="o-head">
				<div>
					<div class="o-title"><h2>Pesanan Masuk &amp; Verifikasi Toko</h2><span class="new-badge">9 Baru</span></div>
					<p>Tinjau, siapkan muatan daur ulang, dan panggil armada kurir kelurahan secara instan.</p>
				</div>
				<button class="o-export" onclick={() => store.notify('Rekap pesanan diekspor.')}><Icon name="download" size={12} /> Ekspor</button>
			</div>

			<div class="tabs">
				{#each tabs as t}
					<button class:on={tab === t.label} onclick={() => (tab = t.label)}>
						{t.label}{t.count ? ` (${t.count})` : ''}
					</button>
				{/each}
			</div>

			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th>Order ID &amp; Waktu</th>
							<th>Nama Pembeli / RT-RW</th>
							<th>Item Pesanan Daur Ulang</th>
							<th>Metode Pembayaran</th>
							<th>Status Pemprosesan</th>
							<th>Aksi Cepat Mitra</th>
						</tr>
					</thead>
					<tbody>
						{#each rows as o}
							<tr>
								<td><div class="cell"><b>{o.id}</b><span><Icon name="clock" size={10} /> {o.ago}</span></div></td>
								<td><div class="cell"><b>{o.buyer}</b><span>{o.buyerSub}</span><span class="muted">{o.channel}</span></div></td>
								<td><div class="items">{#each o.items as item}<span>{item}</span>{/each}</div></td>
								<td><div class="cell"><b>{o.payment}</b><span>{o.paymentSub}</span></div></td>
								<td><span class="status {o.tone}"><i></i>{o.status}</span></td>
								<td>
									<div class="row-actions">
										<button class="primary-btn" onclick={() => store.notify(`${o.action} untuk ${o.id}.`)}>{o.action}</button>
										<button class="icon-btn" aria-label="Lihat detail" onclick={() => store.notify(`Detail ${o.id} dibuka.`)}><Icon name="eye" size={12} /></button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="fleet-banner">
				<span class="fleet-icon"><Icon name="truck" size={16} /></span>
				<div>
					<b>Integrasi Armada Eco-Logistik DLH Kota Malang</b>
					<span>Driver armada listrik siaga di Depo Kedungkandang &amp; Sukun. Pesanan siap kirim dijemput maksimal 35 menit.</span>
				</div>
				<button onclick={() => store.notify('Jadwal penjemputan massal dibuka.')}><Icon name="calendar" size={12} /> Jadwal Penjemputan Massal</button>
			</div>
		</section>

		<!-- kpis -->
		<section class="kpis">
			{#each SELLER_KPI as k, i}
				<article class="kpi" use:reveal={{ delay: i * 50 }}>
					<div class="kpi-top"><span>{k.label}</span><span class="kpi-icon"><Icon name={k.icon} size={14} /></span></div>
					<div class="kpi-value">{k.value}</div>
					<div class="kpi-trend">{k.trend}</div>
					<div class="kpi-sub">{k.sub}</div>
				</article>
			{/each}
		</section>

		<!-- revenue & impact -->
		<section class="split">
			<article class="revenue" use:reveal>
				<div class="sec-top">
					<div>
						<h3>Kanal Pendapatan: Tunai/QRIS vs Subsidi Poin Warga</h3>
						<p>Rincian pendapatan mingguan dan realisasi pembayaran subsidi dinas lingkungan hidup.</p>
					</div>
					<div class="legend">
						<span><i class="teal"></i> QRIS/Tunai (64%)</span>
						<span><i class="mint"></i> Poin Warga (36%)</span>
					</div>
				</div>
				<div class="chart">
					{#each revenue as v, i}
						<div class="col">
							<div class="bar-track">
								<div class="bar cash" style:height="{v * 0.64}%"></div>
								<div class="bar points" style:height="{v * 0.36}%"></div>
							</div>
							<span>M{i + 1}{i === 3 ? ' (Saat ini)' : ''}</span>
						</div>
					{/each}
				</div>
				<div class="chart-foot">
					<p><Icon name="info" size={12} /> Klaim kasir subsidi DLH disinkronisasi langsung ke rekening Bank Jatim mitra.</p>
					<button onclick={() => store.notify('Rekap keuangan .xlsx sedang diunduh.')}><Icon name="download" size={12} /> Unduh Rekap (.xlsx)</button>
				</div>
			</article>

			<article class="audit" use:reveal={{ delay: 60 }}>
				<div class="sec-top">
					<div>
						<h3>Audit Dampak Sirkular</h3>
						<p>Kontribusi UMKM terhadap pengurangan beban TPA Supit Urang bulan ini.</p>
					</div>
					<span class="tier">Tier 1 Hijau</span>
				</div>
				<div class="impacts">
					{#each impacts as imp}
						<div class="impact">
							<div class="impact-top"><span>{imp.label}</span><b>{imp.value}</b></div>
							<div class="track"><i style:width="{imp.pct}%"></i></div>
						</div>
					{/each}
				</div>
				<div class="cert"><Icon name="shield-check" size={13} /> Sertifikat Insentif Retribusi Nol Rupiah diterbitkan oleh Dinas Lingkungan Hidup Malang.</div>
			</article>
		</section>

		<!-- stock -->
		<section class="stock-sec" use:reveal>
			<div class="stock-head">
				<div>
					<h2>Katalog Stok Produk Daur Ulang</h2>
					<p>Atur stok etalase warga, harga tunai, dan ketersediaan kuota voucher poin.</p>
				</div>
				<label class="stock-search">
					<Icon name="search" size={14} />
					<input bind:value={stockQuery} placeholder="Cari nama produk..." />
				</label>
			</div>

			<div class="stock-list">
				{#each stock as s}
					<div class="stock-item">
						<img src={s.image} alt="" width="56" height="56" />
						<div class="si-main">
							<b>{s.name}</b>
							<span>{s.sub}</span>
						</div>
						<div class="si-price"><b>{s.price}</b><span>atau {s.points}</span></div>
						<span class="si-stock" class:low={s.low}><i></i>{s.stock}</span>
						<div class="si-actions">
							<button onclick={() => store.notify(`Edit stok ${s.name} dibuka.`)}>Edit Stok</button>
							<button class="gear" aria-label="Pengaturan produk" onclick={() => store.notify('Pengaturan produk dibuka.')}><Icon name="settings" size={13} /></button>
						</div>
					</div>
				{/each}
			</div>

			<div class="stock-foot">
				<span>Menampilkan {stock.length} dari 18 produk daur ulang aktif</span>
				<a href="/toko">Kelola Semua Produk di Gudang <Icon name="arrow-right" size={12} /></a>
			</div>
		</section>
	</main>

	<AppFooter />
</div>

<style>
	.seller {
		background: var(--app-bg);
		color: var(--app-ink);
		font-family: var(--font-ui);
	}

	.main {
		padding-top: 16px;
		padding-bottom: 40px;
	}

	/* merchant */
	.merchant {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		padding: 15px 18px;
		box-shadow: var(--shadow-xs);
		flex-wrap: wrap;
	}

	.m-left {
		display: flex;
		gap: 11px;
	}

	.store-avatar {
		width: 50px;
		height: 50px;
		border-radius: 13px;
		background: var(--app-surface-2);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		flex: none;
		border: 1px solid var(--app-line);
	}

	.m-name {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-wrap: wrap;
	}

	.m-name h1 {
		font-size: 19px;
		letter-spacing: -0.03em;
	}

	.binaan {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: #0c7a46;
		background: var(--app-success-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.m-meta {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-top: 4px;
		font-size: 9px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.rating {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: #b45309;
		font-weight: 600;
	}

	.rating :global(svg) {
		color: #f59e0b;
	}

	.open {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: 5px;
		font-size: 8px;
		font-weight: 600;
		color: #0c7a46;
	}

	.open .dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #10b981;
	}

	.m-actions {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.btn {
		height: 33px;
		padding: 0 11px;
		border-radius: 7px;
		font-size: 9.5px;
	}

	.ghost {
		background: transparent;
		border: 1px solid var(--app-line);
		color: var(--app-body);
	}

	.primary {
		background: var(--app-primary);
		color: #fff;
	}

	/* orders */
	.orders {
		margin-top: 10px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		overflow: hidden;
		box-shadow: var(--shadow-xs);
	}

	.o-head {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		padding: 14px 16px 8px;
		flex-wrap: wrap;
	}

	.o-title {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.o-title h2 {
		font-size: 15px;
		letter-spacing: -0.025em;
	}

	.new-badge {
		font-size: 7.5px;
		font-weight: 700;
		color: #991b1b;
		background: var(--app-error-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
	}

	.o-head p {
		margin-top: 2px;
		font-size: 9px;
		color: var(--app-muted);
	}

	.o-export {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 27px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: transparent;
		color: var(--app-body);
		font-size: 8px;
		cursor: pointer;
		height: fit-content;
	}

	.tabs {
		display: flex;
		gap: 3px;
		padding: 0 16px 9px;
		flex-wrap: wrap;
	}

	.tabs button {
		height: 27px;
		padding: 0 10px;
		border: 1px solid transparent;
		border-radius: var(--r-pill);
		background: var(--app-surface);
		font-size: 8.5px;
		color: var(--app-muted);
		cursor: pointer;
	}

	.tabs button.on {
		background: var(--app-primary);
		color: #fff;
		font-weight: 600;
	}

	.table-scroll {
		overflow-x: auto;
		border-top: 1px solid var(--app-line);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 1020px;
	}

	th {
		text-align: left;
		padding: 8px 14px;
		background: var(--app-surface);
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--app-muted);
		border-bottom: 1px solid var(--app-line);
	}

	td {
		padding: 9px 14px;
		border-bottom: 1px solid var(--app-line);
		font-size: 8.5px;
		vertical-align: top;
	}

	tbody tr:hover {
		background: var(--app-surface);
	}

	.cell b {
		display: block;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-ink);
	}

	.cell span {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 7.5px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.cell .muted {
		color: #94a3a0;
	}

	.items {
		display: grid;
		gap: 2px;
	}

	.items span {
		font-size: 8px;
		color: var(--app-body);
	}

	.items span::before {
		content: '•';
		color: var(--app-primary);
		margin-right: 4px;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 7.5px;
		font-weight: 600;
		border-radius: var(--r-pill);
		padding: 4px 8px;
		white-space: nowrap;
	}

	.status i {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
	}

	.status.danger {
		background: var(--app-error-soft);
		color: #991b1b;
	}

	.status.info {
		background: #e0f2fe;
		color: #0369a1;
	}

	.status.violet {
		background: #ede9fe;
		color: #5b21b6;
	}

	.status.warn {
		background: var(--app-amber-soft);
		color: #92400e;
	}

	.row-actions {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.primary-btn {
		height: 25px;
		padding: 0 8px;
		border: 0;
		border-radius: 5px;
		background: var(--app-primary);
		color: #fff;
		font-size: 7.5px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}

	.icon-btn {
		width: 25px;
		height: 25px;
		border: 1px solid var(--app-line);
		border-radius: 5px;
		background: var(--app-card);
		color: var(--app-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
	}

	.fleet-banner {
		display: flex;
		align-items: center;
		gap: 9px;
		margin: 10px;
		background: var(--app-surface-2);
		border: 1px solid var(--app-line);
		border-radius: 9px;
		padding: 10px 11px;
		flex-wrap: wrap;
	}

	.fleet-icon {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--app-card);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		flex: none;
	}

	.fleet-banner > div {
		flex: 1;
		min-width: 220px;
	}

	.fleet-banner b {
		display: block;
		font-size: 9px;
	}

	.fleet-banner span:not(.fleet-icon) {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.fleet-banner button {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 27px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-card);
		color: var(--app-primary);
		font-size: 8px;
		font-weight: 600;
		cursor: pointer;
	}

	/* kpis */
	.kpis {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 9px;
		margin-top: 10px;
	}

	.kpi {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 12px 13px;
	}

	.kpi-top {
		display: flex;
		justify-content: space-between;
		gap: 6px;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	.kpi-icon {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: var(--app-surface-2);
		color: var(--app-primary);
		display: grid;
		place-items: center;
		flex: none;
	}

	.kpi-value {
		margin-top: 7px;
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.kpi-trend {
		margin-top: 4px;
		font-size: 8px;
		font-weight: 600;
		color: #0c7a46;
	}

	.kpi-sub {
		margin-top: 3px;
		font-size: 7.5px;
		color: var(--app-muted);
	}

	/* split */
	.split {
		display: grid;
		grid-template-columns: 1.25fr 0.75fr;
		gap: 9px;
		margin-top: 10px;
	}

	.revenue,
	.audit {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 13px 14px;
	}

	.sec-top {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.sec-top h3 {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.sec-top p {
		margin-top: 2px;
		font-size: 7.5px;
		color: var(--app-muted);
		max-width: 420px;
	}

	.legend {
		display: flex;
		gap: 9px;
		font-size: 7.5px;
		color: var(--app-muted);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.legend i {
		width: 6px;
		height: 6px;
		border-radius: 2px;
	}

	.legend .teal {
		background: var(--app-primary);
	}

	.legend .mint {
		background: var(--app-primary-soft);
	}

	.chart {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 150px;
		margin-top: 14px;
		padding: 0 8px;
		border-bottom: 1px solid var(--app-line);
	}

	.col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		justify-content: flex-end;
		gap: 4px;
	}

	.bar-track {
		width: 100%;
		height: 120px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 2px;
	}

	.bar {
		width: 34%;
		border-radius: 3px 3px 0 0;
		animation: grow 0.9s var(--ease-out) both;
		transform-origin: bottom;
		transition: height 0.4s var(--ease-spring);
	}

	.bar.cash {
		background: var(--app-primary);
	}

	.bar.points {
		background: var(--app-primary-soft);
	}

	@keyframes grow {
		from { transform: scaleY(0); }
	}

	.col > span {
		font-size: 6.5px;
		color: var(--app-muted);
		white-space: nowrap;
	}

	.chart-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
		flex-wrap: wrap;
	}

	.chart-foot p {
		display: flex;
		align-items: flex-start;
		gap: 4px;
		font-size: 7.5px;
		color: var(--app-muted);
		max-width: 380px;
	}

	.chart-foot p :global(svg) {
		flex: none;
		color: var(--app-primary);
		margin-top: 1px;
	}

	.chart-foot button {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 25px;
		padding: 0 8px;
		border: 1px solid var(--app-line);
		border-radius: 5px;
		background: var(--app-surface);
		color: var(--app-primary);
		font-size: 7.5px;
		font-weight: 600;
		cursor: pointer;
	}

	.tier {
		font-size: 7px;
		font-weight: 700;
		color: #0c7a46;
		background: var(--app-success-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
		white-space: nowrap;
	}

	.impacts {
		display: grid;
		gap: 11px;
		margin-top: 14px;
	}

	.impact-top {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 8px;
		color: var(--app-body);
	}

	.impact-top b {
		font-size: 7.5px;
		font-weight: 600;
		color: var(--app-muted);
		white-space: nowrap;
	}

	.track {
		height: 5px;
		border-radius: 999px;
		background: var(--app-surface-2);
		margin-top: 4px;
		overflow: hidden;
	}

	.track i {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--app-primary), #35c8a8);
		animation: width 1s var(--ease-out) both;
	}

	@keyframes width {
		from { width: 0; }
	}

	.cert {
		display: flex;
		align-items: flex-start;
		gap: 5px;
		margin-top: 13px;
		background: var(--app-surface);
		border-radius: 6px;
		padding: 7px 8px;
		font-size: 7.5px;
		line-height: 1.45;
		color: var(--app-muted);
	}

	.cert :global(svg) {
		flex: none;
		color: var(--app-primary);
		margin-top: 1px;
	}

	/* stock */
	.stock-sec {
		margin-top: 10px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 14px;
	}

	.stock-head {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		align-items: flex-end;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}

	.stock-head h2 {
		font-size: 15px;
		letter-spacing: -0.025em;
	}

	.stock-head p {
		margin-top: 2px;
		font-size: 8px;
		color: var(--app-muted);
	}

	.stock-search {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-bg);
		color: var(--app-muted);
	}

	.stock-search input {
		border: 0;
		background: transparent;
		outline: none;
		font: inherit;
		font-size: 8.5px;
		color: var(--app-ink);
		width: 170px;
	}

	.stock-list {
		display: grid;
		gap: 6px;
	}

	.stock-item {
		display: flex;
		align-items: center;
		gap: 9px;
		border: 1px solid var(--app-line);
		border-radius: 8px;
		background: var(--app-bg);
		padding: 8px;
	}

	.stock-item img {
		width: 48px;
		height: 48px;
		border-radius: 6px;
		object-fit: cover;
	}

	.si-main {
		flex: 1;
		min-width: 0;
	}

	.si-main b {
		display: block;
		font-size: 9.5px;
	}

	.si-main span {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
		margin-top: 1px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.si-price {
		text-align: right;
		min-width: 110px;
	}

	.si-price b {
		display: block;
		font-size: 9.5px;
		color: var(--app-ink);
	}

	.si-price span {
		display: block;
		font-size: 7.5px;
		color: var(--app-primary);
	}

	.si-stock {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 7.5px;
		color: #0c7a46;
		min-width: 120px;
	}

	.si-stock i {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
	}

	.si-stock.low {
		color: #b91c1c;
	}

	.si-actions {
		display: flex;
		gap: 4px;
	}

	.si-actions button {
		height: 25px;
		padding: 0 8px;
		border: 1px solid var(--app-line);
		border-radius: 5px;
		background: var(--app-card);
		color: var(--app-body);
		font-size: 7.5px;
		font-weight: 500;
		cursor: pointer;
	}

	.si-actions .gear {
		width: 25px;
		padding: 0;
		display: grid;
		place-items: center;
	}

	.stock-foot {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		align-items: center;
		margin-top: 9px;
		font-size: 7.5px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.stock-foot a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--app-primary);
		font-weight: 600;
	}

	@media (max-width: 1050px) {
		.kpis {
			grid-template-columns: 1fr 1fr;
		}
		.split {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 700px) {
		.kpis {
			grid-template-columns: 1fr;
		}
		.stock-item {
			flex-wrap: wrap;
		}
		.si-price {
			text-align: left;
		}
	}
</style>
