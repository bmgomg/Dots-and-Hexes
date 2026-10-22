<script>
	import { fade } from 'svelte/transition';
	import { SCREEN_IN, SCREEN_OUT } from './const';
	import Avatar from './Avatar.svelte';
	import PieChart from './Pie Chart.svelte';
	import Score from './Score.svelte';
	import { ss } from './shared.svelte';
</script>

{#if ss.gameScreen && ss.game}
	<div class="scoreboard grid psc" in:fade={SCREEN_IN} out:fade={SCREEN_OUT}>
		<Avatar player={1} />
		<Score player={1} />
		<PieChart />
		<Score player={2} />
		<Avatar player={2} />
	</div>
{/if}

<style>
	/* placed, not auto-placed (see Stats) */
	.scoreboard {
		grid-area: 2/1;
		width: 90%;
		grid: auto / auto 1fr auto 1fr auto;
		align-items: center;
	}
</style>
