<script lang="ts">
	import AppNav from '#lib/components/AppNav.svelte';
	import AppFooter from '#lib/components/AppFooter.svelte';
	import TrackingDialog from '#lib/components/TrackingDialog.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { fmt } from '#lib/motion.ts';
	import { store } from '#lib/store.svelte.ts';

	const orders = $derived(store.orders);
	const active = $derived(orders.filter((o) => o.status !== 'Selesai').length);
	const done = $derived(orders.filter((o) => o.status === 'Selesai').length);
	const points = $derived(orders.reduce((sum, o) => sum + o.points, 0));
</script>

<svelte:head>
	<title>Tracking Pesanan — DrainAct</title>
</svelte:head>

<div class="orders-page">
	<AppNav active="Eco-Shop" />

	<main class="shell-wide main">
		<nav class="crumbs" aria-label="Breadcrumb">
			<a href="/dashboard">Beranda</a><Icon name="chevron-right" size={11} />
			<a href="/toko">Eco-Shop</a><Icon name="chevron-right" size={11} />
			<span>Tracking Pesanan</span>
		</nav>

		<div class="head">
			<div>
				<h1>Tracking Pesanan Daur Ulang</h1>
				<p>Pantau perjalanan komoditas sirkular Anda dari hub UMKM sampai depan pintu.</p>
			</div>
			<a href="/toko/tukar" class="btn primary"><Icon name="plus" size={13} /> Tukar Poin Lagi</a>
		</div>

		<div class="stats">
			<div><span>Total Pesanan</span><b>{orders.length}</b></div>
			<div><span>Dalam Perjalanan</span><b>{active}</b></div>
			<div><span>Selesai</span><b>{done}</b></div>
			<div><span>Poin Digunakan</span><b>{fmt.num(points)}</b></div>
		</div>

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
							<td><div class="cell"><b>{o.id}</b><span>{o.date}</span></div></td>
							<td>
								<div class="prod">
									<img src={o.image} alt="" width="40" height="40" />
									<div><b>{o.productName}</b><span>{o.courier}</span></div>
								</div>
							</td>
							<td>{o.qty}</td>
							<td><b class="points">{fmt.num(o.points)} Poin</b></td>
							<td>{o.cash ? fmt.rp(o.cash) : 'Rp 0'}</td>
							<td><span class="status" class:done={o.status === 'Selesai'}><i></i>{o.status}</span></td>
							<td>
								<button class="track" onclick={() => store.openTracking(o)}>
									<Icon name="navigation" size={11} /> Lacak
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="foot">
				<span>Menampilkan {orders.length} pesanan sirkular Anda</span>
				<a href="/profil">Lihat riwayat laporan <Icon name="arrow-right" size={11} /></a>
			</div>
		</div>

		<div class="info-grid">
			<div class="info"><Icon name="truck" size={16} /><div><b>Kurir Hijau Pasukan Kuning</b><span>Pengiriman memakai motor listrik DLH. Gratis ongkir untuk seluruh Kota Malang.</span></div></div>
			<div class="info"><Icon name="leaf" size={16} /><div><b>Dampak karbon terverifikasi</b><span>Setiap pesanan mencatat pengurangan jejak karbon di resi digital SPBE.</span></div></div>
			<div class="info"><Icon name="shield-check" size={16} /><div><b>Resi digital resmi</b><span>Terintegrasi Satu Data Indonesia dan dapat diunduh dalam format PDF.</span></div></div>
		</div>
	</main>

	<AppFooter />
	<TrackingDialog />
</div>

<style>
	.orders-page {
		background: var(--app-bg);
		color: var(--app-ink);
		font-family: var(--font-ui);
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
		margin-bottom: 14px;
	}

	.crumbs a:hover {
		color: var(--app-primary);
	}

	.crumbs span {
		color: var(--app-body);
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}

	h1 {
		font-size: clamp(24px, 2.8vw, 31px);
		letter-spacing: -0.04em;
	}

	.head p {
		margin-top: 4px;
		font-size: 11px;
		color: var(--app-muted);
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

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 9px;
		margin-bottom: 12px;
	}

	.stats > div {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 11px 13px;
	}

	.stats span {
		display: block;
		font-size: 8px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--app-muted);
	}

	.stats b {
		display: block;
		margin-top: 4px;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
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
		padding: 9px 14px;
		background: var(--app-surface);
		font-size: 7.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--app-muted);
		border-bottom: 1px solid var(--app-line);
	}

	td {
		padding: 10px 14px;
		border-bottom: 1px solid var(--app-line);
		font-size: 9px;
		color: var(--app-body);
	}

	tbody tr:hover {
		background: var(--app-surface);
	}

	.cell b {
		display: block;
		font-size: 9.5px;
		color: var(--app-ink);
	}

	.cell span {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.prod {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.prod img {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		object-fit: cover;
	}

	.prod b {
		display: block;
		font-size: 9px;
		color: var(--app-ink);
	}

	.prod span {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
	}

	.points {
		color: var(--app-primary);
		font-weight: 700;
		white-space: nowrap;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 8px;
		font-weight: 600;
		color: #0369a1;
		background: #e0f2fe;
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

	.status.done {
		color: #065f46;
		background: var(--app-success-soft);
	}

	.track {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 27px;
		padding: 0 9px;
		border: 1px solid var(--app-line);
		border-radius: 6px;
		background: var(--app-surface);
		color: var(--app-primary);
		font-size: 8px;
		font-weight: 600;
		cursor: pointer;
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		font-size: 8.5px;
		color: var(--app-muted);
		flex-wrap: wrap;
	}

	.foot a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--app-primary);
		font-weight: 600;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 9px;
		margin-top: 12px;
	}

	.info {
		display: flex;
		gap: 9px;
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 12px;
	}

	.info > :global(svg) {
		color: var(--app-primary);
		flex: none;
		margin-top: 1px;
	}

	.info b {
		display: block;
		font-size: 9.5px;
	}

	.info span {
		display: block;
		margin-top: 2px;
		font-size: 8px;
		line-height: 1.5;
		color: var(--app-muted);
	}

	@media (max-width: 800px) {
		.stats {
			grid-template-columns: 1fr 1fr;
		}
		.info-grid {
			grid-template-columns: 1fr;
		}
		.table-card {
			overflow-x: auto;
		}
		table {
			min-width: 760px;
		}
	}
</style>
