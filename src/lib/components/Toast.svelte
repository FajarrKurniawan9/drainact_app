<script lang="ts">
	import { store } from '#lib/store.svelte.ts';
</script>

<div
	role="status"
	aria-live="polite"
	class={[
		'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl max-w-[90vw]',
		!store.toastMessage && 'hidden'
	]}
>
	{store.toastMessage}
</div>
