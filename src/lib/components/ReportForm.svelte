<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { store } from '#lib/store.svelte.ts';
	import { CATEGORIES } from '#lib/data.ts';
	import type { Area, Severity } from '#lib/types.ts';

	let {
		variant = 'modal',
		onclose,
		onsuccess
	}: { variant?: 'modal' | 'page'; onclose?: () => void; onsuccess?: () => void } = $props();

	const TYPES = [
		{ title: 'Sumbatan Drainase & Banjir', body: 'Gorong-gorong mampet total, air meluap ke badan jalan raya.', icon: 'droplet', cat: 0 },
		{ title: 'Tumpukan Sampah Liar', body: 'Sampah menumpuk di sempadan saluran / lahan kosong publik.', icon: 'trash', cat: 1 },
		{ title: 'Genangan Air & Sedimen', body: 'Air menggenang di ban bekas, selokan dangkal berpotensi jentik.', icon: 'wind', cat: 2 },
		{ title: 'Sedimen Lumpur Tebal', body: 'Saluran padat sedimen butuh armada truk hisap lumpur DLH.', icon: 'truck', cat: 3 },
		{ title: 'Sampah Bulky / Perabot', body: 'Kasur bekas, ranting kayu besar, bongkaran puing menghalangi air.', icon: 'package', cat: 4 },
		{ title: 'Lainnya', body: 'Kebutuhan penanganan khusus.', icon: 'settings', cat: 5 }
	];

	const QUICK = ['+ Sampah Plastik', '+ Bau Menyengat', '+ Butuh Truk Hisap', '+ Dekat Pemukiman Padat'];
	const GPS = [
		{ label: 'Jl. Sawojajar No. 12, RT 03 / RW 05, Kedungkandang', coords: '-7.9719, 112.6234 (Gorong-gorong Terbuka Sawojajar)' },
		{ label: 'Jl. Ijen Boulevard No. 45, Klojen', coords: '-7.9666, 112.6301 (Drainase Primer Ijen)' }
	];

	let selected = $state(0);
	let loc = $state('');
	let note = $state('');
	let photos = $state<{ file: File; url: string }[]>([]);
	let disposition = $state<'dlh' | 'warga'>('dlh');
	let gpsIndex = $state(0);
	let dragOver = $state(false);
	let sending = $state(false);
	let done = $state(false);
	let error = $state('');
	let fileInput: HTMLInputElement;
	let timer: ReturnType<typeof setTimeout>;

	const sev = $derived<Severity>(selected === 0 || selected === 3 ? 'parah' : 'sedang');
	const severityPct = $derived(82 + (selected % 3) * 3);
	const catName = $derived(TYPES[selected].title);

	onDestroy(() => {
		photos.forEach((p) => URL.revokeObjectURL(p.url));
		clearTimeout(timer);
	});

	function addFiles(files: FileList | null) {
		if (!files) return;
		for (const file of Array.from(files)) {
			if (photos.length >= 5) break;
			if (!file.type.startsWith('image/')) continue;
			photos = [...photos, { file, url: URL.createObjectURL(file) }];
		}
		error = '';
	}

	function drop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		addFiles(e.dataTransfer?.files ?? null);
	}

	function removePhoto(i: number) {
		URL.revokeObjectURL(photos[i].url);
		photos = photos.filter((_, idx) => idx !== i);
	}

	function useGps() {
		const g = GPS[gpsIndex % GPS.length];
		gpsIndex++;
		loc = g.label;
		store.notify('Koordinat GPS terkunci, akurasi ±6 meter.');
	}

	function quick(text: string) {
		note = (note + ' ' + text.replace('+ ', '')).trim().slice(0, 250);
	}

	function guessArea(value: string): Area {
		const l = value.toLowerCase();
		if (l.includes('sawojajar') || l.includes('kedungkandang')) return 'Kedungkandang';
		if (l.includes('ijen') || l.includes('klojen') || l.includes('bandung')) return 'Klojen';
		if (l.includes('soekarno') || l.includes('lowokwaru') || l.includes('dinoyo')) return 'Lowokwaru';
		if (l.includes('sukun') || l.includes('bandulan')) return 'Sukun';
		if (l.includes('borobudur') || l.includes('blimbing')) return 'Blimbing';
		return 'Klojen';
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		if (loc.trim().length < 3) {
			error = 'Tulis alamat lokasi kejadian minimal 3 karakter.';
			return;
		}
		if (!photos.length) {
			error = 'Lampirkan minimal satu foto bukti kejadian.';
			return;
		}
		sending = true;
		const ok = await store.submitReport({
			area: guessArea(loc),
			loc: loc.trim(),
			cat: CATEGORIES[TYPES[selected].cat] ?? CATEGORIES[0],
			sev,
			photo: photos[0].file
		});
		sending = false;
		if (!ok) {
			error = 'Laporan gagal terkirim. Periksa koneksi lalu coba lagi.';
			return;
		}
		done = true;
		store.notify('Laporan terkirim. Tim DLH menerima tiket baru.');
		timer = setTimeout(() => {
			done = false;
			reset();
			onsuccess?.();
			onclose?.();
		}, 1200);
	}

	function reset() {
		loc = '';
		note = '';
		photos.forEach((p) => URL.revokeObjectURL(p.url));
		photos = [];
		selected = 0;
		disposition = 'dlh';
		if (fileInput) fileInput.value = '';
	}
