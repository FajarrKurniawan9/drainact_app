<script lang="ts">
	import { store } from '#lib/store.svelte.ts';
</script>

<svelte:head><title>Riwayat Selesai - DrainAct Petugas</title></svelte:head>

<div class="wrap">
	<div class="card border-amber-300 dark:border-amber-800">
		<h2 class="font-extrabold text-lg mb-3">Riwayat tugas selesai</h2>
		<ul class="space-y-2 text-xs">
			{#each store.doneReports as r (r.id)}
				<li class="border border-slate-200 dark:border-zinc-800 rounded-xl p-3">
					✅ <b>{r.loc}</b> <span class="mut">· {r.area}</span>
				</li>
			{:else}
				<li class="mut">Belum ada.</li>
			{/each}
		</ul>
	</div>
</div>
