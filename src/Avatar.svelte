<script>
	import { LEVEL_NAMES, LEVELS, ROBOT } from './const';
	import Hex from './Hex.svelte';
	import { ss } from './shared.svelte';

	const { player } = $props();
	const robot = $derived(player === 2 && ss.mode.opp === ROBOT);
	const level = $derived(LEVELS.indexOf(ss.mode.level) + 1);
	const spin = $derived(ss.game.turn === player && !ss.winner);
	const lost = $derived(ss.winner && ss.winner !== player);
	const nope = $derived(spin || ss.winner || ss.started);
</script>

<div class="avatar grid psc" class:nope onpointerdown={ss.switchFirst}>
	<div class="spinner" class:spin class:lost>
		<Hex size={56} fill={player === 1 ? 'var(--p1)' : 'var(--p2)'} pips={robot ? level : 0} />
	</div>
	{#if robot}
		<div class="level">{LEVEL_NAMES[ss.mode.level]}</div>
	{/if}
</div>

<style>
	.avatar {
		width: 70px;
		place-items: center;
		cursor: pointer;
	}

	.spinner {
		transition: opacity 0.5s;
	}

	.spin {
		animation: spin 0.5s alternate infinite linear;
	}

	.lost {
		opacity: 0.35;
	}

	.level {
		font-size: 13px;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}

	@keyframes spin {
		from {
			transform: rotateY(0deg);
		}
		to {
			transform: rotateY(90deg);
		}
	}
</style>
