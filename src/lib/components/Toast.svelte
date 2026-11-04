<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { store } from '#lib/store.svelte.ts';
</script>

<div
	class="toast"
	class:show={!!store.toastMessage}
	role="status"
	aria-live="polite"
	aria-atomic="true"
>
	<span class="toast-icon"><Icon name="check-circle" size={15} /></span>
	<span class="toast-text">{store.toastMessage ?? ''}</span>
</div>

<style>
	.toast {
		position: fixed;
		left: 50%;
		bottom: 28px;
		z-index: 200;
		translate: -50% 24px;
		opacity: 0;
		pointer-events: none;
		display: flex;
		align-items: center;
		gap: 9px;
		max-width: min(92vw, 520px);
		padding: 11px 16px 11px 12px;
		border-radius: 12px;
		background: rgba(13, 30, 29, 0.94);
		backdrop-filter: blur(14px) saturate(160%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.55);
		color: #fff;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.4;
		transition:
			opacity 0.28s var(--ease-out),
			translate 0.42s var(--ease-spring);
	}

	.toast.show {
		opacity: 1;
		translate: -50% 0;
	}

	.toast-icon {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: rgba(74, 222, 128, 0.16);
		color: #4ade80;
		display: grid;
		place-items: center;
		flex: none;
	}

	.toast-text {
		min-width: 0;
	}
</style>
