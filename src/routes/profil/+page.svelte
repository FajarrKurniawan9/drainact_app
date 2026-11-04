<script lang="ts">
	import AppNav from '#lib/components/AppNav.svelte';
	import AppFooter from '#lib/components/AppFooter.svelte';
	import TrackingDialog from '#lib/components/TrackingDialog.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { PROFILE_ORDERS, PROFILE_REPORTS } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';
	import { fmt } from '#lib/motion.ts';

	let tab = $state<'laporan' | 'pesanan'>('laporan');
	let query = $state('');
	let status = $state('semua');

	const reports = $derived(
		PROFILE_REPORTS.filter((r) => {
			const q = query.toLowerCase();
			const matchQ = !q || r.code.toLowerCase().includes(q) || r.loc.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
			const matchS =
				status === 'semua' ||
				(status === 'selesai' && r.status.includes('Selesai')) ||
				(status === 'disposisi' && r.status.includes('Disposisi')) ||
				(status === 'validasi' && r.status.includes('Validasi'));
			return matchQ && matchS;
		})
	);

	const orders = $derived(store.orders.length ? store.orders : PROFILE_ORDERS);

	const stats = [
		{ label: 'Total Laporan Valid', value: '12', unit: 'Laporan', sub: '100% Terverifikasi AI & DLH', icon: 'check-circle' },
		{ label: 'Poin Reward Aktif', value: fmt.num(store.pts), unit: 'Poin', sub: 'Setara Rp 62.500 di Eco-Shop', icon: 'wallet' },
		{ label: 'Aksi Kerja Bakti', value: '3', unit: 'Partisipasi', sub: 'RW 03 Klojen & Sawojajar', icon: 'users' },
		{ label: 'Daur Ulang Terdukung', value: '5', unit: 'Komoditas', sub: '42 kg sampah organik terkelola', icon: 'recycle' }
	];

	function exportPdf() {
		store.notify('Laporan PDF sedang disiapkan dan akan diunduh otomatis.');
	}
</script>

<svelte:head>
	<title>Profil Warga &amp; Portofolio Sipil — DrainAct</title>
</svelte:head>

