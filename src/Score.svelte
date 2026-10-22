<script>
	import NumberFlow from '@number-flow/svelte';
	import { ss } from './shared.svelte';

	const { player } = $props();
</script>

<div class="score grid psc {player === 1 ? 'p1' : 'p2'}"><NumberFlow value={ss.scores[player]} /></div>

<style>
	.score {
		font-size: 40px;
	}

	.p1 {
		color: var(--p1);
	}

	.p2 {
		color: var(--p2-text);
	}
</style>
