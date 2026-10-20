<script>
	import { HUMAN } from './const';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';
	import { post } from './utils';

	const { opp } = $props();

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

	const onClick = () => {
		ss.mode.opp = opp;
		ss.persistCommon();

		ss.launcher = true;
		ss.home = false;
	};

	const onPointerDown = () => {
		if (timer) {
			return;
		}

		scale = 0.85;
		timer = post(() => (timer = null), 500);
	};
</script>

<div bind:this={_this} class="op" style="scale: {scale};" onpointerdown={onPointerDown}>
	<!-- you in front, your opponent behind: gold for a friend, cyan for the robot -->
	<div class="icon">
		<div class="back"><Hex size={56} fill={opp === HUMAN ? 'var(--gold)' : 'var(--p2)'} /></div>
		<div class="front"><Hex size={56} fill="var(--p1)" /></div>
	</div>
	<div>{opp === HUMAN ? 'play with friend' : 'play against ai'}</div>
</div>

<style>
	.op {
		display: grid;
		place-items: center;
		font-size: 20px;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition: scale 0.1s;
		gap: 5px;
	}

	.op:hover {
		filter: brightness(1.2);
	}

	.icon {
		display: grid;
		width: 80px;
		height: 66px;
	}

	.back,
	.front {
		grid-area: 1/1;
	}

	.back {
		place-self: start end;
	}

	.front {
		place-self: end start;
	}
</style>
