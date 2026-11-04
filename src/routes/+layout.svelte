<script lang="ts">
	import '../app.css';
	import Toast from '#lib/components/Toast.svelte';
	import ReportSheet from '#lib/components/ReportSheet.svelte';
	import { store } from '#lib/store.svelte.ts';

	let { children }: { children: any } = $props();

	$effect(() => {
		store.save();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<title>DrainAct — Lapor Sampah Liar Kota Malang</title>
</svelte:head>

<a href="#main-content" class="skip-link">Langsung ke konten utama</a>

<div id="main-content">
	{@render children()}
</div>

<Toast />
<ReportSheet />