</script>

<form class="report" class:page={variant === 'page'} onsubmit={submit} novalidate>
	<!-- header -->
	<div class="r-head">
		<div class="r-head-top">
			<div class="r-title">
				<span class="r-icon"><Icon name="alert-triangle" size={18} /></span>
				<div>
					<h2>Formulir Pelaporan Sampah &amp; Drainase Cepat</h2>
					<span class="speed">&lt;30 Detik</span>
				</div>
			</div>
			<button type="button" class="close" onclick={() => onclose?.()} aria-label="Tutup formulir">
				<Icon name="x" size={16} />
			</button>
		</div>
		<p class="r-sub">
			Cepat, presisi, dan tanpa kewajiban login. Dilengkapi verifikasi AI otomatis &amp; terhubung
			langsung ke Unit Pelaksana Teknis DLH Kota Malang.
		</p>
		<div class="sla">
			<span class="sla-left"><span class="dot dot-live"></span> SLA Triage AI: Realtime (&lt;5 detik)</span>
			<span class="sla-id">ID Tiket: #MALANG-HYD-88219</span>
		</div>
	</div>

	<div class="r-body">
		<!-- location -->
		<section class="block">
			<div class="block-head">
				<h3><span class="req">*</span> Lokasi Kejadian</h3>
				<span class="gps-status"><span class="dot"></span> GPS Auto-Detect Aktif</span>
			</div>
			<p class="block-sub">
				Tulis alamat selengkap mungkin atau gunakan tombol GPS untuk mengunci koordinat geospasial
				secara akurat.
			</p>
			<div class="loc-row">
				<div class="loc-field">
					<Icon name="map-pin" size={15} />
					<input bind:value={loc} placeholder="Jl. Sawojajar No. 12, RT 03 / RW 05, Kedungkandang" maxlength="200" />
				</div>
				<button type="button" class="gps-btn" onclick={useGps}>
					<Icon name="target" size={15} /> GPS Saya
				</button>
			</div>
			{#if loc}
				<div class="loc-tags">
					<span><Icon name="check" size={11} /> Akurasi: ±6 meter terkalibrasi</span>
					<span><Icon name="navigation" size={11} /> {GPS[(gpsIndex - 1 + GPS.length) % GPS.length].coords}</span>
				</div>
			{/if}
		</section>

		<!-- emergency type -->
		<section class="block">
			<div class="block-head">
				<h3><span class="req">*</span> Jenis Keadaan Darurat</h3>
				<span class="pick-hint">Pilih salah satu prioritas</span>
			</div>
			<p class="block-sub">
				Pilih kondisi lapangan yang paling sesuai untuk membantu sistem mengalokasikan armada
				penanganan DLH.
			</p>
			<div class="types" role="radiogroup" aria-label="Jenis keadaan darurat">
				{#each TYPES as t, i}
					<button
						type="button"
						class="type"
						class:on={selected === i}
						role="radio"
						aria-checked={selected === i}
						onclick={() => (selected = i)}
					>
						<span class="type-icon"><Icon name={t.icon} size={17} /></span>
						<span class="type-copy">
							<b>{t.title}</b>
							<span>{t.body}</span>
						</span>
						<span class="type-check"><Icon name="check" size={11} /></span>
					</button>
				{/each}
			</div>
		</section>

		<!-- description -->
		<section class="block">
			<div class="block-head">
				<h3><span class="req">*</span> Deskripsi Kejadian</h3>
				<span class="counter" class:warn={note.length > 230}>{note.length}/250</span>
			</div>
			<p class="block-sub">
				Ceritakan singkat apa yang terjadi, sebutkan estimasi waktu tersumbat, tinggi luapan, dan
				kondisi lingkungan sekitar.
			</p>
			<textarea
				class="field field-area note"
				bind:value={note}
				maxlength="250"
				placeholder="Gorong-gorong tersumbat tumpukan sampah plastik & endapan lumpur setelah hujan deras sore tadi. Air meluap ke aspal sekitar 15 cm dan bau menyengat."
			></textarea>
			<div class="quick-row">
				<span>Tambahan Cepat:</span>
				{#each QUICK as q}
					<button type="button" onclick={() => quick(q)}>{q}</button>
				{/each}
			</div>
		</section>

		<!-- photo -->
		<section class="block">
			<div class="block-head">
				<h3>Foto Bukti Kejadian</h3>
				<span class="ai-tag"><Icon name="cpu" size={12} /> AI Detection Terintegrasi</span>
			</div>
			<p class="block-sub">
				Unduh maks. 5 foto. Foto otomatis dianalisis oleh AI Computer Vision DLH untuk kalkulasi
				tingkat keparahan.
			</p>

			<label
				class="dropzone"
				class:over={dragOver}
				ondragover={(e) => { e.preventDefault(); dragOver = true; }}
				ondragleave={() => (dragOver = false)}
				ondrop={drop}
			>
				<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					multiple
					onchange={(e) => addFiles(e.currentTarget.files)}
				/>
				<span class="drop-icon"><Icon name="upload" size={20} /></span>
				<span class="drop-title">{dragOver ? 'Lepaskan foto di sini' : 'Tarik foto ke sini atau klik untuk pilih berkas'}</span>
				<span class="drop-sub">Mendukung JPG, PNG, WEBP · maksimal 5 MB per foto</span>
				<span class="drop-btn"><Icon name="camera" size={13} /> Ambil Foto / Pilih Berkas</span>
			</label>

			<div class="thumbs">
				{#each photos as p, i}
					<div class="thumb">
						<img src={p.url} alt={`Foto bukti ${i + 1}`} />
						<span>Foto #{i + 1}</span>
						<button type="button" onclick={() => removePhoto(i)} aria-label={`Hapus foto ${i + 1}`}>
							<Icon name="x" size={11} />
						</button>
					</div>
				{/each}
				{#if photos.length < 5}
					<button type="button" class="thumb add" onclick={() => fileInput?.click()}>
						<Icon name="plus" size={18} />
						<span>+ Tambah Foto</span>
					</button>
				{/if}
			</div>

			{#if photos.length}
				<div class="ai-card">
					<div class="ai-card-head">
						<span><Icon name="sparkles" size={13} /> DrainAct AI Vision Sensor</span>
						<span class="ai-badge">Tingkat Bahaya: {severityPct}% ({severityPct > 80 ? 'Kritis' : 'Waspada'})</span>
						<span class="ok-badge">Validasi 100% Lolos</span>
					</div>
					<p>
						Terdeteksi: Tumpukan Botol PET &amp; Sedimen Lumpur Pekat dengan estimasi volume
						genangan ±18 Liter/detik tertahan. Memenuhi syarat penanganan tim siaga cepat DLH.
					</p>
				</div>
			{/if}
		</section>

		<!-- disposition -->
		<section class="block">
			<h3>Target Disposisi Laporan</h3>
			<div class="targets">
				<button
					type="button"
					class="target"
					class:on={disposition === 'dlh'}
					onclick={() => (disposition = 'dlh')}
				>
					<span class="target-radio"><i></i></span>
					<span>
						<b>Tim Reaksi Cepat DLH</b>
						<span>Prioritas penanganan darurat banjir, armada truk hisap, &amp; personel satgas.</span>
					</span>
				</button>
				<button
					type="button"
					class="target"
					class:on={disposition === 'warga'}
					onclick={() => (disposition = 'warga')}
				>
					<span class="target-radio"><i></i></span>
					<span>
						<b>Ajak Warga Kerja Bakti</b>
						<span>Masuk ke papan agenda warga RT/RW untuk gotong royong akhir pekan ini.</span>
					</span>
				</button>
			</div>
		</section>

		{#if error}
			<p class="error"><Icon name="alert-circle" size={14} /> {error}</p>
		{/if}
	</div>

	<!-- footer -->
	<div class="r-foot">
		<div class="notice">
			<Icon name="shield" size={15} />
			<span>Data identitas pelapor dilindungi dan dapat dianonimkan. Terintegrasi resmi dengan Satu Data Kota Malang &amp; SPBE DLH.</span>
		</div>
		<div class="actions">
			<button type="button" class="btn btn-ghost cancel" onclick={() => onclose?.()}>Batal</button>
			<button type="submit" class="btn submit" disabled={sending || done}>
				{#if done}
					<Icon name="check" size={15} /> Laporan Terkirim
				{:else if sending}
					<Icon name="refresh" size={15} /> Mengirim…
				{:else}
					<Icon name="send" size={15} /> Kirim Laporan (&lt;30 Detik)
				{/if}
			</button>
		</div>
	</div>
</form>

<style>
	.report {
		display: flex;
		flex-direction: column;
		max-height: min(90vh, 940px);
		background: var(--pub-card);
		color: var(--pub-ink);
		border-radius: 18px;
		overflow: hidden;
		font-family: var(--font-ui);
	}

	.report.page {
		max-height: none;
		border-radius: 18px;
		box-shadow: var(--shadow-lg);
	}

	/* header */
	.r-head {
		background: linear-gradient(135deg, #1d5252, #164e4d 60%, #123f3e);
		color: #fff;
		padding: 22px 26px 0;
		flex: none;
		position: relative;
		overflow: hidden;
	}

	.r-head::after {
		content: '';
		position: absolute;
		right: -70px;
		top: -110px;
		width: 280px;
		height: 280px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.r-head-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		position: relative;
		z-index: 1;
	}

	.r-title {
		display: flex;
		gap: 11px;
		align-items: flex-start;
	}

	.r-icon {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.14);
		display: grid;
		place-items: center;
		flex: none;
		color: #ffd7d2;
	}

	.r-title h2 {
		color: #fff;
		font-size: 18px;
		letter-spacing: -0.02em;
		line-height: 1.2;
		margin-bottom: 6px;
	}

	.speed {
		display: inline-flex;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.16);
		padding: 3px 8px;
		border-radius: var(--r-pill);
	}

	.close {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 0;
		background: rgba(255, 255, 255, 0.12);
		color: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		flex: none;
		transition: background 0.15s, transform 0.2s var(--ease-spring);
	}

	.close:hover {
		background: rgba(255, 255, 255, 0.22);
		transform: rotate(90deg);
	}

	.r-sub {
		position: relative;
		z-index: 1;
		margin-top: 10px;
		font-size: 11.5px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.62);
		max-width: 620px;
	}

	.sla {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 14px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px 8px 0 0;
		padding: 9px 14px;
		font-size: 9.5px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
	}

	.sla-left {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: #a7f3d0;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}

	.dot-live {
		position: relative;
	}

	.dot-live::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		border: 1px solid currentColor;
		animation: ping 2s infinite;
	}

	@keyframes ping {
		70%, 100% { transform: scale(2); opacity: 0; }
	}

	.sla-id {
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.06em;
	}

	/* body */
	.r-body {
		overflow-y: auto;
		padding: 22px 26px 10px;
		display: flex;
		flex-direction: column;
		gap: 22px;
		background: var(--pub-card);
	}

	.block {
		padding-bottom: 20px;
		border-bottom: 1px solid var(--pub-line);
	}

	.block:last-of-type {
		border-bottom: 0;
		padding-bottom: 4px;
	}

	.block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 5px;
	}

	.block h3 {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: -0.005em;
		color: var(--pub-ink);
	}

	.req {
		color: #c53030;
	}

	.pick-hint {
		font-size: 9.5px;
		color: var(--pub-muted);
	}

	.block-sub {
		font-size: 10.5px;
		line-height: 1.55;
		color: var(--pub-muted);
		margin-bottom: 12px;
		max-width: 640px;
	}

	.gps-status {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		font-weight: 600;
		color: #0c7a46;
	}

	.gps-status .dot {
		background: #10b981;
	}

	.loc-row {
		display: flex;
		gap: 8px;
	}

	.loc-field {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--pub-line);
		border-radius: 8px;
		padding: 0 11px;
		background: var(--pub-bg-soft);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.loc-field:focus-within {
		border-color: var(--pub-teal);
		box-shadow: 0 0 0 3px rgba(44, 122, 122, 0.1);
	}

	.loc-field :global(svg) {
		color: var(--pub-muted);
		flex: none;
	}

	.loc-field input {
		width: 100%;
		height: 40px;
		border: 0;
		background: transparent;
		font-family: var(--font-ui);
		font-size: 11.5px;
		color: var(--pub-ink);
		outline: none;
	}

	.loc-field input::placeholder {
		color: var(--pub-muted);
	}

	.gps-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 40px;
		padding: 0 13px;
		border: 0;
		border-radius: 8px;
		background: #c53030;
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, transform 0.18s var(--ease-spring);
		white-space: nowrap;
	}

	.gps-btn:hover {
		background: #a92a2a;
		transform: translateY(-1px);
	}

	.loc-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
	}

	.loc-tags span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		color: var(--pub-muted);
		background: color-mix(in srgb, var(--pub-teal) 6%, transparent);
		border-radius: 5px;
		padding: 4px 7px;
	}

	.loc-tags :global(svg) {
		color: var(--pub-teal);
	}

	/* types */
	.types {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.type {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 7px;
		text-align: left;
		background: var(--pub-bg-soft);
		border: 1px solid var(--pub-line);
		border-radius: 10px;
		padding: 11px;
		cursor: pointer;
		transition: border-color 0.16s, background 0.16s, transform 0.18s var(--ease-spring);
		min-height: 96px;
	}

	.type:hover {
		border-color: color-mix(in srgb, var(--pub-teal) 40%, var(--pub-line));
		transform: translateY(-1px);
	}

	.type.on {
		background: #fff5f5;
		border-color: #c53030;
		box-shadow: 0 0 0 1px #c53030 inset;
	}

	:global([data-theme='night']) .type.on {
		background: #2a1513;
	}

	.type-icon {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		color: #b45309;
		display: grid;
		place-items: center;
	}

	.type.on .type-icon {
		color: #c53030;
		border-color: #f3c0c0;
	}

	.type-copy b {
		display: block;
		font-size: 10.5px;
		font-weight: 700;
		line-height: 1.3;
		color: var(--pub-ink);
	}

	.type-copy span {
		display: block;
		margin-top: 3px;
		font-size: 9px;
		line-height: 1.45;
		color: var(--pub-muted);
	}

	.type-check {
		position: absolute;
		top: 9px;
		right: 9px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #c53030;
		color: #fff;
		display: grid;
		place-items: center;
		opacity: 0;
		transform: scale(0.6);
		transition: opacity 0.15s, transform 0.2s var(--ease-spring);
	}

	.type.on .type-check {
		opacity: 1;
		transform: none;
	}

	/* textarea */
	.field-area.note {
		min-height: 88px;
		font-size: 11.5px;
		line-height: 1.6;
		background: var(--pub-bg-soft);
	}

	.counter {
		font-size: 9px;
		color: var(--pub-muted);
	}

	.counter.warn {
		color: #b45309;
	}

	.quick-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 8px;
	}

	.quick-row > span {
		font-size: 9px;
		color: var(--pub-muted);
		margin-right: 2px;
	}

	.quick-row button {
		font-size: 9px;
		padding: 4px 8px;
		border-radius: var(--r-pill);
		border: 1px solid var(--pub-line);
		background: transparent;
		color: var(--pub-ink-2);
		cursor: pointer;
		transition: background 0.14s, border-color 0.14s;
	}

	.quick-row button:hover {
		background: var(--pub-bg-soft);
		border-color: var(--pub-teal);
		color: var(--pub-teal);
	}

	.ai-tag {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		font-weight: 600;
		color: #0c7a46;
		background: #eafaf1;
		border-radius: var(--r-pill);
		padding: 4px 8px;
	}

	/* upload */
	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border: 1.5px dashed #c3d6d2;
		border-radius: 10px;
		background: var(--pub-bg-soft);
		padding: 22px 16px 18px;
		cursor: pointer;
		transition: border-color 0.16s, background 0.16s;
	}

	.dropzone input {
		display: none;
	}

	.dropzone.over {
		border-color: var(--pub-teal);
		background: color-mix(in srgb, var(--pub-teal) 5%, transparent);
	}

	.drop-icon {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		color: var(--pub-teal);
		display: grid;
		place-items: center;
		margin-bottom: 3px;
	}

	.drop-title {
		font-size: 11px;
		font-weight: 600;
		color: var(--pub-ink);
	}

	.drop-sub {
		font-size: 9px;
		color: var(--pub-muted);
	}

	.drop-btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-top: 7px;
		background: var(--pub-card);
		border: 1px solid var(--pub-line);
		border-radius: 6px;
		padding: 6px 10px;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--pub-ink-2);
	}

	.thumbs {
		display: flex;
		gap: 8px;
		margin-top: 10px;
		flex-wrap: wrap;
	}

	.thumb {
		position: relative;
		width: 92px;
		height: 72px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--pub-line);
		background: var(--pub-bg-soft);
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb > span {
		position: absolute;
		left: 5px;
		bottom: 4px;
		font-size: 8px;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
	}

	.thumb > button {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 17px;
		height: 17px;
		border: 0;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
	}

	.thumb.add {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		border-style: dashed;
		color: var(--pub-muted);
		cursor: pointer;
		font-size: 8px;
	}

	.thumb.add:hover {
		border-color: var(--pub-teal);
		color: var(--pub-teal);
	}

	.ai-card {
		margin-top: 10px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 9px;
		padding: 10px 12px;
	}

	.ai-card-head {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		font-size: 9.5px;
		font-weight: 700;
		color: #166534;
		margin-bottom: 5px;
	}

	.ai-card-head > span:first-child {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.ai-badge {
		background: #fee2e2;
		color: #991b1b;
		border-radius: var(--r-pill);
		padding: 3px 7px;
		font-size: 8.5px;
	}

	.ok-badge {
		background: #dcfce7;
		color: #166534;
		border-radius: var(--r-pill);
		padding: 3px 7px;
		font-size: 8.5px;
		margin-left: auto;
	}

	.ai-card p {
		font-size: 9.5px;
		line-height: 1.55;
		color: #166534;
	}

	/* targets */
	.targets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.target {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		text-align: left;
		background: var(--pub-bg-soft);
		border: 1px solid var(--pub-line);
		border-radius: 9px;
		padding: 11px;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}

	.target.on {
		background: #f0fdfa;
		border-color: var(--pub-teal);
	}

	:global([data-theme='night']) .target.on {
		background: #0d2a27;
	}

	.target-radio {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		border: 1.5px solid #b9cfcb;
		display: grid;
		place-items: center;
		flex: none;
		margin-top: 1px;
	}

	.target.on .target-radio {
		border-color: var(--pub-teal);
	}

	.target-radio i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--pub-teal);
		opacity: 0;
		transform: scale(0.4);
		transition: opacity 0.15s, transform 0.2s var(--ease-spring);
	}

	.target.on .target-radio i {
		opacity: 1;
		transform: none;
	}

	.target b {
		display: block;
		font-size: 10.5px;
		color: var(--pub-ink);
		margin-bottom: 2px;
	}

	.target span span {
		display: block;
		font-size: 9px;
		line-height: 1.45;
		color: var(--pub-muted);
	}

	.error {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 10.5px;
		color: #b91c1c;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 7px;
		padding: 8px 11px;
	}

	/* footer */
	.r-foot {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 14px 26px 18px;
		border-top: 1px solid var(--pub-line);
		background: var(--pub-card);
	}

	.notice {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 8.5px;
		line-height: 1.4;
		color: var(--pub-muted);
		max-width: 430px;
	}

	.notice :global(svg) {
		flex: none;
		color: var(--pub-teal);
	}

	.actions {
		display: flex;
		gap: 8px;
		flex: none;
	}

	.cancel {
		height: 38px;
		font-size: 11px;
		border: 1px solid var(--pub-line);
		background: var(--pub-bg-soft);
		color: var(--pub-ink-2);
	}

	.submit {
		height: 38px;
		font-size: 11px;
		background: #dc2626;
		color: #fff;
		font-weight: 700;
		box-shadow: 0 10px 20px -12px rgba(220, 38, 38, 0.8);
	}

	.submit:hover {
		background: #b91c1c;
	}

	@media (max-width: 720px) {
		.r-head,
		.r-body,
		.r-foot {
			padding-left: 16px;
			padding-right: 16px;
		}
		.types {
			grid-template-columns: 1fr 1fr;
		}
		.targets {
			grid-template-columns: 1fr;
		}
		.loc-row {
			flex-direction: column;
		}
		.r-foot {
			flex-direction: column;
			align-items: stretch;
		}
		.actions {
			justify-content: flex-end;
		}
	}
</style>
