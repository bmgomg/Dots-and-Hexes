<script>
	import { fade } from 'svelte/transition';
	import Avatar from './Avatar.svelte';
	import PieChart from './Pie Chart.svelte';
	import Score from './Score.svelte';
	import { ss } from './shared.svelte';
</script>

{#if !ss.launcher && ss.game}
	<div class="scoreboard grid psc" in:fade>
		<Avatar player={1} />
		<Score player={1} />
		<PieChart />
		<Score player={2} />
		<Avatar player={2} />
	</div>
{/if}

<style>
	.scoreboard {
		width: 90%;
		grid: auto / auto 1fr auto 1fr auto;
		align-items: center;
	}
</style>
