<script>
	import { fade } from 'svelte/transition';
	import { boardSize, ss } from './shared.svelte';

	const bd = $derived(ss.board);
	const game = $derived(ss.game);
	const last = $derived(game.last);
	const lastEdges = $derived(new Set(last?.edges ?? []));
	const sel = $derived(ss.sel);
	// once the other end is picked, only its path stays previewed until it is drawn
	const targets = $derived(
		sel === null || ss.robotTurn ? [] : (ss.movesFrom.get(sel) ?? []).filter((t) => ss.to === null || t.other === ss.to)
	);
	const width = $derived(boardSize());
	const height = $derived((width * bd.view[3]) / bd.view[2]);
	const targetSet = $derived(new Set(targets.map((t) => t.other)));

	// The board is drawn in hex units; k is one screen pixel in those units, so pencil
	// widths, wobble and scribbles come out the same on every board size.
	const k = $derived(bd.view[2] / width);

	let svg;

	const pts = (path) => path.map((i) => `${bd.verts[i].x},${bd.verts[i].y}`).join(' ');
	const n = (x) => +x.toFixed(4);

	// Fixed noise in [-0.5, 0.5) per line, so a line keeps its wobble across renders.
	const wob = (i, j) => {
		const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
		return s - Math.floor(s) - 0.5;
	};

	// A hand-drawn line: it runs a little past both dots and bows slightly.
	const stroke = (e, i) => {
		const a = bd.verts[e.a];
		const b = bd.verts[e.b];
		const ux = b.x - a.x;
		const uy = b.y - a.y;
		const o1 = (1.5 + 2 * wob(i, 0)) * k;
		const o2 = (1.5 + 2 * wob(i, 1)) * k;
		const x1 = a.x - ux * o1 + wob(i, 2) * k;
		const y1 = a.y - uy * o1 + wob(i, 3) * k;
		const x2 = b.x + ux * o2 + wob(i, 4) * k;
		const y2 = b.y + uy * o2 + wob(i, 5) * k;
		const bow = 5 * wob(i, 6) * k;
		const mx = (x1 + x2) / 2 - uy * bow;
		const my = (y1 + y2) / 2 + ux * bow;

		return `M${n(x1)} ${n(y1)}Q${n(mx)} ${n(my)} ${n(x2)} ${n(y2)}`;
	};

	const strokes = $derived(bd.edges.map(stroke));

	// a loose pencil loop around a dot, about 12px across
	const LOOP = [
		[10, -9.6],
		[18, -1.6],
		[12, 12.4],
		[0, 12.4],
		[-11, 12.4],
		[-14, 1.4],
		[-10, -6.6],
		[-6, -13.6],
		[6, -14.6],
		[13, -5.6]
	];

	const loop = (i) => {
		const { x, y } = bd.verts[i];
		const p = LOOP.map(([dx, dy]) => `${n(x + dx * k)} ${n(y + dy * k)}`);
		return `M${p[0]}C${p[1]} ${p[2]} ${p[3]}C${p[4]} ${p[5]} ${p[6]}C${p[7]} ${p[8]} ${p[9]}`;
	};

	// Live dots start a legal move; while a dot is selected, only it and its targets stay live.
	const dotClass = (i) => {
		if (ss.deadDots.has(i)) {
			return 'dot dead';
		}

		if (i === sel || i === ss.to) {
			return 'dot selected';
		}

		if (ss.winner || ss.robotTurn) {
			return 'dot';
		}

		const live = sel === null ? ss.movesFrom.has(i) : targetSet.has(i);

		return live ? 'dot' : 'dot gray';
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
	class:locked={ss.robotTurn || ss.winner}
	class:shake={game.resign}
	viewBox={bd.view.join(' ')}
	{width}
	{height}
	style:--w-line={2 * k}
	style:--w-last={3.4 * k}
	style:--w-ring={2.2 * k}
	style:--dash="{5 * k} {6 * k}"
	in:fade
	role="img"
	aria-label="Game board"
	{onpointerdown}
>
	<!-- Defs' filters and fills are in pixels; these are the same in board units. -->
	<defs>
		<filter id="b-pencil" x="-5%" y="-5%" width="110%" height="110%">
			<feTurbulence type="fractalNoise" baseFrequency={0.9 / k} numOctaves="2" seed="9" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale={2.2 * k} xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="b-crayon" x="-5%" y="-5%" width="110%" height="110%">
			<feTurbulence type="fractalNoise" baseFrequency={1.4 / k} numOctaves="2" seed="5" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale={4 * k} xChannelSelector="R" yChannelSelector="G" />
		</filter>
		{#each [1, 2] as p (p)}
			<pattern
				id="b-fill{p}"
				class="fill{p}"
				patternUnits="userSpaceOnUse"
				width={10 * k}
				height={6 * k}
				patternTransform="rotate({p === 1 ? 24 : -24})"
			>
				<g transform="scale({k})">
					<rect class="wash" width="10" height="6" />
					<path class="scribble" d="M0 5 L2.5 1 L5 5 L7.5 1 L10 5" />
				</g>
			</pattern>
		{/each}
	</defs>

	<g class="hexes">
		{#each game.owner as o, i (i)}
			{#if o > 0}
				<polygon class="hex" class:fresh={ss.fresh && last?.hexes.includes(i)} data-player={o} points={pts(bd.hexes[i].vs)} />
			{/if}
		{/each}
	</g>

	<g class="pencil">
		{#each strokes as d, i (i)}
			{#if game.drawn[i] >= 0}
				<!-- the last move is pressed hard, but not once the game is over -->
				<path class="edge" class:last={lastEdges.has(i) && !ss.winner} class:draw={ss.fresh && lastEdges.has(i)} {d} />
			{/if}
		{/each}

		{#each targets as t (t.other)}
			<polyline class="preview" points={pts(t.move.path)} />
		{/each}

		<!-- dots out of play (every line at them drawn) are half erased -->
		{#each bd.verts as v, i (i)}
			<circle class={dotClass(i)} cx={v.x} cy={v.y} r={(i === sel || i === ss.to ? 4.6 : 3.6) * k} />
		{/each}
	</g>

	<!-- a pencil loop, in the mover's color, marks the selected dot (and the robot's second tap) -->
	{#each [sel, ss.to].filter((i) => i !== null) as i (i)}
		<path class="ring" data-player={game.turn} d={loop(i)} transition:fade={{ duration: 100 }} />
	{/each}
</svg>

<style>
	.board {
		grid-area: 3/1;
		place-self: center;
		display: block;
		overflow: visible;
		cursor: pointer;
		touch-action: manipulation;
	}

	.locked {
		cursor: default;
	}

	.fill1 {
		color: var(--p1);
	}

	.fill2 {
		color: var(--p2);
	}

	.wash {
		fill: currentColor;
		fill-opacity: 0.22;
	}

	.scribble {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linejoin: round;
		opacity: 0.65;
	}

	.hexes {
		filter: url(#b-crayon);
	}

	.hex[data-player='1'] {
		fill: url(#b-fill1);
	}

	.hex[data-player='2'] {
		fill: url(#b-fill2);
	}

	.fresh {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.4s ease-out;
	}

	.pencil {
		filter: url(#b-pencil);
	}

	.edge {
		fill: none;
		stroke: var(--line);
		stroke-width: var(--w-line);
		stroke-linecap: round;
		opacity: 0.9;
	}

	.last {
		stroke: var(--last);
		stroke-width: var(--w-last);
		opacity: 1;
	}

	/* lines are about 1.1 units long, so a 1.3 dash hides the whole line and sliding it in draws it */
	.draw {
		stroke-dasharray: 1.3;
		stroke-dashoffset: 1.3;
		animation: draw 0.3s linear forwards;
	}

	/* the selected dot's moves */
	.preview {
		fill: none;
		stroke: #5b5b62;
		stroke-width: var(--w-line);
		stroke-dasharray: var(--dash);
		stroke-linecap: round;
	}

	.dot {
		fill: var(--ink);
		transition: opacity 0.4s;
	}

	/* can't be tapped right now */
	.gray {
		fill: #9c9ca2;
	}

	.selected {
		fill: var(--last);
	}

	.dead {
		opacity: 0.13;
	}

	.ring {
		fill: none;
		stroke-width: var(--w-ring);
		stroke-linecap: round;
	}

	.ring[data-player='1'] {
		stroke: var(--p1);
	}

	.ring[data-player='2'] {
		stroke: var(--p2);
	}

	.shake {
		animation: shake 0.1s 6 0.5s linear;
	}

	@keyframes shake {
		from {
			transform: scale(1, 1);
		}

		33% {
			transform: scale(1, 1.05);
		}

		66% {
			transform: scale(1.05, 1);
		}

		to {
			transform: scale(1, 1);
		}
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

	@media (prefers-reduced-motion: reduce) {
		.draw,
		.fresh {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
