<script>
	// A hexagon in a player's color, with 1–4 pips for a robot's level.
	const { size = 50, fill, pips = 0 } = $props();

	const HEX = '0.87,-0.5 0.87,0.5 0,1 -0.87,0.5 -0.87,-0.5 0,-1';
	const xs = $derived(Array.from({ length: pips }, (_, i) => (i - (pips - 1) / 2) * 0.42));
</script>

<svg class="hex" width={size} height={size} viewBox="-1.05 -1.05 2.1 2.1" aria-hidden="true">
	<polygon points={HEX} style="fill: {fill};" />
	{#each xs as x, i (i)}
		<circle cx={x} cy="0" r="0.13" />
	{/each}
</svg>

<style>
	.hex {
		display: block;
		filter: drop-shadow(0 3px 3px black);
	}

	polygon {
		stroke: #ffffff60;
		stroke-width: 0.06;
		stroke-linejoin: round;
	}

	circle {
		fill: white;
		filter: drop-shadow(0 0 0.05px black);
	}
</style>
