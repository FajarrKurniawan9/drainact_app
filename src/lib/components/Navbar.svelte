<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { NAV } from '#lib/data.ts';
	import { store } from '#lib/store.svelte.ts';
	import { theme } from '#lib/theme.svelte.ts';

	const P = $derived(store.role === 'petugas');
	const active = $derived(P ? 'bg-amber-600 text-white' : 'bg-b text-white');
</script>

<nav
	class={[
		'sticky top-0 z-50 backdrop-blur border-b px-4 py-2.5',
		P
			? 'bg-amber-100/95 dark:bg-amber-950/95 border-amber-300 dark:border-amber-800'
			: 'bg-white/90 dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800'
	]}
>
	<div class="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
		<a href={resolve(P ? '/petugas' : '/')} class="font-extrabold text-lg flex items-center gap-2">
			<span
				class={[
					'w-7 h-7 rounded-full text-white grid place-items-center text-sm',
					P ? 'bg-amber-600' : 'bg-b'
				]}>D</span
			>DrainAct
		</a>

		<div class="flex gap-1 text-xs font-semibold order-3 md:order-none w-full md:w-auto overflow-x-auto">
			{#each NAV[store.role] as item (item.href)}
				{@const current = page.route.id === item.href}
				<a
					href={resolve(item.href)}
					aria-current={current ? 'page' : undefined}
					class={[
						'px-3 py-1.5 rounded-lg whitespace-nowrap',
						current ? active : 'text-slate-600 dark:text-zinc-400'
					]}>{item.label}</a
				>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<div
				class="flex rounded-lg border border-slate-300 dark:border-zinc-700 overflow-hidden text-xs font-bold"
			>
				<button
					onclick={() => store.setRole('warga')}
					aria-pressed={!P}
					class={['px-3 py-1.5', !P ? active : 'bg-transparent']}>Warga</button
				>
				<button
					onclick={() => store.setRole('petugas')}
					aria-pressed={P}
					class={['px-3 py-1.5', P ? active : 'bg-transparent']}>Petugas DLH</button
				>
			</div>
			<button
				onclick={() => theme.toggle()}
				class="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-sm"
				aria-label="Ubah mode tampilan">🌓</button
			>
			{#if !P}
				<span class="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800">
					{store.login ? `🪙 ${store.pts} poin` : 'Tamu'}
				</span>
				<button class="btn" onclick={() => store.toggleLogin()}>
					{store.login ? 'Keluar' : 'Masuk'}
				</button>
			{/if}
		</div>
	</div>
</nav>
