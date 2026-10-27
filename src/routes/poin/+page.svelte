<script lang="ts">
	import { resolve } from '$app/paths';
	import { store } from '#lib/store.svelte.ts';
</script>

<svelte:head><title>Poin Saya - DrainAct</title></svelte:head>

<div class="wrap">
	<div class="card flex flex-wrap items-center justify-between gap-4">
		<div>
			<div class="mut">Saldo poin kamu</div>
			<div class="text-4xl font-extrabold text-amber-500">{store.balanceLabel}</div>
		</div>
		<div class="flex gap-2">
			<a href={resolve('/tukar')} class="btn btn-g">Tukar poin</a>
			<a href={resolve('/toko')} class="btn">Beli di toko</a>
		</div>
	</div>
	<div class="grid md:grid-cols-2 gap-4 mt-4">
		<div class="card">
			<h3 class="font-bold text-sm mb-2">Laporan saya</h3>
			<ul class="space-y-2 text-xs">
				{#each store.myReports as r (r.id)}
					<li class="border border-slate-200 dark:border-zinc-800 rounded-lg p-2">
						{r.loc}
						<div class="mut">{r.done ? '✅ Sudah diangkut' : '⏳ Menunggu petugas'}</div>
					</li>
				{:else}
					<li class="mut">Belum ada laporan.</li>
				{/each}
			</ul>
		</div>
		<div class="card">
			<h3 class="font-bold text-sm mb-2">Riwayat poin</h3>
			<ul class="mut space-y-1">
				{#each store.hist as h, i (i)}
					<li>{h}</li>
				{:else}
					<li>Belum ada aktivitas.</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
