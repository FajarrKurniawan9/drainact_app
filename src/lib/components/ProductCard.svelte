<script lang="ts">
	import { rp } from '#lib/format.ts';
	import type { Product } from '#lib/types.ts';

	let {
		product,
		mode,
		onaction
	}: { product: Product; mode: 'redeem' | 'buy'; onaction: (id: number) => void } = $props();
</script>

<div class="card">
	<div
		class="h-24 grid place-items-center text-5xl rounded-lg bg-slate-100 dark:bg-zinc-950 mb-3"
		aria-hidden="true"
	>
		{product.emoji}
	</div>
	<h3 class="font-bold text-sm">{product.name}</h3>
	<p class="mut my-1">{product.description}</p>
	<div class="flex justify-between items-center mt-3">
		{#if mode === 'redeem'}
			<b class="text-amber-500 text-xs">{product.points} poin</b>
			<button class="btn btn-g" onclick={() => onaction(product.id)}>Tukar</button>
		{:else}
			<b class="text-xs">{rp(product.price)}</b>
			<button class="btn" onclick={() => onaction(product.id)}>Tambah</button>
		{/if}
	</div>
</div>
