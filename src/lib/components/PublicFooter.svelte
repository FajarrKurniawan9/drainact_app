<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { FOOTER_LINKS } from '#lib/content.ts';

	const HREFS: Record<string, string> = {
		'Buat Laporan': '/lapor',
		'Heat Map': '/#peta',
		'AI Waste Checker': '/#fitur',
		'Lacak Status': '/profil',
		'Analitik Terbuka': '/petugas',
		'Ajak Kerja Bakti': '/hub#kerja-bakti',
		'Portal DLH dan Armada': '/petugas',
		'DrainAct Eco-Shop': '/toko',
		'Mitra UMKM Daur Ulang': '/toko/seller',
		'Riset & Impact ESG': '/hub#tentang',
		'Misi Kami': '/hub',
		'Tim & Mitra DLH': '/petugas',
		'Metodologi AI & GIS': '/#fitur',
		'Privasi & Data': '/hub#tentang',
		'CS & Helpdesk': '/hub#tentang'
	};
	const hrefFor = (label: string) => HREFS[label] ?? '/hub';
</script>

<footer class="pub-footer">
	<div class="shell-wide">
		<div class="cols">
			<div class="brand-col">
				<div class="brand">
					<span class="mark"><img src="/img/brand-team.webp" alt="" width="44" height="44" /></span>
					<span class="word">Drain<span>Act</span></span>
				</div>
				<p>
					Platform pelaporan tumpukan sampah &amp; drainase tersumbat berbasis lokasi. Dirintis di
					Jawa Timur untuk pencegahan banjir dan lingkungan bersih. Data terbuka untuk warga &amp; DLH.
				</p>
				<div class="live">
					<span class="dot dot-live"></span>
					Sistem telemetri &amp; dispatch terbuka · Malang Raya
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
			<span>© 2026 DrainAct · Pilot Jawa Timur · v1.0</span>
			<div class="legal">
				<a href="/hub#tentang">Privasi</a><span>·</span><a href="/hub#tentang">Syarat</a><span>·</span><a href="/hub#tentang">Keamanan</a><span>·</span><a href="/hub#tentang">Aksesibilitas</a>
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

	.mark {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		overflow: hidden;
		flex: none;
		box-shadow: var(--shadow-sm);
	}

	.mark img {
		width: 100%;
		height: 100%;
		object-fit: cover;
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
