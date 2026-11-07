<script lang="ts">
	import PublicNav from '#lib/components/PublicNav.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import TrackingDialog from '#lib/components/TrackingDialog.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { PRODUCTS } from '#lib/data.ts';
	import { fmt, reveal } from '#lib/motion.ts';
	import { store } from '#lib/store.svelte.ts';
	import type { Product } from '#lib/types.ts';

	let query = $state('');
	let category = $state('Semua Komoditas');
	let sort = $state('populer');
	let selected = $state<Product | null>(null);
	let delivery = $state<'kirim' | 'ambil'>('kirim');

	const categories = ['Semua Komoditas', 'Alat Olahan Pest', 'Kompos & Pupuk Organik', 'Paving & Kerajinan Suroja'];

	const filtered = $derived(
		PRODUCTS.filter((p) => {
			const q = query.toLowerCase();
			const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
			const matchC =
				category === 'Semua Komoditas' ||
				p.category === category ||
				(category === 'Alat Olahan Pest' && p.category === 'Pertanian Kota');
			return matchQ && matchC;
		}).sort((a, b) => (sort === 'murah' ? a.points - b.points : sort === 'mahal' ? b.points - a.points : a.id - b.id))
	);

	function openRedeem(p: Product) {
		selected = p;
		delivery = 'kirim';
	}

	function confirmRedeem() {
		if (!selected) return;
		if (store.redeem(selected.id)) {
			selected = null;
			store.notify('Penukaran berhasil. Kurir Pasukan Kuning sedang memproses pengiriman.');
			const latest = store.orders[0];
			if (latest) store.openTracking(latest);
		}
	}
</script>

<svelte:head>
	<title>Tukar Poin Warga — DrainAct Eco-Shop</title>
</svelte:head>

