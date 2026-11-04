<script lang="ts">
	import { resolve } from '$app/paths';
	import { store } from '#lib/store.svelte.ts';
	import Heatmap from '#lib/components/Heatmap.svelte';
</script>

<svelte:head><title>Profil Warga & Live Tracking - DrainAct</title></svelte:head>

<div class="wrap space-y-6">
	<div class="flex flex-wrap justify-between items-center gap-3">
		<div>
			<h1 class="font-extrabold text-2xl">Profil Warga & Portofolio Sipil</h1>
			<p class="mut">Portofolio kontribusi kebersihan lingkungan dan live tracking pesanan UMKM.</p>
		</div>
		<div class="card !py-2 !px-4 text-xs font-bold bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
			⭐ Poin Anda: {store.points} Poin
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6">
		<div class="card space-y-4">
			<h2 class="font-extrabold text-sm">Live Map Tracking Kurir UMKM (#ORD-9821)</h2>
			<div class="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 h-64 relative grid place-items-center">
				<div class="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
				<div class="text-center space-y-2 z-10">
					<div class="w-10 h-10 rounded-full bg-green-600 text-white grid place-items-center mx-auto text-lg animate-bounce">
						🛵
					</div>
					<div class="font-bold text-xs">Kurir UMKM sedang menuju lokasi Anda di Klojen</div>
					<div class="mut">Estimasi tiba: <b>8 menit lagi</b></div>
				</div>
			</div>
		</div>

		<div class="card space-y-4">
			<h2 class="font-extrabold text-sm">Portofolio Kontribusi Warga</h2>
			<div class="space-y-3 text-xs">
				<div class="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 flex justify-between items-center">
					<div>
						<div class="font-bold">Laporan Tumpukan Sampah #104</div>
						<div class="mut">Jl. Kawi Atas • Diangkut oleh Petugas DLH</div>
					</div>
					<span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 rounded font-bold">+50 Poin</span>
				</div>
				<div class="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 flex justify-between items-center">
					<div>
						<div class="font-bold">Penukaran Kompos Organik</div>
						<div class="mut">Eco-Shop • 150 Poin Ditukar</div>
					</div>
					<span class="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded font-bold">Selesai</span>
				</div>
			</div>
		</div>
	</div>
</div>
