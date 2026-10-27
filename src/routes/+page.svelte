<script lang="ts">
	import { resolve } from '$app/paths';
	import Heatmap from '#lib/components/Heatmap.svelte';
	import { num } from '#lib/format.ts';
	import { store } from '#lib/store.svelte.ts';

	const stats = $derived([
		{ value: num(store.stats.received), label: 'Laporan masuk' },
		{ value: num(store.stats.cleaned), label: 'Tumpukan diangkut' },
		{ value: store.stats.tons, label: 'Sampah terolah' }
	]);
</script>

<header class="max-w-3xl mx-auto px-4 pt-12 pb-6 text-center">
	<h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
		Ada tumpukan sampah yang mengganggu? Laporkan, kami bantu angkut.
	</h1>
	<p class="mt-5 text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
		Tumpukan di pinggir jalan, lahan kosong, atau dekat rumah yang berbau dan menghalangi jalan.
		Petugas mengangkutnya, kamu dapat poin untuk ditukar kompos dan barang daur ulang.
	</p>
	<div class="flex flex-wrap justify-center gap-3 mt-7">
		<a href={resolve('/lapor')} class="btn px-6 py-3">Lapor tumpukan sampah</a>
		<a href={resolve('/tukar')} class="btn btn-g px-6 py-3">Tukar poin</a>
		<a href={resolve('/toko')} class="btn bg-zinc-700 hover:bg-zinc-800 px-6 py-3">Buka toko</a>
	</div>
	<div class="card grid grid-cols-3 gap-3 max-w-md mx-auto mt-10 !p-4">
		{#each stats as s (s.label)}
			<div>
				<div class="text-xl font-extrabold">{s.value}</div>
				<div class="mut">{s.label}</div>
			</div>
		{/each}
	</div>
</header>

<section class="wrap">
	<Heatmap
		title="Peta panas tumpukan sampah Kota Malang"
		subtitle="Semakin besar dan merah, semakin banyak tumpukan yang belum diangkut."
		heightClass="h-80"
	/>
</section>
