<script>
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const { width, p1, p2 } = $props();
	const radius = $derived(width / 2);

	// What animates is the share, not the path — `d` is nothing CSS can interpolate, and
	// the arc flags flip at the halfway mark, so a tween of the string itself would draw
	// the wrong wedge on the way across. The geometry below is rebuilt from the tweened
	// share each frame instead, which also puts the sweep on the same beat as the
	// NumberFlow score beside it. Tween.of takes its first value without animating, so a
	// restored game paints its wedges in place rather than sweeping up from nothing.
	const tw1 = Tween.of(() => p1, { duration: 500, easing: cubicOut });
	const tw2 = Tween.of(() => p2, { duration: 500, easing: cubicOut });
	const q1 = $derived(tw1.current);
	const q2 = $derived(tw2.current);

	const makePaths = () => {
		const paths = [];

		for (let i = 0; i < 2; i++) {
			const p = i === 0 ? q1 : q2;

			let angle = (p * 360) / 100;

			if (angle >= 180) {
				angle -= 180;
			}

			angle = 90 - angle;

			const rad = (angle * Math.PI) / 180;
			let x = radius * Math.cos(rad);
			let y = radius * Math.sin(rad);

			if (p > 50 === (i === 1)) {
				x = -x;
			}

			const largeArc = p > 50 ? 1 : 0;
			const sweep = i;

			y = Math.abs(y);

			if (p < 25 || p > 75) {
				y = -y;
			}

			const path = `M0,0 0,-${radius} A${radius},${radius} 0 ${largeArc} ${sweep} ${x},${y} Z`;
			paths.push(path);
		}

		return paths;
	};
</script>

<svg class="pie" {width} height={width} viewBox="{-radius} {-radius} {width} {width}" aria-hidden="true">
	<g class="wedges">
		{#if q1 === 100 || q2 === 100}
			<circle class={q1 === 100 ? 'p1' : 'p2'} r={radius} />
		{:else}
			{@const paths = makePaths()}
			<!-- at 0% the arc's two ends differ only by float noise, which draws a full circle -->
			{#if q1 > 0}
				<path class="p1" d={paths[0]} />
			{/if}
			{#if q2 > 0}
				<path class="p2" d={paths[1]} />
			{/if}
		{/if}
	</g>
	<circle class="rim" r={radius} />
</svg>

<style>
	.pie {
		display: block;
		overflow: visible;
		filter: url(#crayon);
	}

	.wedges > * {
		stroke-width: 1.4;
		stroke-linejoin: round;
	}

	.p1 {
		fill: url(#fill1);
		stroke: var(--p1);
	}

	.p2 {
		fill: url(#fill2);
		stroke: var(--p2);
	}

	.rim {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
	}
</style>
