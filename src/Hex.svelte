<script>
	// A hexagon in colored pencil — color 'p1', 'p2' or 'friend' — with 1–4 pips for a robot's level.
	const { size = 50, color, pips = 0 } = $props();

	// drawn in a 56px box, so the pixel-sized pencil filters in Defs fit it
	const HEX = '49.65,15.5 49.65,40.5 28,53 6.35,40.5 6.35,15.5 28,3';
	const xs = $derived(Array.from({ length: pips }, (_, i) => 28 + (i - (pips - 1) / 2) * 10.5));
</script>

<svg class="hex" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
	<!-- paper underneath, so a hexagon in front hides the one behind -->
	<polygon class="paper" points={HEX} />
	<polygon class="pencil {color}" points={HEX} />
	{#each xs as x, i (i)}
		<circle cx={x} cy="28" r="3" />
	{/each}
</svg>

<style>
	.hex {
		display: block;
		overflow: visible;
	}

	.paper {
		fill: var(--bg);
	}

	.pencil {
		stroke-width: 2;
		stroke-linejoin: round;
		filter: url(#crayon);
	}

	.p1 {
		fill: url(#fill1);
		stroke: var(--p1);
	}

	.p2 {
		fill: url(#fill2);
		stroke: var(--p2);
	}

	.friend {
		fill: url(#fill3);
		stroke: var(--friend);
	}

	circle {
		fill: var(--ink);
	}
</style>
