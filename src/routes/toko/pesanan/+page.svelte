<script lang="ts">
	import { resolve } from '$app/paths';
	import { rp } from '#lib/format.ts';
</script>

<svelte:head><title>Tabel Pesanan & Tracking - DrainAct</title></svelte:head>

<div class="wrap space-y-6">
	<div class="flex flex-wrap justify-between items-center gap-3">
		<div>
			<h1 class="font-extrabold text-2xl">Pesanan & Tracking UMKM Warga</h1>
			<p class="mut">Pantau status pesanan barang daur ulang dan pengiriman langsung ke alamat Anda.</p>
		</div>
		<a href={resolve('/toko')} class="btn bg-zinc-700 hover:bg-zinc-800">Kembali ke Toko</a>
	</div>

	<div class="card space-y-4">
		<h2 class="font-extrabold text-sm">Riwayat Pesanan Aktif</h2>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead>
					<tr class="border-b border-slate-200 dark:border-zinc-800 mut">
						<th class="pb-3">ID Pesanan</th>
						<th class="pb-3">Barang</th>
						<th class="pb-3">Total</th>
						<th class="pb-3">Status Pengiriman</th>
						<th class="pb-3 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 dark:divide-zinc-900">
					<tr>
						<td class="py-3 font-mono font-bold">#ORD-9821</td>
						<td class="py-3 font-semibold">Pupuk kompos organik 5 kg (2x)</td>
						<td class="py-3">{rp(70000)}</td>
						<td class="py-3">
							<span class="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full font-bold text-[11px]">
								🚚 Kurir UMKM Menuju Lokasi
							</span>
						</td>
						<td class="py-3 text-right">
							<a href={resolve('/profil')} class="btn px-3 py-1.5">Live Map</a>
						</td>
					</tr>
					<tr>
						<td class="py-3 font-mono font-bold">#ORD-9745</td>
						<td class="py-3 font-semibold">Pot tanaman daur ulang (1x)</td>
						<td class="py-3">{rp(25000)}</td>
						<td class="py-3">
							<span class="px-2.5 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full font-bold text-[11px]">
								✓ Selesai & Diterima
							</span>
						</td>
						<td class="py-3 text-right">
							<span class="mut">Arsip</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
