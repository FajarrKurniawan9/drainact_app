<script lang="ts">
	import { resolve } from '$app/paths';
	import { store } from '#lib/store.svelte.ts';
	let open = $state(false);
</script>

{#if !open}
	<button
		onclick={() => (open = true)}
		class="fixed bottom-6 right-6 z-40 bg-b hover:bg-bh text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-extrabold transition-all hover:scale-105 active:scale-95"
	>
		<span class="text-base">⚡</span> Lapor Cepat (30 Detik)
	</button>
{:else}
	<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
		<div class="card max-w-md w-full relative animate-in fade-in zoom-in-95 duration-200">
			<button
				onclick={() => (open = false)}
				class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 font-bold"
			>
				✕
			</button>
			<h2 class="font-extrabold text-base mb-2">Dialog Pelaporan Cepat</h2>
			<p class="mut mb-4">Laporkan tumpukan sampah atau saluran air tersumbat sekarang. Petugas segera merespons.</p>
			<div class="space-y-3">
				<a
					href={resolve('/lapor')}
					onclick={() => (open = false)}
					class="btn w-full py-3 block text-center"
				>
					Buka Formulir Lengkap (30 Detik)
				</a>
				<button
					onclick={() => (open = false)}
					class="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300 font-medium"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
