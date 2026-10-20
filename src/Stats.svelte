<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';
	import NumberFlow from '@number-flow/svelte';
	import { ROBOT } from './const';

	const ave = $derived(ss.stats.plays ? Math.round(ss.stats.total / ss.stats.plays) : 0);
</script>

{#if !ss.launcher}
	<div class="stats grid flowcol" in:fade>
		<div class="stat">
			<span class="label">wins</span>
			<NumberFlow value={ss.stats.wins1} />
		</div>
		<div class="mid psc grid flowcol">
			<div class="stat">
				<span class="label">plays</span>
				<NumberFlow value={ss.stats.plays} />
			</div>
			{#if ss.mode.opp === ROBOT}
				<div class="stat">
					<span class="label">ave</span>
					<NumberFlow value={ave} suffix="%" />
				</div>
				<div class="stat">
					<span class="label">best</span>
					<NumberFlow value={ss.stats.best} suffix="%" />
				</div>
			{/if}
		</div>
		<div class="stat">
			<span class="label">wins</span>
			<NumberFlow value={ss.stats.wins2} />
		</div>
	</div>
{/if}

<style>
	.stats {
		align-self: center;
		grid: auto / auto 1fr auto;
		padding: 0 20px;
		font-size: 15px;
	}

	.stat {
		gap: 10px;
		align-items: center;
		letter-spacing: 0.08em;
		color: steelblue;
	}

	.label {
		color: var(--ink);
		opacity: 0.6;
	}

	.mid {
		gap: 20px;
	}
</style>
