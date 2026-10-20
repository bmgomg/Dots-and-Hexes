<script>
	import Pie from './Pie.svelte';
	import { ss } from './shared.svelte';
</script>

<div class="pie-chart grid psc">
	<Pie width={70} p1={ss.percent(1)} p2={ss.percent(2)} />
</div>

<style>
	.pie-chart {
		aspect-ratio: 1;
		border-radius: 50%;
		border: 2px solid #ffffff;
		opacity: 0.55;
	}
</style>
