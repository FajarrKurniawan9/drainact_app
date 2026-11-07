<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import DrainLogo from '#lib/components/DrainLogo.svelte';
	import { FOOTER_LINKS } from '#lib/content.ts';

	const HREFS: Record<string, string> = {
		'Peta Telemetri Genangan GIS': '/#peta',
		'Sensor Debit Air Kali Bantas': '/#peta',
		'CCTV Inspeksi Culvert': '/dashboard',
		'Status Siaga Banjir BMKG': '/dashboard',
		'Pelaporan Warga Cepat': '/lapor',
		'Bank Sampah & Daur Ulang': '/toko',
		'Kepatuhan Arsitektur SPBE': '/hub#tentang',
		'SOP Tanggap Darurat PU PR': '/hub#tentang',
		'Pemerintah Kota Malang': 'https://malangkota.go.id',
		'Pemerintah Kabupaten Malang': 'https://malangkab.go.id',
		'Pemerintah Kota Batu': 'https://kotabatu.go.id',
		'Dinas Lingkungan Hidup Jatim': 'https://dlh.jatimprov.go.id'
	};
	const hrefFor = (label: string) => HREFS[label] ?? '/#';
</script>

<footer class="pub-footer">
	<div class="shell-wide">
		<div class="cols">
			<div class="brand-col">
				<div class="brand">
					<DrainLogo size={36} />
					<div class="brand-text">
						<span class="word">Drain<span>Act</span></span>
						<span class="sub-word">Civic Ecosystem</span>
					</div>
				</div>
				<p>
					Platform tata kelola hidrologi perkotaan, drainase cerdas, dan sirkularitas sampah terintegrasi. Menghubungkan partisipasi aktif warga dengan respon cepat dinas teknis pemerintah daerah.
				</p>
				<div class="live">
					<span class="dot dot-live"></span>
					Sistem Telemetri &amp; Dispatch Terbuka · Malang Raya
				</div>
			</div>

			{#each FOOTER_LINKS as col}
				<div class="link-col">
					<h4>{col.title}</h4>
					<ul>
						{#each col.links as link}
							<li><a href={hrefFor(link)}>{link}</a></li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="bottom">
			<span>© 2025 DrainAct Civic Tech Initiative. Berstandar SPBE &amp; Satu Data Indonesia.</span>
			<div class="legal">
				<span>Sistem Operasional Drainase Presisi · Malang Raya Pilot</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.pub-footer {
		background: var(--pub-bg-soft);
		border-top: 1px solid var(--pub-line);
		padding-top: 64px;
		color: var(--pub-ink-2);
	}

	.cols {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1fr;
		gap: 64px;
		padding-bottom: 48px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 18px;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.sub-word {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--pub-teal);
	}

	.word {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.04em;
		color: var(--pub-ink);
	}

	.word span {
		color: var(--pub-teal);
	}

	.brand-col p {
		font-size: 13px;
		line-height: 1.65;
		color: var(--pub-muted);
		max-width: 340px;
		margin-bottom: 20px;
	}

	.live {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--pub-teal);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--pub-green-600);
	}

	.link-col h4 {
		font-family: var(--font-ui);
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pub-teal);
		margin-bottom: 18px;
	}

	.link-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 11px;
	}

	.link-col a {
		font-size: 13px;
		color: var(--pub-ink-2);
		transition: color 0.15s, transform 0.2s var(--ease-spring);
		display: inline-block;
	}

	.link-col a:hover {
		color: var(--pub-teal);
		transform: translateX(3px);
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		border-top: 1px solid var(--pub-line);
		padding: 20px 0 28px;
		font-size: 11.5px;
		color: var(--pub-muted);
	}

	.legal {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.legal a:hover {
		color: var(--pub-ink);
	}

	@media (max-width: 900px) {
		.cols {
			grid-template-columns: 1fr 1fr;
			gap: 36px;
		}
		.brand-col {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 520px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
