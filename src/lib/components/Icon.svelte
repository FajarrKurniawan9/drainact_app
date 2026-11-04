<script lang="ts" module>
	/** Inline stroke icon set (Lucide-style, 24px grid). Keeps the UI dependency-free. */
	const PATHS: Record<string, string> = {
		home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
		map: 'M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3Zm0 0v15m6-12v15',
		'map-pin': 'M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
		'shopping-bag': 'M6 7h12l1 14H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2',
		'gift': 'M20 12v9H4v-9m16 0H4m16 0V8H4v4m8 0v9M12 8H8.5a2.5 2.5 0 1 1 2.5-2.5V8Zm0 0h3.5A2.5 2.5 0 1 0 12 5.5V8Z',
		'coins': 'M9 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 0c0 1.7 2.2 3 5 3s5-1.3 5-3m-10 3v3c0 1.7 2.2 3 5 3s5-1.3 5-3v-9',
		'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
		'users': 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
		'alert-triangle': 'M12 3 2 20h20L12 3Zm0 6v5m0 3v.5',
		'alert-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5m0 3v.5',
		'check': 'M20 6 9 17l-5-5',
		'check-circle': 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.1l-3-3',
		'x': 'M18 6 6 18M6 6l12 12',
		'chevron-right': 'M9 6l6 6-6 6',
		'chevron-left': 'M15 6l-6 6 6 6',
		'chevron-down': 'M6 9l6 6 6-6',
		'arrow-right': 'M4 12h16m-6-6 6 6-6 6',
		'arrow-up-right': 'M7 17 17 7M8 7h9v9',
		'arrow-down': 'M12 4v16m-6-6 6 6 6-6',
		'arrow-up': 'M12 20V4m-6 6 6-6 6 6',
		'plus': 'M12 5v14M5 12h14',
		'minus': 'M5 12h14',
		'search': 'M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
		'filter': 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
		'camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
		'upload': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
		'download': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
		'bell': 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
		'phone': 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
		'message': 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z',
		'truck': 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8ZM5.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm13 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
		'scooter': 'M5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 15h8M16.5 12 15 4H11',
		'building': 'M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 9h3a2 2 0 0 1 2 2v10M8 7h3M8 11h3M8 15h3M2 21h20',
		'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
		'shield-check': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-11 2.5 2.5L15 10',
		'leaf': 'M11 20A7 7 0 0 1 4 13c0-6 8-10 16-10 0 8-4 16-9 17Zm0 0c0-5 2-9 6-11',
		'recycle': 'M7 19H4.8a2 2 0 0 1-1.7-3l2.5-4.2M11 5.5 12.4 3a2 2 0 0 1 3.4 0l2.4 4M17 19h2.2a2 2 0 0 0 1.7-3l-1.3-2.2M9 19l-2-3 3.5-1M8.5 9.8 7 6.5l3.4-1M17 15l1.5 3.3-3.3 1',
		'droplet': 'M12 2.7 6.3 8.6a8 8 0 1 0 11.4 0L12 2.7Z',
		'wind': 'M17.7 7A2.5 2.5 0 1 0 15 3.5M3 8h13a3 3 0 1 1 0 6H8m-5 6h13a3 3 0 1 0 0-6h-1',
		'sun': 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
		'moon': 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
		'clock': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
		'calendar': 'M8 2v4m8-4v4M3 10h18M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z',
		'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h5',
		'printer': 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8Z',
		'eye': 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
		'qr': 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 3h3v3h-3v-3Zm4-3h3m-3 4v.5',
		'settings': 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-2.6a7.8 7.8 0 0 0 0-1.8l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.6-.9L15 3H9l-.4 2.6c-.6.2-1.1.5-1.6.9l-2.4-1-2 3.4 2 1.6a7.8 7.8 0 0 0 0 1.8l-2 1.6 2 3.4 2.4-1c.5.4 1 .7 1.6.9L9 21h6l.4-2.6c.6-.2 1.1-.5 1.6-.9l2.4 1 2-3.4-2-1.6Z',
		'trash': 'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6m4-6v6',
		'zap': 'M13 2 3 14h8l-1 8 10-12h-8l1-8Z',
		'megaphone': 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Zm13-4a5 5 0 0 1 0 10M17 4a9 9 0 0 1 0 16',
		'send': 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
		'activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
		'bar-chart': 'M12 20V10m6 10V4M6 20v-6',
		'trending': 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
		'layers': 'M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5',
		'cpu': 'M4 4h16v16H4V4Zm4 4h8v8H8V8Zm-2 2H2m4 4H2m20-4h-4m4 8h-4M8 2v4m8-4v4M8 18v4m8-4v4',
		'wifi': 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0M12 20v.5M2 9a15 15 0 0 1 20 0',
		'grid': 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
		'external': 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
		'globe': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z',
		'star': 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1L12 2Z',
		'wallet': 'M20 8H5a2 2 0 0 1 0-4h13v4M3 6v13a2 2 0 0 0 2 2h15V8H5a2 2 0 0 1-2-2Zm14 8h.5',
		'package': 'M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8',
		'navigation': 'M3 11 22 2l-9 19-2-8-8-2Z',
		'route': 'M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.4 13.3l7.2-3.8',
		'play': 'M6 4l14 8-14 8V4Z',
		'refresh': 'M21 12a9 9 0 1 1-3-6.7M21 3v6h-6',
		'list': 'M8 6h13M8 12h13M8 18h13M3 6h.5M3 12h.5M3 18h.5',
		'code': 'm16 18 6-6-6-6M8 6l-6 6 6 6',
		'lock': 'M5 11h14v10H5V11Zm3 0V7a4 4 0 0 1 8 0v4',
		'info': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v.5M12 12v5',
		'sparkles': 'm12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3Zm7 10 .9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z',
		'flame': 'M12 22a7 7 0 0 0 7-7c0-5-7-13-7-13S5 10 5 15a7 7 0 0 0 7 7Zm0-4a3 3 0 0 0 3-3c0-2-3-5-3-5s-3 3-3 5a3 3 0 0 0 3 3Z',
		'target': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
		'menu': 'M3 6h18M3 12h18M3 18h18',
		'book': 'M4 4a2 2 0 0 1 2-2h13v20H6a2 2 0 0 1-2-2V4Zm0 14h15',
		'mail': 'M3 6h18v12H3V6Zm0 0 9 7 9-7'
	};

	export const ICONS = Object.keys(PATHS);
</script>

<script lang="ts">
	let {
		name,
		size = 18,
		stroke = 1.8,
		fill = false,
		class: cls = ''
	}: { name: string; size?: number; stroke?: number; fill?: boolean; class?: string } = $props();

	const d = $derived(PATHS[name] ?? PATHS['info']);
</script>

<svg
	class={cls}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={fill ? 'currentColor' : 'none'}
	stroke={fill ? 'none' : 'currentColor'}
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	<path d={d} />
</svg>
