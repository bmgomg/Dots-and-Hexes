<script>
	import { post } from './utils';

	const { label, onClick } = $props();

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

<div bind:this={_this} class="prompt-button" style="scale: {scale};" onpointerdown={onPointerDown}>
	{label}
</div>

<style>
	.prompt-button {
		font-size: 24px;
		height: 48px;
		border-radius: 999px;
		padding: 0 20px;
		display: grid;
		place-content: center;
		background: -webkit-linear-gradient(-90deg, #fff -400%, #833ab780 100%);
		box-sizing: border-box;
		text-shadow: 2px 2px 2px black;
		border: 2px solid white;
		filter: drop-shadow(0 5px 5px #000000);
		cursor: pointer;
		z-index: 1;
		transition: scale 0.1s;
		letter-spacing: 0.05em;
	}
</style>
