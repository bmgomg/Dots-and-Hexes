<script>
	import { ss } from './shared.svelte';

	const HEX = '0.87,-0.5 0.87,0.5 0,1 -0.87,0.5 -0.87,-0.5 0,-1';
</script>

<div class="scoreboard">
	{#each [1, 2] as p (p)}
		<div class="player p{p}" class:active={!ss.game.over && ss.game.turn === p}>
			<svg viewBox="-1 -1 2 2" aria-hidden="true"><polygon points={HEX} /></svg>
			<span class="name">{ss.names[p]}</span>
			<span class="pts">{ss.scores[p]}</span>
		</div>
	{/each}
</div>

<style>
	.scoreboard {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
		border-radius: 12px;
		border: 2px solid transparent;
		background: #ffffff0d;
		transition: border-color 0.2s;
	}

	.player svg {
		width: 22px;
		height: 22px;
		flex: none;
	}

	.p1 polygon {
		fill: var(--p1);
	}

	.p2 polygon {
		fill: var(--p2);
	}

	.p1.active {
		border-color: var(--p1);
	}

	.p2.active {
		border-color: var(--p2);
	}

	.name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pts {
		margin-left: auto;
		font-size: 26px;
		font-variant-numeric: tabular-nums;
	}

	.p1 .pts {
		color: var(--p1);
	}

	.p2 .pts {
		color: var(--p2);
	}
</style>
