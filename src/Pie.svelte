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

{#if q1 === 100 || q2 === 100}
	{@const bg = q1 === 100 ? 'var(--p1)' : 'var(--p2)'}
	<div class="pie grid ga11" style="width: {width}px; background: {bg};"></div>
{:else}
	{@const paths = makePaths()}
	{@const viewbox = `0 0 ${width} ${width}`}
	{@const transform = `translate(${radius}, ${radius})`}
	<div class="pie grid ga11">
		<svg {width} height={width} viewBox={viewbox}>
			<g {transform}>
				<!-- at 0% the arc's two ends differ only by float noise, which draws a full circle -->
				{#if q1 > 0}
					<path d={paths[0]} fill="var(--p1)" />
				{/if}
				{#if q2 > 0}
					<path d={paths[1]} fill="var(--p2)" />
				{/if}
			</g>
			xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
		</svg>
	</div>
{/if}

<style>
	.pie {
		border-radius: 50%;
		aspect-ratio: 1;
	}
</style>
