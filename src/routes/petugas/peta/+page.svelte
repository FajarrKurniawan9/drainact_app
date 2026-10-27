<script lang="ts">
	import Heatmap from '#lib/components/Heatmap.svelte';
</script>

<svelte:head><title>Peta Tugas - DrainAct Petugas</title></svelte:head>

<div class="wrap">
	<Heatmap
		variant="petugas"
		title="Peta tugas wilayah"
		subtitle="Pilih wilayah yang padat untuk merencanakan rute armada."
		heightClass="h-96"
	/>
</div>
