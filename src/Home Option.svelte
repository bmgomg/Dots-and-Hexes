<script>
	import { HUMAN } from './const';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';
	import { plop, tap } from './sound.svelte';
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
				plop();
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

		tap();
		scale = 0.85;
		timer = post(() => (timer = null), 500);
	};
</script>

<div bind:this={_this} class="op" style="scale: {scale};" onpointerdown={onPointerDown}>
	<!-- you in front, your opponent behind: yellow for a friend, orange for the robot -->
	<div class="icon">
		<div class="back"><Hex size={52} color={opp === HUMAN ? 'friend' : 'p2'} /></div>
		<div class="front"><Hex size={52} color="p1" /></div>
	</div>
	<div>{opp === HUMAN ? 'play with friend' : 'play against ai'}</div>
</div>

<style>
	.op {
		display: grid;
		place-items: center;
		font-size: 18px;
		cursor: pointer;
		transition: scale 0.1s;
		gap: 5px;
	}

	.op:hover > :last-child {
		background: linear-gradient(180deg, transparent 62%, var(--gold) 62%, var(--gold) 84%, transparent 84%);
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
