<script lang="ts">
	import { resolve } from '$app/paths';
	import { store } from '#lib/store.svelte.ts';
	import { rp } from '#lib/format.ts';

	let productName = $state('');
	let productPrice = $state(25000);
	let productPoints = $state(150);
	let productDesc = $state('');
	let added = $state(false);

	function addProduct(e: SubmitEvent) {
		e.preventDefault();
		if (!productName.trim()) return store.notify('Nama produk wajib diisi.');
		added = true;
		store.notify('Produk UMKM berhasil didaftarkan ke Eco-Marketplace!');
		productName = '';
		productDesc = '';
		setTimeout(() => (added = false), 3000);
	}
</script>

<svelte:head><title>Seller Portal - Eco-Marketplace DrainAct</title></svelte:head>

<div class="wrap space-y-6">
	<div class="flex flex-wrap justify-between items-center gap-3">
		<div>
			<h1 class="font-extrabold text-2xl">Eco-Marketplace Seller Portal</h1>
			<p class="mut">Kelola produk daur ulang UMKM warga, pantau penjualan, dan dukung pendanaan pengangkutan sampah.</p>
		</div>
		<a href={resolve('/toko')} class="btn bg-zinc-700 hover:bg-zinc-800">Kembali ke Toko</a>
	</div>

	<div class="grid md:grid-cols-3 gap-6">
		<div class="card space-y-4 md:col-span-1">
			<h2 class="font-extrabold text-sm">Tambah Produk Daur Ulang</h2>
			<form class="space-y-3" onsubmit={addProduct}>
				<div>
					<label for="p-name" class="mut block mb-1">Nama Produk</label>
					<input id="p-name" class="inp" type="text" placeholder="Contoh: Tas Anyaman Daur Ulang" bind:value={productName} />
				</div>
				<div>
					<label for="p-price" class="mut block mb-1">Harga (Rp)</label>
					<input id="p-price" class="inp" type="number" bind:value={productPrice} />
				</div>
				<div>
					<label for="p-points" class="mut block mb-1">Nilai Poin Tukar</label>
					<input id="p-points" class="inp" type="number" bind:value={productPoints} />
				</div>
				<div>
					<label for="p-desc" class="mut block mb-1">Deskripsi Bahan</label>
					<textarea id="p-desc" class="inp" rows="2" placeholder="Terbuat dari botol plastik terpilah..." bind:value={productDesc}></textarea>
				</div>
				<button class="btn w-full py-2.5" type="submit">Publikasikan ke Eco-Shop</button>
			</form>
			{#if added}
				<p class="text-xs text-green-600 font-bold text-center">✓ Produk berhasil terdaftar!</p>
			{/if}
		</div>

		<div class="card space-y-4 md:col-span-2">
			<h2 class="font-extrabold text-sm">Statistik Penjualan UMKM & Dampak Lingkungan</h2>
			<div class="grid grid-cols-3 gap-3">
				<div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
					<div class="text-xs mut">Total Produk Aktif</div>
					<div class="text-lg font-extrabold mt-1">6 Produk</div>
				</div>
				<div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
					<div class="text-xs mut">Pendapatan Bulan Ini</div>
					<div class="text-lg font-extrabold mt-1 text-green-600">{rp(1450000)}</div>
				</div>
				<div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
					<div class="text-xs mut">Kontribusi Kas Sampah</div>
					<div class="text-lg font-extrabold mt-1 text-amber-600">{rp(290000)}</div>
				</div>
			</div>

			<div class="mt-4">
				<h3 class="font-bold text-xs mb-3">Daftar Produk UMKM Anda</h3>
				<div class="space-y-2 text-xs">
					<div class="flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
						<div>
							<div class="font-bold">🌱 Pupuk kompos organik 5 kg</div>
							<div class="mut">Terjual 34 unit • {rp(35000)}</div>
						</div>
						<span class="px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded font-bold">Aktif</span>
					</div>
					<div class="flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
						<div>
							<div class="font-bold">🪴 Pot tanaman daur ulang</div>
							<div class="mut">Terjual 18 unit • {rp(25000)}</div>
						</div>
						<span class="px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded font-bold">Aktif</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
