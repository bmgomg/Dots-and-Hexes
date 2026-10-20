<script>
	import { ss } from './shared.svelte';

	const bd = $derived(ss.board);
	const game = $derived(ss.game);
	const last = $derived(game.last);
	const lastEdges = $derived(new Set(last?.edges ?? []));
	const sel = $derived(ss.sel);
	const targets = $derived(sel === null ? [] : (ss.movesFrom.get(sel) ?? []));
	const targetSet = $derived(new Set(targets.map((t) => t.other)));

	let svg;

	const pts = (path) => path.map((i) => `${bd.verts[i].x},${bd.verts[i].y}`).join(' ');

	// Live dots start a legal move; while a dot is selected, only it and its targets stay live.
	const dotClass = (i) => {
		if (game.over) {
			return 'dot';
		}

		if (i === sel) {
			return 'dot selected';
		}

		const live = sel === null ? ss.movesFrom.has(i) : targetSet.has(i);

		return live ? 'dot live' : 'dot dead';
	};

	const onpointerdown = (e) => {
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		ss.tapAt(pt.matrixTransform(svg.getScreenCTM().inverse()));
	};
</script>

<svg
	bind:this={svg}
	class="board nohi"
	class:locked={ss.robotTurn || game.over}
	viewBox={bd.view.join(' ')}
	role="img"
	aria-label="Game board"
	{onpointerdown}
>
	<defs>
		<radialGradient id="dot-live" fx="0.4" fy="0.3" r="0.6">
			<stop offset="0" stop-color="white" />
			<stop offset="0.12" stop-color="lime" />
			<stop offset="0.65" stop-color="darkgreen" />
			<stop offset="1" stop-color="lime" />
		</radialGradient>
		<radialGradient id="dot-selected" fx="0.4" fy="0.3" r="0.6">
			<stop offset="0" stop-color="white" />
			<stop offset="0.12" stop-color="orange" />
			<stop offset="0.65" stop-color="orangered" />
			<stop offset="1" stop-color="orange" />
		</radialGradient>
	</defs>

	{#each game.owner as o, i (i)}
		{#if o > 0}
			<polygon class="hex" class:fresh={ss.fresh && last?.hexes.includes(i)} data-player={o} points={pts(bd.hexes[i].vs)} />
		{/if}
	{/each}

	{#each bd.edges as e, i (i)}
		{#if game.drawn[i] >= 0 && !lastEdges.has(i)}
			<line class="edge" x1={bd.verts[e.a].x} y1={bd.verts[e.a].y} x2={bd.verts[e.b].x} y2={bd.verts[e.b].y} />
		{/if}
	{/each}

	{#if last}
		{#key last}
			{#each last.edges as i (i)}
				{@const e = bd.edges[i]}
				<line class="edge last" class:draw={ss.fresh} x1={bd.verts[e.a].x} y1={bd.verts[e.a].y} x2={bd.verts[e.b].x} y2={bd.verts[e.b].y} />
			{/each}
		{/key}
	{/if}

	{#each targets as t (t.other)}
		<polyline class="hint" points={pts(t.move.path)} />
	{/each}

	{#each bd.verts as v, i (i)}
		<circle class={dotClass(i)} cx={v.x} cy={v.y} r={i === sel ? 0.13 : 0.1} />
	{/each}

	{#each targets as t (t.other)}
		<circle class="ring" cx={bd.verts[t.other].x} cy={bd.verts[t.other].y} r="0.22" />
	{/each}

	{#if sel !== null}
		<circle class="ring sel" cx={bd.verts[sel].x} cy={bd.verts[sel].y} r="0.22" />
	{/if}
</svg>

<style>
	.board {
		display: block;
		width: 100%;
		height: auto;
		max-height: 60dvh;
		cursor: pointer;
		touch-action: manipulation;
	}

	.locked {
		cursor: default;
	}

	.hex {
		transition: fill 0.3s;
	}

	.hex[data-player='1'] {
		fill: var(--fill1);
	}

	.hex[data-player='2'] {
		fill: var(--fill2);
	}

	.fresh {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.4s ease-out;
	}

	.edge {
		stroke: #ffffff80;
		stroke-width: 0.05;
		stroke-linecap: round;
	}

	.last {
		stroke: var(--orange);
	}

	/* lines are 1 unit long, so a 1.2 dash hides the whole line and sliding it in draws it */
	.draw {
		stroke-dasharray: 1.2;
		stroke-dashoffset: 1.2;
		animation: draw 0.3s linear forwards;
	}

	.hint {
		fill: none;
		stroke: #4682b4a0;
		stroke-width: 0.05;
		stroke-dasharray: 0.12 0.12;
	}

	.dot {
		fill: url(#dot-live);
		transition: opacity 0.2s;
	}

	.dead {
		opacity: 0.25;
	}

	.selected {
		fill: url(#dot-selected);
	}

	.ring {
		fill: none;
		stroke: var(--orange);
		stroke-width: 0.035;
		animation: pulse 0.6s ease-in-out infinite alternate;
	}

	.ring.sel {
		animation: none;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes pop {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
	}

	@keyframes pulse {
		from {
			opacity: 0.35;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.draw,
		.fresh,
		.ring {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
