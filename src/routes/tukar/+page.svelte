<script lang="ts">
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { PRODUCTS } from '#lib/data.ts';
	import { store } from '#lib/store.svelte.ts';
</script>

<svelte:head><title>Tukar Poin - DrainAct</title></svelte:head>

<div class="wrap">
	<div class="flex justify-between items-end mb-5">
		<div>
			<h2 class="font-extrabold text-2xl">Tukar poin</h2>
			<p class="mut">Hasil olahan sampah dari mitra pengolah.</p>
		</div>
		<b class="text-amber-500 text-xl">{store.balanceLabel}</b>
	</div>
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each PRODUCTS as p (p.id)}
			<ProductCard product={p} mode="redeem" onaction={(id) => store.redeem(id)} />
		{/each}
	</div>
</div>
