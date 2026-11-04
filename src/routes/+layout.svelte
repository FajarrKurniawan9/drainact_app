<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import Banner from '#lib/components/Banner.svelte';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import FloatingReport from '#lib/components/FloatingReport.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import { store } from '#lib/store.svelte.ts';
	import type { LayoutData } from './$types';

	let { children }: { children: any } = $props();

	$effect(() => {
		store.save();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DrainAct - Lapor Tumpukan Sampah Kota Malang</title>
</svelte:head>

<Navbar />
<Banner />
<main class="min-h-[70vh]">
	{@render children()}
</main>
<Footer />
<FloatingReport />
<Toast />