<div class="profile-page">
	<AppNav active="Profil Saya" />

	<main class="shell-wide main">
		<nav class="crumbs" aria-label="Breadcrumb">
			<a href="/dashboard">Beranda</a><Icon name="chevron-right" size={11} />
			<a href="/profil">Profil Warga</a><Icon name="chevron-right" size={11} />
			<span>Aktivitas &amp; Pesanan</span>
		</nav>

		<div class="page-head">
			<div>
				<div class="title-row">
					<h1>Profil Warga &amp; Portofolio Sipil</h1>
					<span class="id-pill"><Icon name="shield-check" size={12} /> ID: W-MLG-08922</span>
				</div>
				<p>
					Kelola identitas warga, pantau status investigasi laporan drainase, dan lacak pesanan
					produk sirkular Anda secara transparan.
				</p>
			</div>
			<span class="partner"><Icon name="building" size={12} /> Kemitraan DLH Kota Malang</span>
		</div>

		<section class="profile-card">
			<div class="pc-top">
				<div class="identity">
					<div class="avatar-wrap">
						<img src="/img/avatar-budi.webp" alt="Foto Budi Santoso" width="68" height="68" />
						<span class="verified-dot"><Icon name="check" size={10} /></span>
					</div>
					<div class="who">
						<div class="name-row">
							<h2>Budi Santoso</h2>
							<span class="badge dark">Relawan Aktif · Malang</span>
							<span class="badge">Warga RW 03 Kel. Klojen</span>
						</div>
						<div class="meta">
							<span><Icon name="phone" size={12} /> 0812-3456-7890</span>
							<span><Icon name="shield-check" size={12} /> Terverifikasi NIK &amp; SatuData</span>
							<span><Icon name="calendar" size={12} /> Bergabung sejak Maret 2025</span>
						</div>
					</div>
				</div>
				<div class="pc-actions">
					<button class="btn ghost" onclick={() => store.notify('Mode edit profil akan tersedia di versi berikutnya.')}>
						<Icon name="settings" size={13} /> Edit Profil
					</button>
					<a class="btn soft" href="/toko/tukar"><Icon name="shopping-bag" size={13} /> Tukar Poin Eco-Shop</a>
					<button class="btn primary" onclick={() => store.openReport()}><Icon name="plus" size={13} /> Lapor Baru</button>
				</div>
			</div>

			<div class="stat-grid">
				{#each stats as s}
					<div class="stat">
						<div class="stat-top">
							<span>{s.label}</span>
							<span class="stat-icon"><Icon name={s.icon} size={14} /></span>
						</div>
						<div class="stat-value">{s.value} <em>{s.unit}</em></div>
						<div class="stat-sub">{s.sub}</div>
					</div>
				{/each}
			</div>
		</section>

		<div class="tabs-bar">
			<div class="tabs" role="tablist" aria-label="Aktivitas profil">
				<button role="tab" aria-selected={tab === 'laporan'} class:on={tab === 'laporan'} onclick={() => (tab = 'laporan')}>
					Riwayat Laporan Sampah &amp; Drainase <span>12</span>
				</button>
				<button role="tab" aria-selected={tab === 'pesanan'} class:on={tab === 'pesanan'} onclick={() => (tab = 'pesanan')}>
					Tracking Pesanan Daur Ulang <span>{orders.length}</span>
				</button>
			</div>
			<div class="controls">
				<label class="search">
					<Icon name="search" size={14} />
					<input bind:value={query} placeholder="Cari ID Laporan / Jalan..." />
				</label>
				<select class="filter" bind:value={status} aria-label="Filter status">
					<option value="semua">Semua Status Laporan</option>
					<option value="selesai">Selesai Cleaned</option>
					<option value="disposisi">Disposisi DLH</option>
					<option value="validasi">Validasi AI</option>
				</select>
				<button class="btn ghost export" onclick={exportPdf}><Icon name="download" size={13} /> Ekspor PDF</button>
			</div>
		</div>

		{#if tab === 'laporan'}
			<div class="table-card">
				<table>
					<thead>
						<tr>
							<th>ID &amp; Tanggal</th>
							<th>Foto Bukti</th>
							<th>Lokasi &amp; Jenis Sampah</th>
							<th>Skala Volume</th>
							<th>Status Tracker</th>
							<th>Poin</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each reports as r}
							<tr>
								<td>
									<div class="id-cell"><b>{r.code}</b><span>{r.date}</span></div>
								</td>
								<td><img class="thumb" src={r.photo} alt={`Bukti ${r.code}`} width="56" height="44" /></td>
								<td>
									<div class="loc-cell"><b>{r.loc}</b><span>{r.type}</span></div>
								</td>
								<td>
									<div class="vol-cell"><b>{r.volume}</b><span>{r.scale}</span></div>
								</td>
								<td><span class="status {r.tone}"><i></i>{r.status}</span></td>
								<td><span class="points">{r.points}</span></td>
								<td>
									{#if r.status.includes('Disposisi')}
										<button class="row-btn" onclick={() => store.openTracking(orders[0])}>
											<Icon name="map-pin" size={11} /> GPS Armada
										</button>
									{:else}
										<button class="row-link" onclick={() => store.notify(`Detail ${r.code} dibuka.`)}>
											Lihat Detail <Icon name="arrow-right" size={11} />
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="table-foot">
					<span>Menampilkan {reports.length} dari 12 laporan investigasi aktif</span>
					<div class="pager">
						<button disabled><Icon name="chevron-left" size={12} /></button>
						<button class="on">1</button>
						<button>2</button>
						<button>3</button>
						<button><Icon name="chevron-right" size={12} /></button>
					</div>
				</div>
			</div>
		{:else}
			<div class="table-card">
				<table>
					<thead>
						<tr>
							<th>Order ID &amp; Waktu</th>
							<th>Produk Sirkular</th>
							<th>Jumlah</th>
							<th>Poin</th>
							<th>Biaya Tunai</th>
							<th>Status</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each orders as o}
							<tr>
								<td><div class="id-cell"><b>{o.id}</b><span>{o.date}</span></div></td>
								<td>
									<div class="prod-cell">
										<img src={o.image} alt="" width="40" height="40" />
										<div><b>{o.productName}</b><span>{o.courier}</span></div>
									</div>
								</td>
								<td>{o.qty}</td>
								<td><span class="points">{fmt.num(o.points)} Poin</span></td>
								<td>{o.cash ? fmt.rp(o.cash) : 'Rp 0'}</td>
								<td><span class="status" class:success={o.status === 'Selesai'} class:info2={o.status !== 'Selesai'}><i></i>{o.status}</span></td>
								<td>
									<button class="row-btn" onclick={() => store.openTracking(o)}>
										<Icon name="navigation" size={11} /> Lacak
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="table-foot">
					<span>Menampilkan {orders.length} pesanan sirkular Anda</span>
					<div class="pager">
						<button disabled><Icon name="chevron-left" size={12} /></button>
						<button class="on">1</button>
						<button><Icon name="chevron-right" size={12} /></button>
					</div>
				</div>
			</div>
		{/if}
	</main>

	<AppFooter />
	<TrackingDialog />
</div>

<style>
	.profile-page {
		background: var(--app-bg);
		color: var(--app-ink);
		font-family: var(--font-ui);
		min-height: 100vh;
	}

	.main {
		padding-top: 20px;
		padding-bottom: 40px;
	}

	.crumbs {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		color: var(--app-muted);
		margin-bottom: 16px;
	}

	.crumbs a:hover {
		color: var(--app-primary);
	}

	.crumbs span {
		color: var(--app-body);
	}

	.page-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 18px;
		margin-bottom: 16px;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	h1 {
		font-size: clamp(24px, 2.8vw, 32px);
		letter-spacing: -0.04em;
	}

	.id-pill {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 9px;
		font-weight: 700;
		color: var(--app-primary);
		border: 1px solid var(--app-line);
		background: var(--app-card);
		border-radius: var(--r-pill);
		padding: 4px 9px;
	}

	.page-head p {
		margin-top: 5px;
		font-size: 11px;
		line-height: 1.6;
		color: var(--app-muted);
		max-width: 620px;
	}

	.partner {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-primary);
		background: var(--app-surface-2);
		border-radius: var(--r-pill);
		padding: 6px 11px;
		white-space: nowrap;
	}

	.profile-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-xl);
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}

	.pc-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 18px;
		flex-wrap: wrap;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--app-line);
	}

	.identity {
		display: flex;
		gap: 13px;
	}

	.avatar-wrap {
		position: relative;
		flex: none;
	}

	.avatar-wrap img {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--app-card);
		box-shadow: 0 0 0 1px var(--app-line);
	}

	.verified-dot {
		position: absolute;
		right: -1px;
		bottom: -1px;
		width: 19px;
		height: 19px;
		border-radius: 50%;
		background: #10b981;
		color: #fff;
		display: grid;
		place-items: center;
		border: 2px solid var(--app-card);
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-wrap: wrap;
	}

	.who h2 {
		font-size: 19px;
		letter-spacing: -0.03em;
	}

	.badge {
		font-size: 8px;
		font-weight: 600;
		color: var(--app-muted);
		background: var(--app-surface);
		border-radius: var(--r-pill);
		padding: 3px 8px;
	}

	.badge.dark {
		background: var(--app-primary);
		color: #fff;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 5px 14px;
		margin-top: 7px;
		font-size: 9px;
		color: var(--app-muted);
	}

	.meta span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.meta :global(svg) {
		color: var(--app-primary);
	}

	.pc-actions {
		display: flex;
		gap: 7px;
		flex-wrap: wrap;
	}

	.btn {
		height: 34px;
		padding: 0 12px;
		border-radius: var(--r-sm);
		font-size: 10px;
	}

	.ghost {
		background: transparent;
		border: 1px solid var(--app-line);
		color: var(--app-body);
	}

	.soft {
		background: var(--app-surface-2);
		color: var(--app-primary);
	}

	.primary {
		background: var(--app-primary);
		color: #fff;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 9px;
		margin-top: 16px;
	}

	.stat {
		background: var(--app-surface);
		border-radius: var(--r-md);
		padding: 12px 13px;
		transition: transform 0.25s var(--ease-spring), background 0.25s;
	}

	.stat:hover {
		transform: translateY(-2px);
		background: var(--app-surface-2);
	}

	.stat-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	.stat-icon {
		width: 24px;
		height: 24px;
		border-radius: 7px;
		background: var(--app-card);
		color: var(--app-primary);
		display: grid;
		place-items: center;
	}

	.stat-value {
		margin-top: 7px;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.stat-value em {
		font-style: normal;
		font-size: 9px;
		font-weight: 600;
		color: var(--app-primary);
	}

	.stat-sub {
		margin-top: 4px;
		font-size: 8px;
		color: var(--app-muted);
	}

	.tabs-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin: 18px 0 10px;
		flex-wrap: wrap;
	}

	.tabs {
		display: flex;
		gap: 4px;
		background: var(--app-surface);
		border: 1px solid var(--app-line);
		border-radius: 9px;
		padding: 3px;
	}

	.tabs button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 11px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		font-size: 9.5px;
		font-weight: 500;
		color: var(--app-muted);
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.18s, color 0.18s;
	}

	.tabs button span {
		font-size: 7.5px;
		font-weight: 700;
		background: color-mix(in srgb, var(--app-ink) 8%, transparent);
		border-radius: var(--r-pill);
		padding: 1px 5px;
	}

	.tabs button.on {
		background: var(--app-primary);
		color: #fff;
		font-weight: 600;
	}

	.tabs button.on span {
		background: rgba(255, 255, 255, 0.2);
	}

	.controls {
		display: flex;
		gap: 6px;
		align-items: center;
		flex-wrap: wrap;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 32px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 7px;
		background: var(--app-card);
		color: var(--app-muted);
	}

	.search input {
		border: 0;
		background: transparent;
		outline: none;
		font: inherit;
		font-size: 9.5px;
		color: var(--app-ink);
		width: 150px;
	}

	.filter {
		height: 32px;
		border: 1px solid var(--app-line);
		border-radius: 7px;
		background: var(--app-card);
		font-family: var(--font-ui);
		font-size: 9.5px;
		color: var(--app-body);
		padding: 0 8px;
	}

	.export {
		height: 32px;
		font-size: 9.5px;
	}

	.table-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-lg);
		overflow: hidden;
		box-shadow: var(--shadow-xs);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 9px 13px;
		font-size: 7.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--app-muted);
		background: var(--app-surface);
		border-bottom: 1px solid var(--app-line);
	}

	td {
		padding: 9px 13px;
		border-bottom: 1px solid var(--app-line);
		font-size: 9px;
		color: var(--app-body);
		vertical-align: middle;
	}

	tbody tr {
		transition: background 0.15s;
	}

	tbody tr:hover {
		background: var(--app-surface);
	}

	.id-cell b,
	.loc-cell b,
	.vol-cell b {
		display: block;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--app-ink);
	}

	.id-cell span,
	.loc-cell span,
	.vol-cell span {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.thumb {
		width: 52px;
		height: 40px;
		border-radius: 6px;
		object-fit: cover;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 8px;
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

	.status.success {
		background: var(--app-success-soft);
		color: #065f46;
	}

	.status.info {
		background: #e0f2fe;
		color: #0369a1;
	}

	.status.info2 {
		background: #e0f2fe;
		color: #0369a1;
	}

	.status.warn {
		background: var(--app-amber-soft);
		color: #92400e;
	}

	.points {
		font-size: 9px;
		font-weight: 700;
		color: var(--app-primary);
		white-space: nowrap;
	}

	.row-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 26px;
		padding: 0 8px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-surface);
		color: var(--app-primary);
		font-size: 8px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}

	.row-btn:hover {
		background: var(--app-surface-2);
	}

	.row-link {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border: 0;
		background: transparent;
		color: var(--app-primary);
		font-size: 8px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}

	.row-link:hover {
		gap: 6px;
	}

	.prod-cell {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.prod-cell img {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		object-fit: cover;
	}

	.prod-cell b {
		display: block;
		font-size: 9px;
	}

	.prod-cell span {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
	}

	.table-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 10px 13px;
		font-size: 8.5px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.pager {
		display: flex;
		gap: 3px;
	}

	.pager button {
		min-width: 26px;
		height: 26px;
		border: 1px solid var(--app-line);
		border-radius: 5px;
		background: transparent;
		font-size: 8.5px;
		color: var(--app-muted);
		cursor: pointer;
		display: grid;
		place-items: center;
	}

	.pager button.on {
		background: var(--app-primary);
		border-color: var(--app-primary);
		color: #fff;
	}

	.pager button:disabled {
		opacity: 0.4;
	}

	@media (max-width: 1000px) {
		.stat-grid {
			grid-template-columns: 1fr 1fr;
		}
		.pc-top {
			flex-direction: column;
		}
		.table-card {
			overflow-x: auto;
		}
		table {
			min-width: 860px;
		}
	}

	@media (max-width: 600px) {
		.stat-grid {
			grid-template-columns: 1fr;
		}
		.pc-actions {
			width: 100%;
			flex-direction: column;
		}
		.pc-actions .btn {
			width: 100%;
			justify-content: center;
		}
		.tabs {
			overflow-x: auto;
			width: 100%;
		}
		.controls {
			width: 100%;
		}
		.search {
			flex: 1;
		}
		.search input {
			width: 100%;
		}
	}
</style>
