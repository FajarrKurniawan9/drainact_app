<script lang="ts">
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { PRODUCTS } from '#lib/data.ts';
	import { rp } from '#lib/format.ts';
	import { store } from '#lib/store.svelte.ts';
</script>

<svelte:head><title>Toko - DrainAct</title></svelte:head>

<div class="wrap">
	<div class="flex flex-wrap justify-between items-end gap-2 mb-5">
		<div>
			<h2 class="font-extrabold text-2xl">Toko DrainAct</h2>
			<p class="mut">Beli dengan rupiah. Sebagian hasil penjualan membiayai pengangkutan sampah.</p>
		</div>
		<div class="card !py-2 !px-4 text-xs">
			{#if store.cartCount}
				🛒 {store.cartCount} barang · <b>{rp(store.cartTotal)}</b>
				<button class="btn ml-2" onclick={() => store.checkout()}>Bayar</button>
			{:else}
				🛒 Keranjang kosong
			{/if}
		</div>
	</div>
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each PRODUCTS as p (p.id)}
			<ProductCard product={p} mode="buy" onaction={(id) => store.addToCart(id)} />
		{/each}
	</div>
</div>
