<script lang="ts">
	import { store } from '#lib/store.svelte.ts';

	const P = $derived(store.role === 'petugas');
</script>

<div
	class={[
		'text-center text-xs font-semibold py-1.5',
		P ? 'bg-amber-600 text-white' : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200'
	]}
>
	{P
		? 'Mode Petugas DLH: hanya untuk petugas terdaftar. Pelapor tidak melihat halaman ini.'
		: 'Mode Warga: lapor tumpukan sampah, kumpulkan poin, tukar hadiah.'}
</div>
