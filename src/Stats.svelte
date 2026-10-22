<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';
	import NumberFlow from '@number-flow/svelte';
	import { ROBOT, SCREEN_IN, SCREEN_OUT } from './const';

	const ave = $derived(ss.stats.plays ? Math.round(ss.stats.total / ss.stats.plays) : 0);
</script>

{#if !ss.launcher}
	<div class="stats grid flowcol" in:fade={SCREEN_IN} out:fade={SCREEN_OUT}>
		<div class="stat p1">
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
		<div class="stat p2">
			<span class="label">wins</span>
			<NumberFlow value={ss.stats.wins2} />
		</div>
	</div>
{/if}

<style>
	/* placed, not auto-placed: the launcher spans rows 1-3, and while it fades out an auto-placed
	   row would be pushed below the grid and shift everything */
	.stats {
		grid-area: 1/1;
		align-self: center;
		grid: auto / auto 1fr auto;
		padding: 0 20px;
		font-size: 15px;
	}

	.stat {
		display: flex;
		gap: 8px;
		align-items: baseline;
		font-size: 22px;
		color: var(--ink);
	}

	.stat.p1 {
		color: var(--p1);
	}

	.stat.p2 {
		color: var(--p2-text);
	}

	.label {
		font-size: 14px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.mid {
		gap: 20px;
	}
</style>
