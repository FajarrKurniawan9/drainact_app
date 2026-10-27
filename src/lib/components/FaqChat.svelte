<script lang="ts">
	import { QA } from '#lib/data.ts';

	type Message = { from: 'bot' | 'user'; text: string };

	let messages = $state<Message[]>([{ from: 'bot', text: 'Halo! Ada yang ingin ditanyakan?' }]);

	function ask(q: string, a: string) {
		messages.push({ from: 'user', text: q }, { from: 'bot', text: a });
	}
</script>

<div class="card">
	<h2 class="font-extrabold text-lg mb-1">Tanya DrainAct</h2>
	<p class="mut mb-3">Pilih pertanyaan, jawaban langsung muncul.</p>
	<div class="space-y-2 text-xs min-h-[9rem]" aria-live="polite">
		{#each messages as m, i (i)}
			<div
				class={[
					'rounded-xl p-2.5 w-fit',
					m.from === 'user' ? 'bg-b text-white ml-auto' : 'bg-slate-100 dark:bg-zinc-800'
				]}
			>
				{m.text}
			</div>
		{/each}
	</div>
	<div class="flex flex-wrap gap-2 mt-3">
		{#each QA as item (item.q)}
			<button
				class="px-3 py-1.5 text-xs rounded-full border border-b text-b"
				onclick={() => ask(item.q, item.a)}>{item.q}</button
			>
		{/each}
	</div>
</div>
