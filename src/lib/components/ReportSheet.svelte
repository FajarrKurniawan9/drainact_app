<script lang="ts">
	import { tick } from 'svelte';
	import ReportForm from '#lib/components/ReportForm.svelte';
	import { store } from '#lib/store.svelte.ts';
	import { reducedMotion } from '#lib/motion.ts';

	let dialog = $state<HTMLDivElement>();
	let closing = $state(false);
	let dragging = $state(false);
	let dy = $state(0);
	let startY = 0;
	let lastY = 0;
	let lastT = 0;
	let velocity = 0;
	let closeTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (store.reportOpen) {
			closing = false;
			dy = 0;
			tick().then(() => dialog?.focus());
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	function requestClose() {
		if (closing) return;
		closing = true;
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			store.closeReport();
			closing = false;
			dy = 0;
		}, reducedMotion() ? 20 : 240);
	}

	function onKey(e: KeyboardEvent) {
		if (!store.reportOpen) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			requestClose();
		}
		if (e.key === 'Tab' && dialog) {
			const focusable = dialog.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input, textarea, select, a[href]'
			);
			if (!focusable.length) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	function pointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement;
		if (target.closest('button, input, textarea, label, select, a')) return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		dragging = true;
		startY = e.clientY;
		lastY = e.clientY;
		lastT = performance.now();
		velocity = 0;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function pointerMove(e: PointerEvent) {
		if (!dragging) return;
		const raw = e.clientY - startY;
		dy = raw > 0 ? raw : raw * 0.28;
		const now = performance.now();
		const dt = now - lastT;
		if (dt > 0) velocity = (e.clientY - lastY) / dt;
		lastY = e.clientY;
		lastT = now;
	}

	function pointerUp() {
		if (!dragging) return;
		dragging = false;
		if (dy > 110 || velocity > 0.65) requestClose();
		else dy = 0;
	}
</script>

<svelte:window onkeydown={onKey} />

{#if store.reportOpen}
	<div
		class="scrim"
		class:closing
		style:opacity={Math.max(0, 1 - dy / 480)}
	>
		<button class="scrim-close" type="button" aria-label="Tutup formulir" onclick={requestClose}></button>
		<div
			class="sheet"
			class:dragging
			class:closing
			bind:this={dialog}
			role="dialog"
			aria-modal="true"
			aria-label="Formulir pelaporan cepat DrainAct"
			tabindex="-1"
			style:transform={dy ? `translateY(${dy}px) scale(${Math.max(0.96, 1 - dy / 5000)})` : undefined}
			onpointerdown={pointerDown}
			onpointermove={pointerMove}
			onpointerup={pointerUp}
			onpointercancel={pointerUp}
		>
			<div class="grab" aria-hidden="true"><span></span></div>
			<ReportForm variant="modal" onclose={requestClose} onsuccess={() => (closing = false)} />
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 120;
		background: rgba(5, 14, 12, 0.62);
		backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		animation: scrim-in 0.28s var(--ease-out);
	}

	.scrim.closing {
		animation: scrim-out 0.24s var(--ease-out) forwards;
	}

	.scrim-close {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: default;
	}

	.sheet {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 790px;
		max-height: calc(100vh - 48px);
		border-radius: 18px;
		box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.65), 0 12px 30px -18px rgba(0, 0, 0, 0.4);
		animation: sheet-in 0.42s var(--ease-spring);
		transition: transform 0.32s var(--ease-spring);
		touch-action: none;
		outline: none;
	}

	.sheet.dragging {
		transition: none;
	}

	.sheet.closing {
		animation: sheet-out 0.24s var(--ease-out) forwards;
	}

	.grab {
		position: absolute;
		top: 6px;
		left: 0;
		right: 0;
		height: 14px;
		display: none;
		place-items: center;
		z-index: 5;
	}

	.grab span {
		width: 40px;
		height: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.35);
	}

	@keyframes scrim-in {
		from { opacity: 0; }
	}

	@keyframes scrim-out {
		to { opacity: 0; }
	}

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(26px) scale(0.965);
		}
	}

	@keyframes sheet-out {
		to {
			opacity: 0;
			transform: translateY(18px) scale(0.98);
		}
	}

	@media (max-width: 760px) {
		.scrim {
			padding: 0;
			align-items: flex-end;
		}

		.sheet {
			max-height: 94dvh;
			border-radius: 20px 20px 0 0;
			animation: sheet-up 0.42s var(--ease-spring);
		}

		.sheet.closing {
			animation: sheet-down 0.24s var(--ease-out) forwards;
		}

		.grab {
			display: grid;
		}

		@keyframes sheet-up {
			from { transform: translateY(100%); }
		}

		@keyframes sheet-down {
			to { transform: translateY(100%); }
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scrim,
		.sheet,
		.sheet.closing,
		.scrim.closing {
			animation: none;
		}
	}
</style>
