<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import Banner from '#lib/components/Banner.svelte';
	import Navbar from '#lib/components/Navbar.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import { store } from '#lib/store.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Persist state to localStorage whenever any persisted field changes.
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
<main>
	{@render children()}
</main>
<Toast />
