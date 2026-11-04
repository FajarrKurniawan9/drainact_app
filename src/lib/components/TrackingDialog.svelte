<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import MapView from '#lib/components/MapView.svelte';
	import { store } from '#lib/store.svelte.ts';
	import { reducedMotion } from '#lib/motion.ts';
	import { fmt } from '#lib/motion.ts';

	let dialog = $state<HTMLDivElement>();
	let closing = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	const order = $derived(store.selectedOrder);

	const steps = $derived.by(() => {
		const o = order;
		if (!o) return [];
		const stage = o.status === 'Diproses' ? 1 : o.status === 'Dikirim' ? 2 : o.status === 'Tiba' ? 3 : 3;
		return [
			{ title: 'Pesanan Dikonfirmasi UMKM', sub: 'Kemasan ramah lingkungan siap', time: '10:15 WIB · Sawojajar', state: stage >= 2 ? 'done' : 'active' },
			{ title: 'Paket Dibawa Kurir', sub: 'Melintasi Koridor Jl. Ijen', time: '11:30 WIB · Menuju Lokasi', state: stage > 2 ? 'done' : stage === 2 ? 'active' : 'todo' },
			{ title: 'Tiba di Alamat Warga', sub: 'Klojen, RW 03', time: o.status === 'Selesai' ? '11:50 WIB · Diterima' : 'Estimasi 11:50 WIB', state: o.status === 'Selesai' ? 'done' : 'todo' }
		];
	});

	function close() {
		if (closing) return;
		closing = true;
		clearTimeout(timer);
		timer = setTimeout(
			() => {
				store.closeTracking();
				closing = false;
			},
			reducedMotion() ? 10 : 220
		);
	}

	function onKey(e: KeyboardEvent) {
		if (!order) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	$effect(() => {
		if (order) {
			closing = false;
			tick().then(() => dialog?.focus());
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	function confirmReceived() {
		if (!order) return;
		order.status = 'Selesai';
		store.notify('Konfirmasi diterima. Terima kasih telah mendukung ekonomi sirkular!');
		close();
	}

	const points = [
		{ x: 20, y: 72, sev: 'kerja' as const, label: 'Hub UMKM Sawojajar', count: 1 },
		{ x: 47, y: 50, sev: 'sedang' as const, label: 'Pak Rahmat · 32 km/jam', count: 1 },
		{ x: 74, y: 34, sev: 'kerja' as const, label: 'Tujuan: Jl. Bandung No. 8', count: 1 }
	];
</script>

<svelte:window onkeydown={onKey} />

{#if order}
	<div class="scrim" class:closing>
		<button class="scrim-close" type="button" aria-label="Tutup tracking" onclick={close}></button>
		<div
			bind:this={dialog}
			class="dialog"
			class:closing
			role="dialog"
			aria-modal="true"
			aria-label={`Detail tracking pesanan ${order.id}`}
			tabindex="-1"
		>
			<header class="d-head">
				<div class="d-title">
					<span class="app-mark">A</span>
					<div>
						<h2>Detail Tracking Pesanan {order.id}</h2>
						<div class="d-meta">
							<span class="status"><span class="dot"></span> {order.status} · Pasukan Kuning DLH Express</span>
							<span>Hub Asal: UMKM Daur Ulang Sawojajar · Menuju: Klojen (Kediaman Warga)</span>
						</div>
					</div>
				</div>
				<button class="close" onclick={close} aria-label="Tutup tracking">
					<Icon name="x" size={17} />
				</button>
			</header>

			<div class="d-body">
				<div class="map-wrap">
					<MapView height={260} points={points} route labels={false}>
						<div class="map-chips">
							<span><Icon name="wifi" size={11} /> Layer Sempadan Air Aktif</span>
							<span><Icon name="sun" size={11} /> Radar Cuaca Cerah (0mm/h)</span>
						</div>
						<div class="map-pin-label hub">Hub UMKM Sawojajar</div>
						<div class="map-pin-label courier">Pak Rahmat (32 km/jam)</div>
						<div class="map-pin-label dest">Tujuan: Jl. Bandung No. 8</div>
						<div class="eta-card">
							<div class="eta-top">
								<span><Icon name="clock" size={13} /> Estimasi Tiba: {order.eta}</span>
								<span class="sync"><span class="dot dot-live"></span> GPS Sync (0.5s)</span>
							</div>
							<div class="courier">
								<span class="courier-avatar">PR</span>
								<div>
									<b>Pak Rahmat Triyono</b>
									<span>{order.courier}</span>
								</div>
								<button><Icon name="message" size={12} /> WhatsApp</button>
							</div>
						</div>
					</MapView>
				</div>

				<div class="stepper">
					{#each steps as s, i}
						<div class="step" class:done={s.state === 'done'} class:active={s.state === 'active'}>
							<span class="node">{#if s.state === 'done'}<Icon name="check" size={10} />{:else}{i + 1}{/if}</span>
							<div><span class="time">{s.time}</span><b>{s.title}</b><span>{s.sub}</span></div>
							{#if i < steps.length - 1}<span class="line" class:filled={s.state === 'done'}></span>{/if}
						</div>
					{/each}
				</div>

				<div class="table-card">
					<div class="tc-head">
						<h3>Rincian Komoditas Sirkular</h3>
						<span>Validasi ID: ECO-REC-8994</span>
					</div>
					<table>
						<thead>
							<tr>
								<th>Produk Ekologis</th>
								<th>Jumlah</th>
								<th>Tukar Poin</th>
								<th>Biaya Tunai</th>
								<th>Status Barang</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<div class="prod">
										<img src={order.image} alt="" width="42" height="42" />
										<div><b>{order.productName}</b><span>Sumber: Reduksi Daun Saluran Drainase Klojen</span></div>
									</div>
								</td>
								<td>{order.qty}</td>
								<td class="points">{fmt.num(order.points)} Poin</td>
								<td>{order.cash ? fmt.rp(order.cash) : 'Rp 0 (Subsidi)'}</td>
								<td><span class="badge">{order.status === 'Selesai' ? 'Diterima' : 'Dalam Pengiriman'}</span></td>
							</tr>
							<tr>
								<td>
									<div class="prod">
										<img src="/img/poin-9.webp" alt="" width="42" height="42" />
										<div><b>Pot Ramah Lingkungan Sabut Kelapa (Medium)</b><span>Pengrajin UMKM Mitra Sub-DAS Brantas</span></div>
									</div>
								</td>
								<td>1 Pcs</td>
								<td class="points">250 Poin</td>
								<td>Rp 0 (Subsidi)</td>
								<td><span class="badge">{order.status === 'Selesai' ? 'Diterima' : 'Dalam Pengiriman'}</span></td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="summary">
					<span class="carbon"><Icon name="leaf" size={13} /> Pengurangan Jejak Karbon Terverifikasi: ~4,2 kg CO₂e</span>
					<div class="totals">
						<div><span>Total Ditukar</span><b>{fmt.num(order.points + 250)} Poin + {fmt.rp(order.cash)}</b></div>
						<div><span>Metode Logistik</span><b>{order.courier.split('·')[0]}</b></div>
					</div>
				</div>

				<p class="secure"><Icon name="lock" size={12} /> Transaksi SPBE Terenkripsi · Resi QR Resmi DLH</p>
			</div>

			<footer class="d-foot">
				<button class="btn ghost" onclick={() => store.notify('Resi PDF sedang disiapkan.')}>
					<Icon name="download" size={14} /> Unduh Resi SPBE (PDF)
				</button>
				<button class="btn primary" onclick={confirmReceived} disabled={order.status === 'Selesai'}>
					<Icon name="check" size={14} /> {order.status === 'Selesai' ? 'Barang Diterima' : 'Konfirmasi Barang Diterima'}
				</button>
			</footer>
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 120;
		background: rgba(8, 22, 20, 0.58);
		backdrop-filter: blur(6px);
		display: grid;
		place-items: center;
		padding: 22px;
		animation: fade 0.25s var(--ease-out);
	}

	.dialog {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1000px;
		max-height: 92vh;
		display: flex;
		flex-direction: column;
		background: var(--app-surface);
		border-radius: 18px;
		box-shadow: 0 44px 100px -36px rgba(0, 0, 0, 0.6);
		overflow: hidden;
		animation: enter 0.4s var(--ease-spring);
		outline: none;
	}

	.scrim.closing {
		animation: fade-out 0.22s var(--ease-out) forwards;
	}

	.dialog.closing {
		animation: exit 0.22s var(--ease-out) forwards;
	}

	.scrim-close {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: default;
	}

	.d-head {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		padding: 18px 22px;
		background: var(--app-card);
		border-bottom: 1px solid var(--app-line);
		flex: none;
	}

	.d-title {
		display: flex;
		gap: 11px;
	}

	.app-mark {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--app-primary);
		color: #fff;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		flex: none;
	}

	.d-head h2 {
		font-size: 17px;
		letter-spacing: -0.025em;
	}

	.d-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		margin-top: 4px;
		font-size: 9.5px;
		color: var(--app-muted);
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: #0c7a46;
		font-weight: 600;
	}

	.status .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #10b981;
	}

	.close {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--app-line);
		background: transparent;
		color: var(--app-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
		flex: none;
		transition: background 0.15s, transform 0.2s var(--ease-spring);
	}

	.close:hover {
		background: var(--app-surface-2);
		transform: rotate(90deg);
	}

	.d-body {
		overflow-y: auto;
		padding: 16px 22px 18px;
		display: grid;
		gap: 14px;
	}

	.map-wrap {
		border-radius: var(--r-md);
		overflow: hidden;
		border: 1px solid #0d2a24;
		position: relative;
	}

	.map-chips {
		position: absolute;
		left: 11px;
		top: 11px;
		z-index: 3;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.map-chips span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: rgba(6, 18, 15, 0.72);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(8px);
		border-radius: 5px;
		padding: 4px 7px;
		font-size: 8px;
		color: rgba(255, 255, 255, 0.72);
		width: fit-content;
	}

	.map-pin-label {
		position: absolute;
		z-index: 3;
		background: var(--app-card);
		color: var(--app-ink);
		font-size: 8.5px;
		font-weight: 600;
		padding: 4px 7px;
		border-radius: 5px;
		box-shadow: var(--shadow-sm);
		white-space: nowrap;
	}

	.map-pin-label.hub {
		left: 11%;
		top: 60%;
	}

	.map-pin-label.courier {
		left: 40%;
		top: 36%;
	}

	.map-pin-label.dest {
		right: 9%;
		top: 24%;
	}

	.eta-card {
		position: absolute;
		left: 12px;
		bottom: 12px;
		z-index: 3;
		width: 300px;
		background: rgba(6, 18, 15, 0.82);
		backdrop-filter: blur(14px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 9px;
		padding: 10px 12px;
		color: #fff;
	}

	.eta-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		font-size: 8.5px;
		color: rgba(255, 255, 255, 0.7);
	}

	.eta-top span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.sync {
		color: #4ade80;
	}

	.sync .dot {
		background: #4ade80;
		color: #4ade80;
	}

	.courier {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 8px;
	}

	.courier-avatar {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--app-primary-soft);
		color: #164e4d;
		font-size: 9px;
		font-weight: 800;
		display: grid;
		place-items: center;
		flex: none;
	}

	.courier b {
		display: block;
		font-size: 9px;
	}

	.courier div span {
		display: block;
		font-size: 7.5px;
		color: rgba(255, 255, 255, 0.42);
	}

	.courier button {
		margin-left: auto;
		height: 24px;
		padding: 0 8px;
		border-radius: var(--r-pill);
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
		color: #4ade80;
		font-size: 7.5px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		cursor: pointer;
	}

	.stepper {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 12px 14px;
	}

	.step {
		position: relative;
		display: flex;
		gap: 7px;
	}

	.node {
		width: 20px;
		height: 20px;
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

	.time {
		display: block;
		font-size: 7.5px;
		color: var(--app-muted);
		margin-bottom: 2px;
	}

	.step b {
		display: block;
		font-size: 9px;
		font-weight: 700;
	}

	.step div span:last-child {
		display: block;
		font-size: 8px;
		color: var(--app-muted);
		margin-top: 1px;
	}

	.line {
		position: absolute;
		top: 9px;
		left: 20px;
		right: -14px;
		height: 1px;
		background: var(--app-line);
		z-index: 1;
	}

	.line.filled {
		background: #10b981;
	}

	.table-card {
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		overflow: hidden;
	}

	.tc-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 11px 14px;
		border-bottom: 1px solid var(--app-line);
	}

	.tc-head h3 {
		font-size: 11px;
		font-weight: 700;
	}

	.tc-head span {
		font-size: 8px;
		color: var(--app-muted);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 9px;
	}

	th {
		text-align: left;
		padding: 8px 14px;
		background: var(--app-surface);
		font-size: 7.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	td {
		padding: 8px 14px;
		border-top: 1px solid var(--app-line);
		color: var(--app-body);
	}

	.prod {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.prod img {
		width: 34px;
		height: 34px;
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
		color: #0c7a46;
		font-weight: 700;
	}

	.badge {
		display: inline-block;
		font-size: 7.5px;
		font-weight: 600;
		color: #0c7a46;
		background: var(--app-success-soft);
		border-radius: var(--r-pill);
		padding: 3px 7px;
		white-space: nowrap;
	}

	.summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		background: var(--app-surface-2);
		border: 1px solid var(--app-line);
		border-radius: var(--r-md);
		padding: 11px 14px;
	}

	.carbon {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 8.5px;
		font-weight: 600;
		color: #0c7a46;
	}

	.totals {
		display: flex;
		gap: 22px;
	}

	.totals span {
		display: block;
		font-size: 7px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--app-muted);
	}

	.totals b {
		display: block;
		font-size: 10px;
		font-weight: 700;
		color: var(--app-ink);
	}

	.secure {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 8px;
		color: var(--app-muted);
	}

	.d-foot {
		flex: none;
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding: 12px 22px 16px;
		background: var(--app-card);
		border-top: 1px solid var(--app-line);
	}

	.btn {
		height: 36px;
		font-size: 10.5px;
		border-radius: var(--r-sm);
	}

	.ghost {
		background: transparent;
		border: 1px solid var(--app-line);
		color: var(--app-ink);
	}

	.primary {
		background: var(--app-primary);
		color: #fff;
	}

	@keyframes fade {
		from { opacity: 0; }
	}

	@keyframes fade-out {
		to { opacity: 0; }
	}

	@keyframes enter {
		from { opacity: 0; transform: translateY(20px) scale(0.97); }
	}

	@keyframes exit {
		to { opacity: 0; transform: translateY(14px) scale(0.985); }
	}

	@media (max-width: 760px) {
		.scrim {
			padding: 0;
			align-items: flex-end;
		}
		.dialog {
			max-height: 94dvh;
			border-radius: 18px 18px 0 0;
		}
		.stepper {
			grid-template-columns: 1fr;
			gap: 9px;
		}
		.line {
			display: none;
		}
		.table-card {
			overflow-x: auto;
		}
		table {
			min-width: 560px;
		}
		.eta-card {
			width: 240px;
		}
	}
</style>