<div class="tukar">
	<PublicNav variant="shop" active="Eco-Shop" />

	<div class="crumbs-bar">
		<div class="shell-wide crumbs-inner">
			<nav class="crumbs" aria-label="Breadcrumb">
				<a href="/">Beranda</a><Icon name="chevron-right" size={11} />
				<a href="/toko">Eco-Shop Warga</a><Icon name="chevron-right" size={11} />
				<span>Tukar Poin Ulang Warga</span>
			</nav>
			<span class="cert"><Icon name="recycle" size={12} /> Sertifikasi Pusat Daur Ulang Malang · ID: 391-SK</span>
		</div>
	</div>

	<main class="shell-wide main">
		<div class="hero-grid">
			<!-- wallet -->
			<section class="wallet" use:reveal>
				<div class="w-head">
					<span>Dompet Pengurasan Warga</span>
					<button onclick={() => store.notify('Riwayat kontribusi dibuka di halaman profil.')}>Riwayat Kontribusi <Icon name="arrow-up-right" size={11} /></button>
				</div>
				<div class="balance">
					<b>{fmt.num(store.pts)}</b>
					<span>Poin DrainAct</span>
				</div>
				<p class="valuation"><Icon name="recycle" size={12} /> Valuasi Insentif Kasar: <b>{fmt.rp(store.pts * 50)}</b> di Eco-Shop</p>
				<div class="w-stats">
					<div><b>12</b><span>laporan tuntas</span></div>
					<div><b>42 kg</b><span>sampah terkelola</span></div>
					<div><b>Level 2</b><span>Pahlawan Lokal</span></div>
				</div>
				<button class="w-btn" onclick={() => store.openReport()}><Icon name="plus" size={14} /> Laporkan Sampah Baru</button>
				<div class="w-glow"></div>
			</section>

			<!-- store info -->
			<section class="store" use:reveal={{ delay: 60 }}>
				<div class="s-head">
					<div>
						<h1>Toko Daur Ulang Warga</h1>
						<p>Lakukan akumulasi kontribusi lingkungan anda dengan produk daur ulang ekonomi.</p>
					</div>
					<span class="s-badge"><Icon name="recycle" size={12} /> Mall Ekonomi Hijau Malang</span>
				</div>

				<label class="search">
					<Icon name="search" size={15} />
					<input bind:value={query} placeholder="Cari komoditas malang, pot sabut kelapa, paving blok plastik, voucher sembako..." />
				</label>

				<div class="chips">
					{#each categories as c}
						<button class:on={category === c} onclick={() => (category = c)}>
							{c}{c === 'Semua Komoditas' ? ' (12)' : ''}
						</button>
					{/each}
				</div>

				<div class="alert">
					<Icon name="info" size={13} />
					<span><b>INFO PUSAT RECYCLE DAUR SAMPAH:</b> Komoditas bervariasi sangat tergantung pasokan pemilahan sampah malang. <a href="/hub#tentang">syarat &amp; ketentuan</a></span>
				</div>
			</section>
		</div>

		<!-- catalog -->
		<section class="catalog">
			<div class="cat-head">
				<div>
					<h2>Katalog Produk &amp; Voucher Daur Ulang</h2>
					<p>Pilih komoditas virtual hasil reduksi sampah warga sekitar.</p>
				</div>
				<div class="cat-tools">
					<select bind:value={sort} aria-label="Urutkan produk">
						<option value="populer">Urutkan</option>
						<option value="murah">Poin terendah</option>
						<option value="mahal">Poin tertinggi</option>
					</select>
					<select aria-label="Peta kecamatan">
						<option>Peta Kecamatan</option>
						<option>Klojen</option>
						<option>Lowokwaru</option>
						<option>Sukun</option>
					</select>
				</div>
			</div>

			<div class="grid">
				{#each filtered as p, i}
					<article class="card" use:reveal={{ delay: (i % 3) * 60 }}>
						<div class="card-media">
							<img src={p.image} alt={p.name} width="640" height="520" loading="lazy" />
							<span class="cat-tag">{p.category}</span>
						</div>
						<div class="card-body">
							<h3>{p.name}</h3>
							<p>{p.description}</p>
							<div class="pricing">
								<b>{fmt.num(p.points)} Poin</b>
								<span>Setara {fmt.rp(p.points * 100)}</span>
							</div>
							<div class="stock"><span class="dot"></span> {p.stock}</div>
							<button class="redeem" onclick={() => openRedeem(p)}>Tukar Poin</button>
						</div>
					</article>
				{/each}
			</div>

			{#if !filtered.length}
				<p class="empty">Tidak ada komoditas yang cocok. Coba kata kunci lain.</p>
			{/if}
		</section>

		<!-- impact banner -->
		<section class="impact" use:reveal>
			<div class="impact-icon"><Icon name="recycle" size={22} /></div>
			<div class="impact-copy">
				<h3>Misi Sirkularitas Kota Malang</h3>
				<p>Logam sampah di saluran · Titik kumpul sampah 3R · Daur ulang pemilih penikmat ke masyarakat</p>
			</div>
			<div class="impact-metric"><span>Lebih dekat</span><b>77%</b><span>ke target</span></div>
			<button onclick={() => store.notify('Misi lokal dibuka: 12 program sirkular aktif.')}>Kunjungi Misi Lokal <Icon name="arrow-right" size={12} /></button>
		</section>
	</main>

	<PublicFooter />
</div>

<!-- redeem modal -->
{#if selected}
	<div class="modal-scrim">
		<button class="scrim-close" type="button" aria-label="Tutup konfirmasi" onclick={() => (selected = null)}></button>
		<div class="modal" role="dialog" aria-modal="true" aria-label="Konfirmasi penukaran poin" tabindex="-1">
			<header class="m-head">
				<div class="m-title">
					<span class="m-icon"><Icon name="recycle" size={16} /></span>
					<div>
						<span class="m-eyebrow">Sirkularitas Warga DrainAct</span>
						<h2>Konfirmasi Penukaran Poin</h2>
						<p>Tukar poin partisipasi Anda dengan komoditas sirkular UMKM.</p>
					</div>
				</div>
				<button class="m-close" onclick={() => (selected = null)} aria-label="Tutup"><Icon name="x" size={15} /></button>
			</header>

			<div class="m-body">
				<div class="product-box">
					<img src={selected.image} alt="" width="86" height="72" />
					<div>
						<span class="seller">{selected.seller}</span>
						<b>{selected.name}</b>
						<span class="meta"><span class="dot"></span> {selected.stock} · Berat Bersih: {selected.unit}</span>
					</div>
				</div>

				<div class="breakdown">
					<div><span>Total Poin Anda Saat Ini</span><b>{fmt.num(store.pts)} Poin</b></div>
					<div><span>— Harga Penukaran {selected.name.split(' ')[0]}</span><b class="minus">-{fmt.num(selected.points)} Poin</b></div>
					<div class="total"><span>Sisa Saldo Poin</span><b>{fmt.num(Math.max(0, store.pts - selected.points))} Poin</b></div>
				</div>
				<div class="saving"><Icon name="leaf" size={12} /> Ekuivalen Insentif: Hemat pengeluaran {fmt.rp(selected.points * 100)}</div>

				<div class="delivery">
					<h3>Pilihan Pengambilan &amp; Pengiriman</h3>
					<button class:on={delivery === 'kirim'} onclick={() => (delivery = 'kirim')}>
						<span class="radio"><i></i></span>
						<div>
							<b>Kirim ke Alamat Saya (Kurir Pasukan Kuning / Express)</b>
							<span class="free">Gratis Ongkir</span>
							<span>Jl. Sawojajar No. 12, Kedungkandang, Kota Malang (Sesuai profil KTP)</span>
						</div>
					</button>
					<button class:on={delivery === 'ambil'} onclick={() => (delivery = 'ambil')}>
						<span class="radio"><i></i></span>
						<div>
							<b>Ambil Sendiri di Posko TPST / Toko UMKM Sawojajar</b>
							<span>Jam operasional: Senin – Sabtu 08.00 - 15.00 WIB</span>
						</div>
					</button>
				</div>

				<p class="secure"><Icon name="shield-check" size={12} /> Terproteksi SPBE Kota Malang · Resi digital akan diterbitkan otomatis ke nomor WhatsApp &amp; akun portal Anda.</p>
			</div>

			<footer class="m-foot">
				<button class="cancel" onclick={() => (selected = null)}>Batal</button>
				<button class="confirm" onclick={confirmRedeem}><Icon name="check" size={14} /> Konfirmasi &amp; Tukar {fmt.num(selected.points)} Poin</button>
			</footer>
		</div>
	</div>
{/if}

<TrackingDialog />

<style>
	.tukar {
		background: var(--pub-bg);
		color: var(--pub-ink);
		font-family: var(--font-ui);
	}

	.crumbs-bar {
		background: var(--pub-bg-soft);
		border-bottom: 1px solid var(--pub-line);
	}

	.crumbs-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
		padding-top: 9px;
		padding-bottom: 9px;
		flex-wrap: wrap;
	}

	.crumbs {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		color: var(--pub-muted);
	}

	.crumbs a:hover {
		color: var(--pub-teal);
	}

	.crumbs span {
		color: var(--pub-ink);
		font-weight: 500;
	}

	.cert {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		font-weight: 600;
		color: var(--pub-teal);
	}

	.main {
		padding-top: 18px;
		padding-bottom: 48px;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 380px 1fr;
		gap: 14px;
	}

	/* wallet */
	.wallet {
		position: relative;
		overflow: hidden;
		background: linear-gradient(150deg, #1d5252, #164e4d 55%, #123f3e);
		color: #fff;
		border-radius: 16px;
		padding: 18px 20px;
		display: flex;
		flex-direction: column;
	}

	.w-glow {
		position: absolute;
		width: 300px;
		height: 300px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(165, 240, 239, 0.22), transparent 65%);
		right: -120px;
		top: -120px;
		pointer-events: none;
	}

	.w-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.w-head button {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.8);
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 0;
		text-transform: none;
		padding: 5px 8px;
		cursor: pointer;
	}

	.balance {
		display: flex;
		align-items: baseline;
		gap: 7px;
		margin-top: 18px;
	}

	.balance b {
		font-family: var(--font-display);
		font-size: 38px;
		font-weight: 800;
		letter-spacing: -0.05em;
		line-height: 1;
	}

	.balance span {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
	}

	.valuation {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-top: 7px;
		font-size: 9px;
		color: rgba(255, 255, 255, 0.55);
	}

	.valuation b {
		color: #a7f3d0;
	}

	.w-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		margin-top: 16px;
		padding: 10px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.w-stats > div {
		padding-left: 10px;
		border-left: 1px solid rgba(255, 255, 255, 0.1);
	}

	.w-stats > div:first-child {
		padding-left: 0;
		border-left: 0;
	}

	.w-stats b {
		display: block;
		font-size: 13px;
		font-weight: 700;
	}

	.w-stats span {
		display: block;
		font-size: 7.5px;
		color: rgba(255, 255, 255, 0.45);
		margin-top: 1px;
	}

	.w-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		height: 34px;
		margin-top: 14px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 7px;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.16s, transform 0.2s var(--ease-spring);
	}

	.w-btn:hover {
		background: rgba(255, 255, 255, 0.18);
		transform: translateY(-1px);
	}

	/* store */
	.store {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 16px;
		padding: 18px 20px;
		box-shadow: var(--shadow-xs);
	}

	.s-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 14px;
		flex-wrap: wrap;
	}

	.s-head h1 {
		font-size: clamp(22px, 2.5vw, 29px);
		letter-spacing: -0.04em;
	}

	.s-head p {
		margin-top: 4px;
		font-size: 10.5px;
		color: var(--pub-muted);
		max-width: 480px;
	}

	.s-badge {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 8.5px;
		font-weight: 600;
		color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 8%, transparent);
		border-radius: var(--r-pill);
		padding: 5px 9px;
		white-space: nowrap;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 38px;
		margin-top: 14px;
		padding: 0 11px;
		border: 1px solid var(--pub-line);
		border-radius: 8px;
		background: var(--pub-bg-soft);
		color: var(--pub-muted);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.search:focus-within {
		border-color: var(--pub-teal);
		box-shadow: 0 0 0 3px rgba(44, 122, 122, 0.1);
	}

	.search input {
		border: 0;
		background: transparent;
		outline: none;
		font: inherit;
		font-size: 10.5px;
		color: var(--pub-ink);
		width: 100%;
	}

	.chips {
		display: flex;
		gap: 5px;
		margin-top: 10px;
		flex-wrap: wrap;
	}

	.chips button {
		height: 28px;
		padding: 0 11px;
		border: 1px solid var(--pub-line);
		border-radius: var(--r-pill);
		background: transparent;
		font-size: 9.5px;
		font-weight: 500;
		color: var(--pub-ink-2);
		cursor: pointer;
		transition: background 0.16s, border-color 0.16s, color 0.16s;
	}

	.chips button:hover {
		background: var(--pub-bg-soft);
	}

	.chips button.on {
		background: var(--pub-teal);
		border-color: var(--pub-teal);
		color: #fff;
	}

	.alert {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		margin-top: 11px;
		background: color-mix(in srgb, var(--pub-amber) 9%, transparent);
		border: 1px solid color-mix(in srgb, var(--pub-amber) 25%, transparent);
		border-radius: 7px;
		padding: 8px 10px;
		font-size: 8.5px;
		line-height: 1.5;
		color: #7c4a03;
	}

	.alert :global(svg) {
		flex: none;
		color: #b45309;
		margin-top: 1px;
	}

	.alert a {
		font-weight: 700;
		text-decoration: underline;
	}

	/* catalog */
	.catalog {
		margin-top: 22px;
	}

	.cat-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 14px;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}

	.cat-head h2 {
		font-size: clamp(20px, 2.4vw, 26px);
		letter-spacing: -0.035em;
	}

	.cat-head p {
		margin-top: 3px;
		font-size: 10px;
		color: var(--pub-muted);
	}

	.cat-tools {
		display: flex;
		gap: 6px;
	}

	.cat-tools select {
		height: 32px;
		border: 1px solid var(--pub-line);
		border-radius: 7px;
		background: var(--pub-card);
		font-family: var(--font-ui);
		font-size: 9.5px;
		color: var(--pub-ink-2);
		padding: 0 8px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 11px;
	}

	.card {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 13px;
		overflow: hidden;
		transition: transform 0.28s var(--ease-spring), box-shadow 0.28s, border-color 0.28s;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 36px -26px rgba(12, 12, 12, 0.32);
		border-color: color-mix(in srgb, var(--pub-teal) 25%, var(--pub-line));
	}

	.card-media {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--pub-bg-soft);
	}

	.card-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.55s var(--ease-out);
	}

	.card:hover .card-media img {
		transform: scale(1.04);
	}

	.cat-tag {
		position: absolute;
		left: 9px;
		top: 9px;
		background: color-mix(in srgb, var(--pub-card) 92%, transparent);
		backdrop-filter: blur(8px);
		border-radius: var(--r-pill);
		padding: 4px 8px;
		font-size: 7.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--pub-teal);
	}

	.card-body {
		padding: 13px 14px 14px;
	}

	.card-body h3 {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.35;
	}

	.card-body > p {
		margin-top: 4px;
		font-size: 9px;
		line-height: 1.5;
		color: var(--pub-muted);
		min-height: 27px;
	}

	.pricing {
		display: flex;
		align-items: baseline;
		gap: 7px;
		margin-top: 8px;
	}

	.pricing b {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--pub-teal);
	}

	.pricing span {
		font-size: 8.5px;
		color: var(--pub-muted);
	}

	.stock {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 5px;
		font-size: 8px;
		color: var(--pub-muted);
	}

	.stock .dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #10b981;
	}

	.redeem {
		width: 100%;
		height: 31px;
		margin-top: 10px;
		border: 0;
		border-radius: 6px;
		background: var(--pub-teal);
		color: #fff;
		font-size: 9.5px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.16s, transform 0.18s var(--ease-spring);
	}

	.redeem:hover {
		background: var(--pub-teal-deep);
		transform: translateY(-1px);
	}

	.empty {
		padding: 24px;
		text-align: center;
		font-size: 11px;
		color: var(--pub-muted);
	}

	/* impact */
	.impact {
		display: flex;
		align-items: center;
		gap: 13px;
		margin-top: 18px;
		background: linear-gradient(135deg, #2c7a7a, #235e5e);
		border-radius: 14px;
		padding: 14px 16px;
		color: #fff;
		flex-wrap: wrap;
	}

	.impact-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.12);
		display: grid;
		place-items: center;
		flex: none;
	}

	.impact-copy {
		flex: 1;
		min-width: 220px;
	}

	.impact-copy h3 {
		font-size: 13px;
		color: #fff;
	}

	.impact-copy p {
		margin-top: 2px;
		font-size: 8.5px;
		color: rgba(255, 255, 255, 0.55);
	}

	.impact-metric {
		display: flex;
		align-items: baseline;
		gap: 4px;
	}

	.impact-metric b {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
		color: #a7f3d0;
	}

	.impact-metric span {
		font-size: 8px;
		color: rgba(255, 255, 255, 0.5);
	}

	.impact button {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 32px;
		padding: 0 11px;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 9px;
		font-weight: 600;
		cursor: pointer;
	}

	.impact button:hover {
		background: rgba(255, 255, 255, 0.18);
	}

	/* modal */
	.modal-scrim {
		position: fixed;
		inset: 0;
		z-index: 120;
		background: rgba(15, 23, 42, 0.55);
		backdrop-filter: blur(6px);
		display: grid;
		place-items: center;
		padding: 20px;
		animation: fade 0.24s var(--ease-out);
	}

	.modal {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 640px;
		max-height: 92vh;
		display: flex;
		flex-direction: column;
		background: var(--pub-card);
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 40px 90px -32px rgba(0, 0, 0, 0.5);
		animation: enter 0.4s var(--ease-spring);
	}

	.scrim-close {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: default;
	}

	.m-head {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 18px 20px 12px;
		background: var(--pub-bg-soft);
		border-bottom: 1px solid var(--pub-line);
		flex: none;
	}

	.m-title {
		display: flex;
		gap: 9px;
	}

	.m-icon {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--pub-teal);
		color: #fff;
		display: grid;
		place-items: center;
		flex: none;
	}

	.m-eyebrow {
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pub-teal);
	}

	.m-head h2 {
		font-size: 17px;
		letter-spacing: -0.03em;
		margin-top: 1px;
	}

	.m-head p {
		margin-top: 2px;
		font-size: 9.5px;
		color: var(--pub-muted);
	}

	.m-close {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid var(--pub-line);
		background: transparent;
		color: var(--pub-muted);
		display: grid;
		place-items: center;
		cursor: pointer;
		flex: none;
	}

	.m-body {
		overflow-y: auto;
		padding: 14px 20px;
	}

	.product-box {
		display: flex;
		gap: 11px;
		background: var(--pub-bg-soft);
		border: 1px solid var(--pub-line);
		border-radius: 9px;
		padding: 9px;
	}

	.product-box img {
		width: 78px;
		height: 64px;
		border-radius: 7px;
		object-fit: cover;
	}

	.product-box b {
		display: block;
		font-size: 11px;
		margin-top: 2px;
	}

	.seller {
		display: inline-block;
		font-size: 7px;
		font-weight: 700;
		color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 10%, transparent);
		border-radius: 4px;
		padding: 2px 5px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.product-box .meta {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 8px;
		color: var(--pub-muted);
		margin-top: 3px;
	}

	.product-box .meta .dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #10b981;
	}

	.breakdown {
		display: grid;
		gap: 4px;
		margin-top: 12px;
		padding: 10px 12px;
		border: 1px solid var(--pub-line);
		border-radius: 8px;
	}

	.breakdown div {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--pub-muted);
	}

	.breakdown b {
		color: var(--pub-ink);
	}

	.breakdown .minus {
		color: #b91c1c;
	}

	.breakdown .total {
		border-top: 1px solid var(--pub-line);
		padding-top: 6px;
		margin-top: 3px;
	}

	.breakdown .total b {
		color: var(--pub-teal);
		font-family: var(--font-display);
		font-size: 12px;
		font-weight: 800;
	}

	.saving {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-top: 8px;
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		border-radius: 6px;
		padding: 6px 9px;
		font-size: 8.5px;
		color: #047857;
	}

	.delivery {
		margin-top: 12px;
		display: grid;
		gap: 6px;
	}

	.delivery h3 {
		font-family: var(--font-ui);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0;
		margin-bottom: 2px;
	}

	.delivery button {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		text-align: left;
		border: 1px solid var(--pub-line);
		border-radius: 8px;
		background: transparent;
		padding: 9px 10px;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}

	.delivery button.on {
		border-color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 4%, transparent);
	}

	.radio {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid #b9cfcb;
		display: grid;
		place-items: center;
		flex: none;
		margin-top: 1px;
	}

	.delivery button.on .radio {
		border-color: var(--pub-teal);
	}

	.radio i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--pub-teal);
		opacity: 0;
		transition: opacity 0.15s;
	}

	.delivery button.on .radio i {
		opacity: 1;
	}

	.delivery b {
		display: block;
		font-size: 9.5px;
	}

	.delivery span:not(.radio):not(.free) {
		display: block;
		font-size: 8px;
		color: var(--pub-muted);
		margin-top: 2px;
	}

	.free {
		display: inline-block;
		font-size: 7px;
		font-weight: 700;
		color: #047857;
		background: #d1fae5;
		border-radius: var(--r-pill);
		padding: 2px 5px;
		margin-top: 3px;
	}

	.secure {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-top: 10px;
		font-size: 8px;
		color: var(--pub-muted);
	}

	.m-foot {
		flex: none;
		display: flex;
		justify-content: flex-end;
		gap: 7px;
		padding: 12px 20px 16px;
		border-top: 1px solid var(--pub-line);
		background: var(--pub-card);
	}

	.cancel {
		height: 34px;
		padding: 0 14px;
		border: 1px solid var(--pub-line);
		border-radius: 7px;
		background: transparent;
		color: var(--pub-ink-2);
		font-size: 10px;
		font-weight: 500;
		cursor: pointer;
	}

	.confirm {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 34px;
		padding: 0 14px;
		border: 0;
		border-radius: 7px;
		background: var(--pub-teal);
		color: #fff;
		font-size: 10px;
		font-weight: 600;
		cursor: pointer;
	}

	.confirm:hover {
		background: var(--pub-teal-deep);
	}

	@keyframes fade {
		from { opacity: 0; }
	}

	@keyframes enter {
		from { opacity: 0; transform: translateY(18px) scale(0.97); }
	}

	@media (max-width: 1000px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 600px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.impact-metric {
			margin-left: 0;
		}
	}
</style>
