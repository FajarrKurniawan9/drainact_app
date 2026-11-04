<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { Snippet } from 'svelte';
	import type { MapPoint } from '#lib/types.ts';

	let {
		height = 420,
		points = [] as MapPoint[],
		route = false,
		labels = true,
		variant = 'dark',
		children
	}: {
		height?: number;
		points?: MapPoint[];
		route?: boolean;
		labels?: boolean;
		variant?: 'dark' | 'light';
		children?: Snippet;
	} = $props();

	let selected = $state<number | null>(null);

	const tone: Record<string, string> = {
		parah: '#EF4444',
		sedang: '#F59E0B',
		kerja: '#10B981',
		bersih: '#10B981'
	};
</script>

<div class="map" class:light={variant === 'light'} style:height="{height}px">
	<svg class="canvas" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		<defs>
			<linearGradient id="mapBase" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stop-color={variant === 'light' ? '#DCEFE9' : '#0E2320'} />
				<stop offset="55%" stop-color={variant === 'light' ? '#CFE7E0' : '#0B1C18'} />
				<stop offset="100%" stop-color={variant === 'light' ? '#C5DFD8' : '#081511'} />
			</linearGradient>
			<pattern id="mapGrid" width="44" height="44" patternUnits="userSpaceOnUse">
				<path d="M44 0H0v44" fill="none" stroke={variant === 'light' ? '#A9CCC3' : '#1B3A34'} stroke-width="0.6" opacity="0.55" />
			</pattern>
			<filter id="mapGlow" x="-60%" y="-60%" width="220%" height="220%">
				<feGaussianBlur stdDeviation="18" result="b" />
				<feMerge>
					<feMergeNode in="b" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
			<radialGradient id="heatRed">
				<stop offset="0%" stop-color="#EF4444" stop-opacity="0.62" />
				<stop offset="100%" stop-color="#EF4444" stop-opacity="0" />
			</radialGradient>
			<radialGradient id="heatAmber">
				<stop offset="0%" stop-color="#F59E0B" stop-opacity="0.55" />
				<stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
			</radialGradient>
			<radialGradient id="heatGreen">
				<stop offset="0%" stop-color="#10B981" stop-opacity="0.5" />
				<stop offset="100%" stop-color="#10B981" stop-opacity="0" />
			</radialGradient>
		</defs>

		<rect width="900" height="500" fill="url(#mapBase)" />
		<rect width="900" height="500" fill="url(#mapGrid)" />

		<!-- districts -->
		<g opacity={variant === 'light' ? 0.55 : 0.8}>
			<path d="M40 120 210 70 340 120 330 255 190 310 60 260Z" fill={variant === 'light' ? '#E8F5F0' : '#122B26'} stroke={variant === 'light' ? '#B5D6CC' : '#1E3D36'} stroke-width="1.2" />
			<path d="M340 120 520 60 680 120 660 260 500 300 330 255Z" fill={variant === 'light' ? '#EFF8F5' : '#102721'} stroke={variant === 'light' ? '#B5D6CC' : '#1E3D36'} stroke-width="1.2" />
			<path d="M500 300 660 260 840 320 820 450 640 470 480 410Z" fill={variant === 'light' ? '#E7F4EF' : '#0F2520'} stroke={variant === 'light' ? '#B5D6CC' : '#1E3D36'} stroke-width="1.2" />
			<path d="M60 260 190 310 330 255 480 410 420 480 130 470Z" fill={variant === 'light' ? '#EAF6F1' : '#102A24'} stroke={variant === 'light' ? '#B5D6CC' : '#1E3D36'} stroke-width="1.2" />
		</g>

		<!-- river -->
		<path d="M-20 60 C 140 130, 180 250, 330 280 S 560 350, 700 300 S 850 360, 930 330" fill="none" stroke={variant === 'light' ? '#8FC7B9' : '#2C7A7A'} stroke-width="17" stroke-linecap="round" opacity="0.45" />
		<path d="M-20 60 C 140 130, 180 250, 330 280 S 560 350, 700 300 S 850 360, 930 330" fill="none" stroke={variant === 'light' ? '#B7E3D7' : '#35C8A8'} stroke-width="2.4" stroke-linecap="round" opacity="0.8" />

		<!-- roads -->
		<g stroke={variant === 'light' ? '#FFFFFF' : '#24463F'} stroke-width="5" stroke-linecap="round" opacity={variant === 'light' ? 0.85 : 0.9}>
			<path d="M0 380 220 320 430 340 640 250 900 290" fill="none" />
			<path d="M120 0 170 180 300 300 380 500" fill="none" />
			<path d="M520 0 500 160 620 260 720 500" fill="none" />
			<path d="M0 200 200 190 380 210 620 130 900 150" fill="none" stroke-width="3.5" />
			<path d="M700 0 690 130 760 260 740 500" fill="none" stroke-width="3" />
		</g>

		<!-- micro roads -->
		<g stroke={variant === 'light' ? '#FFFFFF' : '#1D3A34'} stroke-width="1.2" opacity="0.7">
			<path d="M60 100 300 160 430 120M210 70 220 190 340 250M420 100 700 200M560 350 660 470M90 300 280 380 460 370 600 420" fill="none" />
			<path d="M780 90 800 220 830 340 860 470M50 440 200 420 330 440" fill="none" />
		</g>

		<!-- blocks -->
		<g fill={variant === 'light' ? '#D7EEE6' : '#132E28'} opacity="0.55">
			<rect x="70" y="135" width="70" height="42" rx="4" />
			<rect x="160" y="150" width="42" height="60" rx="4" />
			<rect x="380" y="160" width="58" height="40" rx="4" />
			<rect x="560" y="300" width="64" height="38" rx="4" />
			<rect x="720" y="340" width="52" height="56" rx="4" />
		</g>

		<!-- heat blobs -->
		{#each points as p, i}
			<circle
				cx={p.x * 9}
				cy={p.y * 5}
				r={p.sev === 'parah' ? 74 : p.sev === 'sedang' ? 58 : 46}
				fill={p.sev === 'parah' ? 'url(#heatRed)' : p.sev === 'sedang' ? 'url(#heatAmber)' : 'url(#heatGreen)'}
				class="heat"
				style="animation-delay:{i * 0.6}s"
			/>
		{/each}

		<!-- route -->
		{#if route}
			<path d="M182 380 C 280 350, 320 300, 420 300 S 560 250, 650 210" fill="none" stroke="#35C8A8" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 10" class="route" filter="url(#mapGlow)" />
			<circle cx="650" cy="210" r="8" fill="#10B981" />
			<circle cx="182" cy="380" r="8" fill="#016161" stroke="#A5F0EF" stroke-width="2" />
		{/if}

		<!-- pins -->
		{#each points as p, i}
			<g
				class="pin"
				transform={`translate(${p.x * 9} ${p.y * 5})`}
				onclick={() => (selected = selected === i ? null : i)}
				role="button"
				tabindex="0"
				aria-label={`${p.label}: ${p.count} laporan`}
				onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selected = selected === i ? null : i)}
			>
				<circle r="16" fill={tone[p.sev]} opacity="0.22" class="pin-ping" style="animation-delay:{i * 0.4}s" />
				<circle r="7.5" fill={tone[p.sev]} stroke={variant === 'light' ? '#fff' : '#081511'} stroke-width="2.5" />
				{#if p.sev === 'parah'}
					<circle r="2.4" fill="#fff" class="pin-core" />
				{/if}
			</g>
		{/each}
	</svg>

	<!-- labels -->
	{#if labels}
		<div class="labels" aria-hidden="true">
			<span class="city">Malang</span>
			<span class="place" style="left:26%;top:16%">Universitas Brawijaya</span>
			<span class="place" style="left:52%;top:10%">Ijen Suites</span>
			<span class="place" style="left:63%;top:44%">Alun-Alun Malang</span>
			<span class="place" style="left:13%;top:74%">Sengkaling</span>
			<span class="place" style="left:74%;top:78%">Kedungkandang</span>
		</div>
	{/if}

	<!-- tooltip -->
	{#each points as p, i}
		{#if selected === i}
			<div
				class="tip"
				style:left="{p.x}%"
				style:top="{p.y}%"
				style:transform="translate(-50%, calc(-100% - 18px))"
			>
				<strong>{p.label}</strong>
				<span>{p.count} laporan aktif</span>
			</div>
		{/if}
	{/each}

	{@render children?.()}
</div>

<style>
	.map {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: var(--r-lg);
		background: #0b1c18;
		isolation: isolate;
	}

	.canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.heat {
		transform-origin: center;
		animation: heat-breathe 7s ease-in-out infinite;
	}

	@keyframes heat-breathe {
		0%,
		100% {
			opacity: 0.75;
			transform: scale(0.94);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
	}

	.pin {
		cursor: pointer;
	}

	.pin-ping {
		transform-origin: center;
		animation: pin-pulse 3.2s var(--ease-out) infinite;
	}

	@keyframes pin-pulse {
		0% {
			transform: scale(0.7);
			opacity: 0.55;
		}
		70%,
		100% {
			transform: scale(1.7);
			opacity: 0;
		}
	}

	.pin:hover circle:nth-child(2) {
		r: 10;
	}

	.route {
		animation: route-march 22s linear infinite;
	}

	@keyframes route-march {
		to {
			stroke-dashoffset: -400;
		}
	}

	.labels {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.city {
		position: absolute;
		left: 46%;
		top: 56%;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.16);
		text-transform: uppercase;
	}

	.light .city {
		color: rgba(13, 30, 29, 0.16);
	}

	.place {
		position: absolute;
		font-size: 9.5px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.46);
		white-space: nowrap;
		letter-spacing: 0.01em;
	}

	.light .place {
		color: rgba(13, 30, 29, 0.5);
	}

	.tip {
		position: absolute;
		z-index: 5;
		background: var(--pub-card);
		color: var(--pub-ink);
		border: 1px solid var(--pub-line);
		border-radius: 8px;
		padding: 8px 11px;
		box-shadow: var(--shadow-md);
		display: grid;
		gap: 1px;
		pointer-events: none;
		animation: tip-in 0.22s var(--ease-spring);
	}

	.tip strong {
		font-size: 11.5px;
		font-weight: 700;
	}

	.tip span {
		font-size: 10px;
		color: var(--pub-muted);
	}

	@keyframes tip-in {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% - 10px)) scale(0.94);
		}
	}
</style>
