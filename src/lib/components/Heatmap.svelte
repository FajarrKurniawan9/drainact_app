<script lang="ts">
	import { AREAS, AREA_NAMES, HEAT_FILTERS } from '#lib/data.ts';
	import { store } from '#lib/store.svelte.ts';

	let {
		title,
		subtitle,
		variant = 'warga',
		heightClass = 'h-80'
	}: {
		title: string;
		subtitle: string;
		variant?: 'warga' | 'petugas';
		heightClass?: string;
	} = $props();

	const P = $derived(variant === 'petugas');

	/** Reports that pass the current severity filter. */
	const visible = $derived(
		store.reports.filter(
			(r) =>
				store.filter === 'semua' ||
				(store.filter === 'bersih' ? r.done : !r.done && r.sev === store.filter)
		)
	);

	const blobs = $derived(
		AREA_NAMES.map((area) => {
			const [x, y] = AREAS[area];
			const inArea = visible.filter((r) => r.area === area);
			const open = inArea.filter((r) => !r.done);
			const color = !open.length
				? 'rgba(34,197,94,.45)'
				: open.some((r) => r.sev === 'parah')
					? 'rgba(225,29,72,.55)'
					: 'rgba(245,158,11,.5)';
			return { area, x, y, count: inArea.length, color, size: inArea.length ? 50 + inArea.length * 22 : 24 };
		})
	);
</script>

<div class={['card', P && 'border-amber-300 dark:border-amber-800']}>
	<div class="flex flex-wrap justify-between gap-3 mb-4">
		<div>
			<h2 class="font-extrabold text-lg">{title}</h2>
			<p class="mut">{subtitle}</p>
		</div>
		<div class="flex gap-2 items-start text-xs">
			{#each HEAT_FILTERS as f (f)}
				<button
					onclick={() => store.setFilter(f)}
					aria-pressed={store.filter === f}
					class={[
						'px-3 py-1 rounded-md capitalize',
						store.filter === f
							? P
								? 'bg-amber-600 text-white'
								: 'bg-b text-white'
							: 'bg-slate-100 dark:bg-zinc-800'
					]}>{f}</button
				>
			{/each}
		</div>
	</div>

	<div class={['relative rounded-xl overflow-hidden bg-slate-900 text-white', heightClass]}>
		<div
			class="absolute inset-0 opacity-20"
			style="background:radial-gradient(#22C55E 1px,transparent 1px) 0 0/16px 16px"
		></div>
		{#each blobs as b (b.area)}
			<div class="absolute" style:left="{b.x}%" style:top="{b.y}%" aria-hidden="true">
				<div
					class="absolute rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"
					style:width="{b.size}px"
					style:height="{b.size}px"
					style:background={b.color}
				></div>
				<div
					class="relative -translate-x-1/2 -translate-y-1/2 text-center text-[11px] font-bold whitespace-nowrap"
				>
					{b.area}
					<div class="font-normal text-slate-300">{b.count} laporan</div>
				</div>
			</div>
		{/each}
		<ul class="sr-only">
			{#each blobs as b (b.area)}
				<li>{b.area}: {b.count} laporan</li>
			{/each}
		</ul>
	</div>
</div>
