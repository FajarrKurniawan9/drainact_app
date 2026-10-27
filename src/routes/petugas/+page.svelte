<script lang="ts">
	import { store } from '#lib/store.svelte.ts';

	let fileInput: HTMLInputElement;
	let pendingId: number | null = null;

	const stats = $derived([
		{ value: store.queue.length, label: 'Menunggu diangkut' },
		{ value: store.queue.filter((r) => r.sev === 'parah').length, label: 'Prioritas parah' },
		{ value: store.doneReports.length, label: 'Selesai' }
	]);

	function pick(id: number) {
		pendingId = id;
		fileInput.click();
	}

	async function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		e.currentTarget.value = ''; // allow choosing the same file again later
		const id = pendingId;
		pendingId = null;
		if (!file || id === null) return;
		await store.cleanReport(id, file);
	}
</script>

<svelte:head><title>Antrean Tugas - DrainAct Petugas</title></svelte:head>

<div class="wrap">
	<div class="grid grid-cols-3 gap-3 mb-5">
		{#each stats as s (s.label)}
			<div class="card !p-4 text-center border-amber-300 dark:border-amber-800">
				<div class="text-2xl font-extrabold text-amber-600">{s.value}</div>
				<div class="mut">{s.label}</div>
			</div>
		{/each}
	</div>
	<div class="card border-amber-300 dark:border-amber-800">
		<h2 class="font-extrabold text-lg">Antrean tugas pengangkutan</h2>
		<p class="mut mb-4">
			Urut dari yang paling parah. Setelah mengangkut, unggah foto bukti lokasi bersih.
		</p>
		<div class="space-y-2">
			{#each store.queue as r (r.id)}
				<div
					class="flex items-center justify-between gap-3 border border-slate-200 dark:border-zinc-800 rounded-xl p-3"
				>
					<div>
						<div class="text-sm font-bold">{r.loc}</div>
						<div class="mut">
							{r.area} · {r.cat} ·
							<b class={r.sev === 'parah' ? 'text-rose-500' : 'text-amber-500'}>{r.sev}</b>
						</div>
					</div>
					<button class="btn btn-o shrink-0" disabled={store.isBusy(r.id)} onclick={() => pick(r.id)}>
						{store.isBusy(r.id) ? 'Menyimpan…' : 'Unggah foto bersih'}
					</button>
				</div>
			{:else}
				<p class="mut">Semua tumpukan sudah diangkut.</p>
			{/each}
		</div>
		<input bind:this={fileInput} type="file" accept="image/*" class="hidden" {onchange} />
	</div>
</div>
