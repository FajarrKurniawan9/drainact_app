<script lang="ts">
	import { onDestroy } from 'svelte';
	import FaqChat from '#lib/components/FaqChat.svelte';
	import { AREA_NAMES, CATEGORIES, POINTS_PER_REPORT, SEVERITIES } from '#lib/data.ts';
	import { store } from '#lib/store.svelte.ts';
	import type { Area, Severity } from '#lib/types.ts';

	let cat = $state<string>(CATEGORIES[0]);
	let area = $state<Area>(AREA_NAMES[0]);
	let loc = $state('');
	let sev = $state<Severity>('parah');
	let photo = $state<File | null>(null);
	let preview = $state<string | null>(null);
	let note = $state('');
	let submitting = $state(false);
	let fileInput: HTMLInputElement;

	function setPhoto(file: File | null) {
		if (preview) URL.revokeObjectURL(preview);
		photo = file;
		preview = file ? URL.createObjectURL(file) : null;
	}

	onDestroy(() => {
		if (preview) URL.revokeObjectURL(preview);
	});

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!photo) return store.notify('Foto bukti wajib dilampirkan.');
		submitting = true;
		const ok = await store.submitReport({ area, loc: loc.trim(), cat, sev, photo });
		submitting = false;
		if (!ok) return;
		note = store.login
			? `Terkirim. Kamu dapat ${POINTS_PER_REPORT} poin setelah petugas mengangkut.`
			: 'Terkirim sebagai tamu. Masuk dulu jika ingin mendapat poin.';
		loc = '';
		cat = CATEGORIES[0];
		area = AREA_NAMES[0];
		sev = 'parah';
		setPhoto(null);
		fileInput.value = '';
	}
</script>

<svelte:head><title>Lapor - DrainAct</title></svelte:head>

<div class="wrap">
	<div class="grid md:grid-cols-2 gap-5">
		<form class="card space-y-3" {onsubmit}>
			<h2 class="font-extrabold text-lg">Laporkan tumpukan sampah</h2>
			<label class="mut block"
				>Foto bukti (wajib)<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					class="inp mt-1"
					onchange={(e) => setPhoto(e.currentTarget.files?.[0] ?? null)}
				/></label
			>
			{#if preview}
				<img src={preview} class="w-full h-40 object-cover rounded-lg" alt="Pratinjau foto" />
			{/if}
			<label class="mut block"
				>Jenis masalah<select bind:value={cat} class="inp mt-1">
					{#each CATEGORIES as c (c)}<option value={c}>{c}</option>{/each}
				</select></label
			>
			<label class="mut block"
				>Kecamatan<select bind:value={area} class="inp mt-1">
					{#each AREA_NAMES as a (a)}<option value={a}>{a}</option>{/each}
				</select></label
			>
			<label class="mut block"
				>Lokasi detail<input
					bind:value={loc}
					class="inp mt-1"
					placeholder="Contoh: Lahan kosong samping Jl. Kawi No. 12"
					required
				/></label
			>
			<label class="mut block"
				>Tingkat gangguan<select bind:value={sev} class="inp mt-1">
					{#each SEVERITIES as s (s.value)}<option value={s.value}>{s.label}</option>{/each}
				</select></label
			>
			<button class="btn w-full py-2.5" disabled={submitting}>
				{submitting ? 'Mengirim…' : 'Kirim laporan ke petugas'}
			</button>
			<p class="mut" aria-live="polite">{note}</p>
		</form>
		<FaqChat />
	</div>
</div>
