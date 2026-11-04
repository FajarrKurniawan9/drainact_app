<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
</script>

<footer class="app-footer">
	<div class="shell-wide">
		<div class="cols">
			<div class="brand-col">
				<a href="/dashboard" class="brand">
					<span class="mark"><Icon name="leaf" size={17} /></span>
					<span class="word">DrainAct <em>Civic Net</em></span>
				</a>
				<p>
					Sistem pemantauan drainase partisipatif masyarakat terintegrasi Dinas Lingkungan Hidup
					&amp; Tata Air Kota. Data terbuka, aksi nyata.
				</p>
				<div class="partner">
					<span class="partner-dot"></span>
					Kemitraan DLH Kota Malang
				</div>
			</div>

			<div class="col">
				<h4>Infrastruktur Mitra</h4>
				<ul>
					<li><a href="/petugas">Dinas Lingkungan Hidup (DLH)</a></li>
					<li><a href="/dashboard">Balai Pengelolaan Wilayah Sungai</a></li>
					<li><a href="/lapor">Badan Penanggulangan Bencana</a></li>
					<li><a href="/petugas">Dinas Pekerjaan Umum &amp; Penataan Ruang</a></li>
				</ul>
			</div>

			<div class="col">
				<h4>Kepatuhan &amp; Regulasi</h4>
				<span class="spbe"><Icon name="shield-check" size={12} /> Tersertifikasi SPBE Level 3</span>
				<p class="col-copy">
					Kepatuhan tata kelola data sistem pemerintahan berbasis elektronik, terintegrasi Satu Data
					Indonesia.
				</p>
			</div>

			<div class="col">
				<h4>Kanal Komunitas</h4>
				<div class="channels">
					<a href="https://wa.me/6281234567890" target="_blank" rel="noopener" aria-label="WhatsApp"><Icon name="message" size={15} /></a>
					<a href="/dashboard" aria-label="Peta"><Icon name="grid" size={15} /></a>
					<a href="/lapor" aria-label="Darurat"><Icon name="alert-circle" size={15} /></a>
					<a href="mailto:helpdesk@drainact.id" aria-label="Surel"><Icon name="mail" size={15} /></a>
				</div>
				<p class="col-copy">Senin–Jumat · 08.00–16.00 WIB<br />helpdesk@drainact.id</p>
			</div>
		</div>

		<div class="bottom">
			<span>© 2026 DrainAct Civic Systems. Hak cipta dilindungi undang-undang.</span>
			<div class="legal">
				<a href="/hub#tentang">Kebijakan Privasi Data Warga</a>
				<span>·</span>
				<a href="/petugas">Standar Operasional DLH</a>
				<span>·</span>
				<a href="/hub#tentang">Aksesibilitas</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.app-footer {
		background: var(--app-surface);
		border-top: 1px solid var(--app-line);
		padding-top: 48px;
		color: var(--app-muted);
		font-family: var(--font-ui);
	}

	.cols {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 0.9fr;
		gap: 48px;
		padding-bottom: 36px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 14px;
	}

	.mark {
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: var(--app-primary);
		color: #fff;
		display: grid;
		place-items: center;
	}

	.word {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--app-ink);
	}

	.word em {
		font-style: normal;
		font-weight: 500;
		color: var(--app-muted);
	}

	.brand-col p {
		font-size: 11.5px;
		line-height: 1.65;
		max-width: 330px;
		margin-bottom: 14px;
	}

	.partner {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		font-weight: 600;
		color: var(--app-primary);
		background: var(--app-card);
		border: 1px solid var(--app-line);
		border-radius: var(--r-pill);
		padding: 5px 9px;
	}

	.partner-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #10b981;
	}

	.col h4 {
		font-family: var(--font-ui);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--app-ink);
		margin-bottom: 14px;
	}

	.col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 9px;
	}

	.col a {
		font-size: 11.5px;
		color: var(--app-muted);
		transition: color 0.15s;
	}

	.col a:hover {
		color: var(--app-primary);
	}

	.spbe {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--app-primary);
		background: var(--app-surface-2);
		border-radius: var(--r-pill);
		padding: 5px 9px;
		margin-bottom: 10px;
	}

	.col-copy {
		font-size: 10.5px;
		line-height: 1.6;
		margin-top: 8px;
	}

	.channels {
		display: flex;
		gap: 7px;
	}

	.channels a {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--app-line);
		background: var(--app-card);
		display: grid;
		place-items: center;
		color: var(--app-muted);
		transition: background 0.15s, color 0.15s, transform 0.2s var(--ease-spring);
	}

	.channels a:hover {
		background: var(--app-primary);
		border-color: var(--app-primary);
		color: #fff;
		transform: translateY(-2px);
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		border-top: 1px solid var(--app-line);
		padding: 16px 0 20px;
		font-size: 10px;
	}

	.legal {
		display: flex;
		gap: 7px;
		align-items: center;
	}

	.legal a:hover {
		color: var(--app-ink);
	}

	@media (max-width: 900px) {
		.cols {
			grid-template-columns: 1fr 1fr;
			gap: 28px;
		}
		.brand-col {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 540px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
