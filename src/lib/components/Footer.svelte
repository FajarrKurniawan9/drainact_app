<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer class="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 py-10 mt-16 text-xs">
	<div class="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
		<div>
			<div class="font-extrabold text-base text-slate-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
				<span class="w-6 h-6 rounded-full bg-b text-white grid place-items-center text-xs">D</span> DrainAct
			</div>
			<p class="leading-relaxed">Platform kolaboratif penanganan tumpukan sampah & drainase Kota Malang. Cepat, transparan, dan berdampak.</p>
		</div>
		<div>
			<h3 class="font-bold text-slate-900 dark:text-zinc-200 mb-3">Menu Warga</h3>
			<ul class="space-y-2">
				<li><a href={resolve('/lapor')} class="hover:underline">Laporkan Sampah</a></li>
				<li><a href={resolve('/tukar')} class="hover:underline">Tukar Poin</a></li>
				<li><a href={resolve('/toko')} class="hover:underline">Eco-Shop & Toko</a></li>
				<li><a href={resolve('/profil')} class="hover:underline">Profil & Portofolio Sipil</a></li>
			</ul>
		</div>
		<div>
			<h3 class="font-bold text-slate-900 dark:text-zinc-200 mb-3">Portal & Layanan</h3>
			<ul class="space-y-2">
				<li><a href={resolve('/toko/seller')} class="hover:underline">Seller Portal UMKM</a></li>
				<li><a href={resolve('/toko/pesanan')} class="hover:underline">Tracking Pesanan</a></li>
				<li><a href={resolve('/petugas')} class="hover:underline">DLH Command Center</a></li>
				<li><a href={resolve('/petugas/peta')} class="hover:underline">Peta Operasional</a></li>
			</ul>
		</div>
		<div>
			<h3 class="font-bold text-slate-900 dark:text-zinc-200 mb-3">Dinas Lingkungan Hidup</h3>
			<p class="leading-relaxed mb-2">Kolaborasi warga & pemerintah Kota Malang untuk lingkungan bersih dan bebas banjir.</p>
			<p class="text-[11px] text-slate-400">&copy; 2026 DrainAct Team. All rights reserved.</p>
		</div>
	</div>
</footer>
