<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { store } from '#lib/store.svelte.ts';

	onMount(() => {
		store.openReport();
		goto('/dashboard', { replaceState: true });
	});
</script>

<svelte:head><title>Membuka Formulir Lapor — DrainAct</title></svelte:head>

<div style="min-height: 100vh; display: grid; place-items: center; background: #eafdfa; color: #016161; font-family: sans-serif;">
	<div style="text-align: center;">
		<h2>Membuka dialog pelaporan cepat (&lt;30 detik)...</h2>
		<p style="margin-top: 8px; font-size: 13px; color: #4e6262;">Mengalihkan ke dashboard warga</p>
	</div>
</div>
