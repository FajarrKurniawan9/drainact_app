<script lang="ts">
	import PublicNav from '#lib/components/PublicNav.svelte';
	import PublicFooter from '#lib/components/PublicFooter.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/motion.ts';
	import { ECO_PRODUCTS, PUBLIC_TESTIMONIALS } from '#lib/content.ts';
	import { store } from '#lib/store.svelte.ts';

	let rail: HTMLDivElement;
	let bag = $state(0);
	const arrivals = ECO_PRODUCTS.slice(0, 4);
	const topSelling = ECO_PRODUCTS.slice(4, 8);

	function add(id: number, name: string) {
		bag++;
		store.notify(`${name} ditambahkan ke tas. Lanjutkan di kasir mitra.`);
	}

	function scrollRail(dir: number) {
		rail?.scrollBy({ left: dir * 340, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Eco-Shop — DrainAct</title>
	<meta name="description" content="Eco-Shop DrainAct: merchandise daur ulang dan produk sirkular warga Malang. Setiap pembelian membiayai pengangkutan sampah." />
</svelte:head>

<div class="shop">
	<PublicNav variant="shop" active="Eco-Shop" />

	<!-- promise strip -->
	<div class="promise">
		<div class="shell-wide promise-inner">
			<span><Icon name="recycle" size={12} /> 100% hasil daur ulang</span>
			<span><Icon name="truck" size={12} /> Kurir hijau Kota Malang</span>
			<span><Icon name="shield-check" size={12} /> Transaksi aman SPBE</span>
			<span class="right"><Icon name="sparkles" size={12} /> Setiap pembelian = 1 kg sampah terangkat</span>
		</div>
	</div>

	<!-- new arrivals -->
	<section class="section">
		<div class="shell-wide">
			<header class="sec-head" use:reveal>
				<h2>NEW ARRIVALS</h2>
			</header>

			<div class="grid">
				{#each arrivals as p, i}
					<article class="product" use:reveal={{ delay: i * 60 }}>
						<button class="media" onclick={() => add(p.id, p.name)} aria-label={`Tambah ${p.name} ke keranjang`}>
							<img src={p.image} alt={p.name} width="700" height="700" loading="lazy" />
							{#if p.discount}<span class="discount">-{p.discount}%</span>{/if}
							<span class="quick"><Icon name="plus" size={14} /> Tambah</span>
						</button>
						<div class="p-body">
							<h3>{p.name}</h3>
							<div class="rating">
								<span class="stars">
									{#each { length: 5 } as _, si}
										<Icon name="star" size={11} fill={si < Math.round(p.rating)} class={si < Math.round(p.rating) ? '' : 'dim'} />
									{/each}
								</span>
								<span>{p.rating.toFixed(1)}/<b>5</b></span>
							</div>
							<div class="price-row">
								<b>${p.price}</b>
								{#if p.compareAt}<s>${p.compareAt}</s>{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>

			<div class="center-cta">
				<button class="pill" onclick={() => store.notify('Katalog lengkap berisi 148 produk sirkular.')}>View All</button>
			</div>
		</div>
	</section>

	<!-- top selling -->
	<section class="section top" id="top-selling">
		<div class="shell-wide">
			<header class="sec-head" use:reveal>
				<h2>TOP SELLING</h2>
			</header>

			<div class="grid">
				{#each topSelling as p, i}
					<article class="product" use:reveal={{ delay: i * 60 }}>
						<button class="media" onclick={() => add(p.id, p.name)} aria-label={`Tambah ${p.name} ke keranjang`}>
							<img src={p.image} alt={p.name} width="700" height="700" loading="lazy" />
							{#if p.discount}<span class="discount">-{p.discount}%</span>{/if}
							<span class="quick"><Icon name="plus" size={14} /> Tambah</span>
						</button>
						<div class="p-body">
							<h3>{p.name}</h3>
							<div class="rating">
								<span class="stars">
									{#each { length: 5 } as _, si}
										<Icon name="star" size={11} fill={si < Math.round(p.rating)} class={si < Math.round(p.rating) ? '' : 'dim'} />
									{/each}
								</span>
								<span>{p.rating.toFixed(1)}/<b>5</b></span>
							</div>
							<div class="price-row">
								<b>${p.price}</b>
								{#if p.compareAt}<s>${p.compareAt}</s>{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>

			<div class="center-cta">
				<button class="pill" onclick={() => store.notify('Menampilkan 24 produk terlaris bulan ini.')}>View All</button>
			</div>
		</div>
	</section>

	<!-- reviews -->
	<section class="section reviews" id="reviews">
		<div class="shell-wide">
			<header class="sec-head" use:reveal>
				<div>
					<h2>OUR HAPPY CUSTOMERS</h2>
					<p class="sec-sub">Cerita warga yang sudah memakai produk sirkular DrainAct.</p>
				</div>
				<div class="arrows">
					<button onclick={() => scrollRail(-1)} aria-label="Ulasan sebelumnya"><Icon name="chevron-left" size={16} /></button>
					<button onclick={() => scrollRail(1)} aria-label="Ulasan berikutnya"><Icon name="chevron-right" size={16} /></button>
				</div>
			</header>

			<div class="review-rail" bind:this={rail}>
				{#each PUBLIC_TESTIMONIALS as t, i}
					<article class="review" use:reveal={{ delay: i * 50 }}>
						<div class="review-stars">
							{#each { length: 5 } as _}<Icon name="star" size={14} fill />{/each}
						</div>
						<div class="review-name">
							<b>{t.name}</b>
							<span class="verified"><Icon name="check-circle" size={12} /></span>
						</div>
						<p>“{t.text}”</p>
						<span class="review-role">{t.role}</span>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- cart floating -->
	{#if bag}
		<button class="cart-fab" onclick={() => store.notify(`Tas berisi ${bag} item. Pembayaran tunai dilakukan di kasir mitra Eco-Shop.`)}>
			<Icon name="shopping-bag" size={16} />
			<span>{bag}</span>
			Tas Belanja
		</button>
	{/if}

	<PublicFooter />
</div>

<style>
	.shop {
		background: var(--pub-bg);
		color: var(--pub-ink);
		font-family: var(--font-ui);
	}

	.promise {
		background: var(--pub-bg-soft);
		border-bottom: 1px solid var(--pub-line);
	}

	.promise-inner {
		display: flex;
		align-items: center;
		gap: 22px;
		padding-top: 9px;
		padding-bottom: 9px;
		font-size: 10px;
		color: var(--pub-muted);
		flex-wrap: wrap;
	}

	.promise-inner span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.promise-inner :global(svg) {
		color: var(--pub-teal);
	}

	.promise-inner .right {
		margin-left: auto;
		font-weight: 600;
		color: var(--pub-teal);
	}

	.section {
		padding: 54px 0 30px;
	}

	.section.top {
		padding-top: 26px;
	}

	.sec-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 18px;
		margin-bottom: 24px;
	}

	.sec-head h2 {
		font-size: clamp(28px, 3.4vw, 40px);
		font-weight: 800;
		letter-spacing: -0.03em;
		text-transform: uppercase;
		color: var(--pub-ink);
	}

	.sec-sub {
		margin-top: 4px;
		font-size: 11px;
		color: var(--pub-muted);
		text-transform: none;
		letter-spacing: 0;
		font-family: var(--font-ui);
		font-weight: 400;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;
	}

	.product {
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 16px;
		overflow: hidden;
		transition: transform 0.3s var(--ease-spring), box-shadow 0.3s, border-color 0.3s;
	}

	.product:hover {
		transform: translateY(-5px);
		box-shadow: 0 22px 40px -26px rgba(12, 12, 12, 0.3);
		border-color: color-mix(in srgb, var(--pub-teal) 26%, var(--pub-line));
	}

	.media {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1.08;
		background: #f3f4f6;
		border: 0;
		padding: 0;
		overflow: hidden;
		cursor: pointer;
		display: block;
	}

	:global([data-theme='night']) .media {
		background: #15221f;
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s var(--ease-out);
	}

	.product:hover .media img {
		transform: scale(1.045);
	}

	.discount {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #fee2e2;
		color: #ef4444;
		font-size: 10px;
		font-weight: 700;
		padding: 3px 8px;
		border-radius: var(--r-pill);
	}

	.quick {
		position: absolute;
		left: 50%;
		bottom: 12px;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 34px;
		padding: 0 14px;
		border-radius: var(--r-pill);
		background: color-mix(in srgb, var(--pub-ink) 88%, transparent);
		backdrop-filter: blur(8px);
		color: #fff;
		font-size: 10.5px;
		font-weight: 600;
		opacity: 0;
		transform: translateY(8px);
		transition: opacity 0.22s var(--ease-out), transform 0.3s var(--ease-spring);
		white-space: nowrap;
	}

	.product:hover .quick {
		opacity: 1;
		transform: none;
	}

	.p-body {
		padding: 13px 14px 15px;
	}

	.p-body h3 {
		font-family: var(--font-ui);
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0;
		color: var(--pub-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rating {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 6px;
		font-size: 10px;
		color: var(--pub-muted);
	}

	.stars {
		display: inline-flex;
		gap: 1px;
		color: #ffc633;
	}

	.stars :global(.dim) {
		opacity: 0.25;
	}

	.rating b {
		color: var(--pub-ink);
		font-weight: 500;
	}

	.price-row {
		display: flex;
		align-items: baseline;
		gap: 7px;
		margin-top: 8px;
	}

	.price-row b {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--pub-ink);
	}

	.price-row s {
		font-size: 11px;
		color: var(--pub-muted);
		text-decoration-color: color-mix(in srgb, var(--pub-muted) 60%, transparent);
	}

	.center-cta {
		display: flex;
		justify-content: center;
		margin-top: 26px;
	}

	.pill {
		height: 44px;
		padding: 0 48px;
		border-radius: var(--r-pill);
		border: 1px solid var(--pub-line);
		background: transparent;
		color: var(--pub-ink);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s var(--ease-spring);
	}

	.pill:hover {
		background: var(--pub-ink);
		border-color: var(--pub-ink);
		color: var(--pub-bg-soft);
		transform: translateY(-1px);
	}

	.reviews {
		padding-top: 30px;
		padding-bottom: 60px;
	}

	.arrows {
		display: flex;
		gap: 6px;
	}

	.arrows button {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1px solid var(--pub-line);
		background: var(--pub-card);
		color: var(--pub-ink);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background 0.16s, transform 0.2s var(--ease-spring);
	}

	.arrows button:hover {
		background: var(--pub-ink);
		color: var(--pub-card);
		transform: scale(1.05);
	}

	.review-rail {
		display: flex;
		gap: 14px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 8px;
		scrollbar-width: none;
	}

	.review-rail::-webkit-scrollbar {
		display: none;
	}

	.review {
		flex: 0 0 320px;
		scroll-snap-align: start;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 18px;
		padding: 20px;
		box-shadow: var(--shadow-xs);
	}

	.review-stars {
		display: flex;
		gap: 2px;
		color: #ffc633;
		margin-bottom: 10px;
	}

	.review-name {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.review-name b {
		font-size: 12px;
	}

	.verified {
		color: #10b981;
		display: inline-flex;
	}

	.review p {
		margin-top: 8px;
		font-size: 11px;
		line-height: 1.65;
		color: var(--pub-muted);
	}

	.review-role {
		display: block;
		margin-top: 12px;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--pub-teal);
	}

	.cart-fab {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: 70;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 46px;
		padding: 0 16px;
		border: 0;
		border-radius: var(--r-pill);
		background: var(--pub-ink);
		color: var(--pub-card);
		font-size: 11.5px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 18px 34px -18px rgba(0, 0, 0, 0.5);
		animation: fab-in 0.4s var(--ease-spring);
	}

	.cart-fab span {
		width: 19px;
		height: 19px;
		border-radius: 50%;
		background: var(--pub-green);
		color: #0c2a1a;
		font-size: 9px;
		font-weight: 800;
		display: grid;
		place-items: center;
	}

	@keyframes fab-in {
		from { opacity: 0; transform: translateY(14px) scale(0.9); }
	}

	@media (max-width: 1000px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
		.promise-inner .right {
			margin-left: 0;
		}
	}

	@media (max-width: 560px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.sec-head {
			flex-direction: column;
			align-items: flex-start;
		}
		.review {
			flex-basis: 86vw;
		}
	}
</style>
