<script>
	import Pie from './Pie.svelte';
	import { ss } from './shared.svelte';
</script>

<div class="pie-chart grid psc">
	<Pie width={54} p1={ss.percent(1)} p2={ss.percent(2)} />
</div>
