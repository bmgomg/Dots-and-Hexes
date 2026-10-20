<script>
	import Sphere from '$lib/images/Sphere.webp';
	import { post } from './utils';

	const { img, label, hue = 0, height = 40, disabled, onClick } = $props();
	const filter = $derived(`hue-rotate(${hue}deg)`);

	let _this = $state();
	let scale = $state(1);
	let timer = $state(false);

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.propertyName !== 'scale') {
				return;
			}

			if (scale < 1) {
				scale = 1;
			} else {
				post(onClick);
			}
		};

		_this.addEventListener('transitionend', onTransitionEnd);
		return () => _this.removeEventListener('transitionend', onTransitionEnd);
	});

	const onPointerDown = () => {
		if (timer) {
			return;
		}

		scale = 0.7;

		timer = post(() => (timer = null), 500);
	};
</script>

<div bind:this={_this} class="tool-button" class:with-label={label} style="filter: {filter}; scale: {scale};">
	<div class="content" class:disabled onpointerdown={onPointerDown}>
		<div class="tool-button-background ga11" style="height: {height}px;"></div>
		<img class="ga11" src={Sphere} alt="" width={height} />
		<div class="tool-button-border ga11" style="height: {height + 2}px;"></div>
		<img class="ga11" src={img} alt="" width={height} />
		{#if label}
			<div class="label">
				{#each label as line, i (i)}
					<div>{line}</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.tool-button {
		aspect-ratio: 1;
		transition: scale 0.1s;
	}

	.with-label {
		width: 60px;
	}

	.content {
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.content:hover {
		filter: brightness(1.2);
	}

	.tool-button-background {
		border-radius: 50%;
		background: white;
	}

	.tool-button-border {
		grid-area: 1/1;
		border-radius: 50%;
		border: 2px solid #003585;
		box-sizing: border-box;
		aspect-ratio: 1;
	}

	.label {
		display: grid;
		place-content: center;
		height: 40px;
		font-size: 14px;
		letter-spacing: 1.2px;
		text-align: center;
	}

	.disabled {
		pointer-events: none;
		filter: grayscale(1) opacity(0.4);
	}
</style>
